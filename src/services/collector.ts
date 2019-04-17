import DebtItem from "../model/debtItem";
import Debt from "../model/debt";
import {Commit, TreeEntry} from "nodegit";
import {HistoryEventEmitter} from "nodegit/commit";
import DebtHistory from "../model/debtHistory";
import dateHelper from "../utils/dateHelper";
import fs from 'fs';
import path from 'path';
import {Pricer} from "./pricer";

const glob = require("glob");
const nodeGit = require("nodegit");

export default class Collector {
    scanningPath: string;
    pricer: Pricer;
    constructor(scanningPath: string) {
        this.scanningPath = scanningPath;
        this.pricer = new Pricer(scanningPath);
    }

    async collect(): Promise<Debt> {
        const allNotHiddenFiles = this.scanningPath + '/**/*.*';
        const notHiddenFiles = glob.sync(allNotHiddenFiles, {'nodir': true});

        const allHiddenFiles = this.scanningPath + '/**/.*';
        const hiddenFiles = glob.sync(allHiddenFiles, {'nodir': true});

        const allFiles = notHiddenFiles.concat(hiddenFiles);
        const debt = new Debt(this.pricer);

        for (let fileName of allFiles) {
            const file = fs.readFileSync(fileName, 'utf-8');
            this.parseFile(file, fileName, debt);
        }

        return debt;
    }

    async collectHistory(historyNumberOfDays: number): Promise<DebtHistory> {
        const debtHistory = new DebtHistory();

        let repositoryPath;

        try {
            repositoryPath = await nodeGit.Repository.discover(path.resolve(this.scanningPath), 0, '');

            console.info('Start reading the history for the repository: ' + repositoryPath);

        } catch (error) {
            throw new Error('No GIT repository was found');
        }

        const repository = await nodeGit.Repository.open(repositoryPath);
        const firstCommitOnMaster = await repository.getMasterCommit();
        const history = firstCommitOnMaster.history();
        const commits = await this.getRelevantCommit(firstCommitOnMaster, history, historyNumberOfDays);

        for (let commit of commits) {
            const debt = await this.collectDebtFromCommit(commit);
            debt.commitDateTime = commit.date();
            debtHistory.addDebt(debt);
        }

        return debtHistory;
    }

    private async getRelevantCommit(firstCommit: Commit, history: HistoryEventEmitter, historyNumberOfDays: number): Promise<Array<Commit>> {
        return new Promise((resolve) => {
            history.on("end", function(commits: Array<Commit>) {
                // We select one commit per day, the first one we meet
                const startDate = firstCommit.date();
                const startDateTime = startDate.getTime();
                // @debt quality:variable "Maximet: We should create a const somewhere"

                const NUMBER_OF_DAYS_TO_BUILD_HISTORY = historyNumberOfDays * 24 * 3600000;
                const endDateTime = startDateTime - NUMBER_OF_DAYS_TO_BUILD_HISTORY;

                const relevantCommits = new Map<string,Commit>();
                for (let commit of commits){
                    if (commit.date().getTime() < endDateTime){
                        break;
                    }

                    const formattedDate = dateHelper.getDayMonthYearFormat(commit.date());
                    const commitOfTheDay = relevantCommits.get(formattedDate);
                    if (!commitOfTheDay) {
                        relevantCommits.set(formattedDate, commit);
                    }
                }
                return resolve(Array.from(relevantCommits.values()));
            });

            history.start();
        });
    }

    private async collectDebtFromCommit(commit:Commit): Promise<Debt> {
        const debt = new Debt(this.pricer);
        const entries = await this.getFilesFromCommit(commit);
        for (let entry of entries) {
            await this.parseEntry(entry, debt);
        }

        return debt;
    }

    private async getFilesFromCommit(commit:Commit): Promise<Array<TreeEntry>> {
        return new Promise((resolve) => {
            const tree = commit.getTree();
            tree.then(function (tree:any) {
                const walker = tree.walk(true);
                const entryArray = Array<TreeEntry>();
                walker.on("entry", function (entry: TreeEntry) {
                    entryArray.push(entry);
                });

                walker.on("end", function (entries: Array<TreeEntry>) {
                    return resolve(entryArray);
                });
                // Don't forget to call `start()`!
                walker.start();
            });
        });
    }

    private async parseEntry(entry: TreeEntry, debt: Debt): Promise<void> {
        const those = this;
        return new Promise((resolve => {
            const blob = entry.getBlob();
            blob
            .then(function (blob) {
                those.parseFile(String(blob), entry.path(), debt);
                resolve();
            })
            .catch((reason => console.error('Error while parsing the blob of the file', reason)));
        }))
    }

    private parseFile(file: string, fileName: string, debt: Debt): void {
        let lines:Array<string> = file.split('\n');
        /**
         * @debt bug-risk:detection "Maximet: check if the line is a comment or not to avoid wrong debt detection"
         */
        lines = lines.filter(line => line.indexOf('@debt') >= 0 && this.checkIfLineIsAComment(line));

        for (let line of lines) {
            const debtItem = this.parseDebtItemFromDebtLine(line, fileName);
            debt.addDebtItem(debtItem);
        }
    }

    private checkIfLineIsAComment(line:string): boolean {
        const lineTrimed = line.trim();
        const firstChar = lineTrimed.charAt(0);

        return firstChar === '#' ||  firstChar === '*' ||  firstChar === '/';
    }

    private parseDebtItemFromDebtLine(line:string, fileName: string): DebtItem {
        const lineWithoutDebt = line.substr(line.indexOf('@debt') + 6);
        const indexOfComment = lineWithoutDebt.indexOf('"');
        const debtTypesExpression = lineWithoutDebt.substr(0, indexOfComment).trim();
        const types = debtTypesExpression.split(':');

        const debtType = types[0];
        const debtCategory = types[1] ? types[1] : '';

        let comment = line.substr(line.indexOf('"') + 1);
        if (comment.indexOf('"') >= 0) {
            comment = comment.substr(0, comment.indexOf('"'));
        }

        return new DebtItem(debtType, debtCategory, comment, fileName);
    }
}

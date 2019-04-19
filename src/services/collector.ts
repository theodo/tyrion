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
    filter: string;
    constructor(scanningPath: string, filter:string, prices: any) {
        this.scanningPath = scanningPath;
        this.filter = filter;
        this.pricer = new Pricer(prices);
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

        lines = lines.filter(line => line.indexOf('@debt') >= 0 && this.checkIfLineIsAComment(line));

        for (let line of lines) {
            const debtItem = this.parseDebtLine(line, fileName);
            if (!this.filter || this.filter && debtItem.type === this.filter) {
                debt.addDebtItem(debtItem);
            }
        }
    }

    private checkIfLineIsAComment(line:string): boolean {
        const lineTrimed = line.trim();
        const firstChar = lineTrimed.charAt(0);

        return firstChar === '#' ||  firstChar === '*' ||  firstChar === '/';
    }

    /**
     * Parse the different elements in a debt line.
     * A debt line may have a comment at the end.
     * 
     * @param line
     * @param fileName 
     */
    private parseDebtLine(line:string, fileName: string): DebtItem {
        const lineWithoutDebt = line.substr(line.indexOf('@debt') + 6);
    
        const comment = this.parseDebtLineComment(line);
        
        const lineWithoutDebtAndComment = comment === '' ? lineWithoutDebt : lineWithoutDebt.substr(0, lineWithoutDebt.indexOf('"')).trim();
    
        // lineElements can be "DEBT_TYPE:SUB_TYPE" or "DEBT_TYPE:SUB_TYPE price:PRICE"
        const lineElements = lineWithoutDebtAndComment.split(' ');

        // Process DEBT_TYPE:SUB_TYPE
        const types = lineElements[0].split(':');    
        const debtType = types[0];
        const debtCategory = types[1] ? types[1] : '';

        // Process price:PRICE
        const price = this.getPrice(lineElements)

        return new DebtItem(debtType, debtCategory, comment, fileName, price);
    }
    
    /**
     * Return the comment of a line debt if any.
     * 
     * @param line A line without the @debt in it, like : bug:error price:50 "awesome comment"
     */
    private parseDebtLineComment(line: string): string {        
        const comment = line.substr(line.indexOf('"') + 1);
        if (comment.indexOf('"') >= 0) {
            return comment.substr(0, comment.indexOf('"'));
        }
        return '';
    }

    /**
     * If exists, returns the price from a list of lineElements
     * 
     * @param lineElements ["DEBT_TYPE:SUB_TYPE", "price:50"] or ["DEBT_TYPE:SUB_TYPE"]
     */
    private getPrice(lineElements: string[]): number | undefined {

        if (lineElements.length < 2) {
            return undefined
        }
        
        if (lineElements[1].startsWith("price:"))
        {
            parseInt(lineElements[1].split(":")[1]);
        } 

        return undefined
    }
}

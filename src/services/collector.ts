import DebtItem from '../model/debtItem';
import Debt from '../model/debt';
import { Commit, TreeEntry } from 'nodegit';
import { HistoryEventEmitter } from 'nodegit/commit';
import dateHelper from '../utils/dateHelper';
import fs from 'fs';
import glob from 'glob';
import nodeGit from 'nodegit';
import isEmpty from 'lodash/isEmpty';

import { Pricer } from './pricer';
import pathHelper from '../utils/pathHelper';
import CodeQualityInformation from '../model/codeQualityInformation';
import Louvre from '../model/louvre';
import CodeQualityInformationHistory from '../model/codeQualityInformationHistory';
import Joconde from '../model/joconde';
import Config from './config';

const debtTags = ['@debt', 'TODO', 'FIXME'];
const jocondeTags = ['@best', '@standard', 'JOCONDE'];

export default class Collector {
  public scanningPath: string;
  private readonly pricer: Pricer;
  private readonly filter: string;
  private readonly ignorePaths: string[];

  public constructor(scanningPath: string, filter: string, config: Config) {
    this.scanningPath = scanningPath;
    this.filter = filter;
    this.pricer = new Pricer(config.prices);
    this.ignorePaths = config.ignorePaths;
  }

  public async collect(): Promise<CodeQualityInformation> {
    const allNotHiddenFiles = this.scanningPath + '/**/*.*';
    const notHiddenFiles = glob.sync(allNotHiddenFiles, { nodir: true });
    const allHiddenFiles = this.scanningPath + '/**/.*';
    const hiddenFiles = glob.sync(allHiddenFiles, { nodir: true });

    const allFiles = notHiddenFiles.concat(hiddenFiles);
    const debt = new Debt(this.pricer);
    const louvre = new Louvre();
    const codeQualityInformation = new CodeQualityInformation(debt, louvre);

    const targetedFiles = allFiles.filter(
      (path: string): boolean => !pathHelper.isFileMatchPathPatternArray(path, this.ignorePaths),
    );
    for (let fileName of targetedFiles) {
      const file = fs.readFileSync(fileName, 'utf-8');
      this.parseFile(file, fileName, codeQualityInformation);
    }

    return codeQualityInformation;
  }

  public async collectHistory(historyNumberOfDays: number): Promise<CodeQualityInformationHistory> {
    const codeQualityInformationHistory = new CodeQualityInformationHistory();

    const gitPath = pathHelper.getGitRepositoryPath(this.scanningPath);
    const repository = await nodeGit.Repository.open(gitPath);
    const firstCommitOnMaster = await repository.getMasterCommit();
    const history = firstCommitOnMaster.history();
    const commits = await this.getRelevantCommit(firstCommitOnMaster, history, historyNumberOfDays);

    for (let commit of commits) {
      const codeQualityInformation = await this.collectDebtFromCommit(commit);
      codeQualityInformation.commitDateTime = commit.date();
      codeQualityInformationHistory.addCodeQualityInformation(codeQualityInformation);
    }

    return codeQualityInformationHistory;
  }

  //TODO quality "Maximet: put the function navigating through the git history in a service"
  private async getRelevantCommit(
    firstCommit: Commit,
    history: HistoryEventEmitter,
    historyNumberOfDays: number,
  ): Promise<Commit[]> {
    return new Promise((resolve): void => {
      history.on('end', function(commits: Commit[]): void {
        // We select one commit per day, the first one we meet
        const startDate = firstCommit.date();
        const startDateTime = startDate.getTime();
        // @debt quality:variable "Maximet: We should create a const somewhere"

        const NUMBER_OF_DAYS_TO_BUILD_HISTORY = historyNumberOfDays * 24 * 3600000;
        const endDateTime = startDateTime - NUMBER_OF_DAYS_TO_BUILD_HISTORY;

        const relevantCommits = new Map<string, Commit>();
        for (let commit of commits) {
          if (commit.date().getTime() < endDateTime) {
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

  private async collectDebtFromCommit(commit: Commit): Promise<CodeQualityInformation> {
    const debt = new Debt(this.pricer);
    const louvre = new Louvre();
    const codeQualityInformation = new CodeQualityInformation(debt, louvre);
    const entries = await this.getFilesFromCommit(commit);
    for (let entry of entries) {
      await this.parseEntry(entry, codeQualityInformation);
    }

    return codeQualityInformation;
  }

  private async getFilesFromCommit(commit: Commit): Promise<TreeEntry[]> {
    return new Promise((resolve): void => {
      const tree = commit.getTree();
      tree.then(function(tree: nodeGit.Tree): void {
        const walker = tree.walk(true);
        const entryArray = Array<TreeEntry>();
        walker.on('entry', function(entry: TreeEntry): void {
          entryArray.push(entry);
        });

        walker.on('end', (): void => {
          return resolve(entryArray);
        });
        // Don't forget to call `start()`!
        walker.start();
      });
    });
  }

  private async parseEntry(entry: TreeEntry, codeQualityInformation: CodeQualityInformation): Promise<void> {
    const those = this;
    return new Promise((resolve): void => {
      const blob = entry.getBlob();
      blob
        .then(function(blob): void {
          those.parseFile(String(blob), entry.path(), codeQualityInformation);
          resolve();
        })
        .catch((error): void => console.error('Error while parsing the blob of the file', error));
    });
  }

  //TODO: quality "Should split this file into multiple files including one service dedicated to the parsing
  private parseFile(file: string, fileName: string, codeQualityInformation: CodeQualityInformation): void {
    let lines: string[] = file.split('\n');

    lines = lines.filter((line): boolean => this.isComment(line));

    for (let line of lines) {
      const debtTag = this.getTag(line, debtTags);
      if (debtTag) {
        const debtItem = this.parseDebtLine(line, fileName, debtTag);
        if (!this.filter || (this.filter && debtItem.type === this.filter)) {
          codeQualityInformation.debt.addDebtItem(debtItem);
        }
      }

      const jocondeTag = this.getTag(line, jocondeTags);
      if (jocondeTag) {
        const joconde = this.parseJocondeLine(line, fileName, jocondeTag);
        if (!this.filter || (this.filter && joconde.type === this.filter)) {
          codeQualityInformation.louvre.addJoconde(joconde);
        }
      }
    }
  }

  /**
   * Check if the line contains a Tag
   *
   * @param line
   * @param tags
   */
  private getTag(line: string, tags: string[]): string | undefined {
    for (let tag of tags) {
      if (line.indexOf(tag) >= 0) {
        return tag;
      }
    }
  }

  /**
   * Check if the line is a comment
   * @param line
   */
  private isComment(line: string): boolean {
    const lineTrimmed = line.trim();
    const firstChar = lineTrimmed.charAt(0);

    return firstChar === '#' || firstChar === '*' || firstChar === '/';
  }

  /**
   * Parse the different elements in a debt line.
   * A debt line may have a comment at the end.
   *
   * @param line
   * @param fileName
   */
  private parseDebtLine(line: string, fileName: string, debtTag: string): DebtItem {
    const lineWithoutDebtTag = line.substr(line.indexOf(debtTag) + debtTag.length + 1);

    const comment = this.parseDebtLineComment(line);

    const lineWithoutDebtAndComment =
      comment === '' ? lineWithoutDebtTag : lineWithoutDebtTag.substr(0, lineWithoutDebtTag.indexOf('"')).trim();

    // lineElements can be "DEBT_TYPE:SUB_TYPE" or "DEBT_TYPE:SUB_TYPE price:PRICE"
    const lineElements = lineWithoutDebtAndComment.split(' ');

    // Process DEBT_TYPE:SUB_TYPE
    const types = lineElements[0].split(':');
    const debtType = types[0] || 'OTHER';
    const debtCategory = types[1] ? types[1] : '';

    // Process price:PRICE
    const price = this.getPrice(lineElements);
    const { isContagious, isDangerous } = this.getDebtPriorization(lineElements);

    return new DebtItem(debtType, debtCategory, comment, fileName, price, isContagious, isDangerous);
  }

  /**
   * TODO quality "Maximet: parseDebtLine and parseJocondeLine can be refactored"
   *
   * @param line
   * @param fileName
   * @param tag
   */
  private parseJocondeLine(line: string, fileName: string, tag: string): Joconde {
    const lineWithoutTag = line.substr(line.indexOf(tag) + tag.length + 1);

    const comment = this.parseDebtLineComment(line);

    const lineWithoutDebtAndComment =
      comment === '' ? lineWithoutTag : lineWithoutTag.substr(0, lineWithoutTag.indexOf('"')).trim();

    // lineElements can be "TYPE" or "TYPE:SUB_TYPE"
    const lineElements = lineWithoutDebtAndComment.split(' ');

    // Process DEBT_TYPE:SUB_TYPE
    const types = lineElements[0].split(':');
    const type = types[0];
    const category = types[1] ? types[1] : '';

    return new Joconde(type, category, comment, fileName);
  }

  /**
   * Return the comment of a line debt if any.
   *
   * @param line . A line without the @debt tag in it, like : bug:error price:50 "awesome comment"
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
      return undefined;
    }

    const priceAnnotation = lineElements.filter(lineElement => lineElement.startsWith('price:'));
    return !isEmpty(priceAnnotation) ? parseInt(priceAnnotation[0].split(':')[1]) : undefined;
  }

  private getDebtPriorization(lineElements: string[]): { isContagious: boolean; isDangerous: boolean } {
    if (lineElements.length < 2) {
      return { isContagious: false, isDangerous: false };
    }

    const isContagious = lineElements.includes('contagious');
    const isDangerous = lineElements.includes('dangerous');
    return { isContagious, isDangerous };
  }
}

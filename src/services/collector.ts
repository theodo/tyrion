import { Commit, TreeEntry } from 'nodegit';
import fs from 'fs';
import glob from 'glob';
import nodeGit from 'nodegit';

import CommitSelector from './commitSelector';
import pathHelper from '../utils/pathHelper';
import CodeQualityInformation from '../model/codeQualityInformation';
import CodeQualityInformationHistory from '../model/codeQualityInformationHistory';
import { CodeQualityInformationInterface, ConfigInterface } from '../model/types';
import Contributions from '../model/Contributions';
import SyntaxParser from './syntaxParser';
import ContributionDetector from './contributionDetector';

export default class Collector {
  public scanningPath: string;
  private readonly ignorePaths: string[];

  public constructor(scanningPath: string, ignorePaths: string[] = []) {
    this.scanningPath = scanningPath;
    this.ignorePaths = ignorePaths;
  }

  public static createFromConfig(scanningPath: string, config: ConfigInterface): Collector {
    return new Collector(scanningPath, config.ignorePaths);
  }

  public async collect(): Promise<CodeQualityInformationInterface> {
    const allNotHiddenFiles = this.scanningPath + '/**/*.*';
    const notHiddenFiles = glob.sync(allNotHiddenFiles, { nodir: true });
    const allHiddenFiles = this.scanningPath + '/**/.*';
    const hiddenFiles = glob.sync(allHiddenFiles, { nodir: true });

    const allFiles = notHiddenFiles.concat(hiddenFiles);
    const codeQualityInformation = new CodeQualityInformation();

    const targetedFiles = allFiles.filter(
      (path: string): boolean => !pathHelper.isFileMatchPathPatternArray(path, this.ignorePaths),
    );
    for (let fileName of targetedFiles) {
      const file = fs.readFileSync(fileName, 'utf-8');
      const codeQualityInformationFromFile = SyntaxParser.parseFile(file, fileName);
      codeQualityInformation.collectFromCodeQualityInformation(codeQualityInformationFromFile);
    }

    return codeQualityInformation;
  }

  public async collectHistory(historyNumberOfDays: number, branchName: string): Promise<CodeQualityInformationHistory> {
    const codeQualityInformationHistory = new CodeQualityInformationHistory();

    const gitPath = pathHelper.getGitRepositoryPath(this.scanningPath);
    const repository = await nodeGit.Repository.open(gitPath);

    try {
      const lastCommit = await repository.getBranchCommit(branchName);
      const commits = await CommitSelector.getRelevantCommits(lastCommit, historyNumberOfDays);
      for (let commit of commits) {
        const codeQualityInformation = await this.collectDebtFromCommit(commit);
        codeQualityInformation.commitDateTime = commit.date();
        codeQualityInformationHistory.addCodeQualityInformation(codeQualityInformation);
      }

      return codeQualityInformationHistory;
    } catch (e) {
      throw new Error("The branch '" + branchName + "' was not found in this repository");
    }
  }

  public async collectDevsContributions(historyNumberOfDays: number, branchName: string): Promise<Contributions> {
    const gitPath = pathHelper.getGitRepositoryPath(this.scanningPath);
    const repository = await nodeGit.Repository.open(gitPath);

    try {
      const lastCommit = await repository.getBranchCommit(branchName);
      const commits = await CommitSelector.getAllCommitsAfterADate(lastCommit, historyNumberOfDays);
      const contributions = new Contributions();
      for (let commit of commits) {
        const contribution = await ContributionDetector.detectHealersAndScoutFromCommit(commit);
        contributions.addContributionFromDeveloper(commit.author().email(), contribution);
      }

      return contributions;
    } catch (e) {
      throw new Error("The branch '" + branchName + "' was not found in this repository");
    }
  }

  private async collectDebtFromCommit(commit: Commit): Promise<CodeQualityInformationInterface> {
    const codeQualityInformation = new CodeQualityInformation();
    const treeEntries = await this.getTreeEntriesFromCommit(commit);
    for (let entry of treeEntries) {
      const codeQualityInformationFromEntry = await SyntaxParser.parseEntry(entry);
      codeQualityInformation.collectFromCodeQualityInformation(codeQualityInformationFromEntry);
    }

    return codeQualityInformation;
  }

  private async getTreeEntriesFromCommit(commit: Commit): Promise<TreeEntry[]> {
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

        walker.start();
      });
    });
  }
}

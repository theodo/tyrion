import colors from 'colors';
import ProgramProvider from './programProvider';
import Logger from './logger';

const HISTORY_DEFAULT_NUMBER_OF_DAYS = 28;
const DEFAULT_BRANCH = 'master';

export interface ProgramOptionsList {
  path: string | undefined;
  evolution: string | undefined;
  branch: string | undefined;
  nobrowser: boolean | undefined;
  csv: boolean | undefined;
  devs: boolean | undefined;
}

export default class ProgramOrchestrator {
  public constructor(
    private programOptions: ProgramOptionsList,
    private programProvider: ProgramProvider,
    private logger: Logger,
  ) {}
  public selectAnalysis(): void {
    if (this.programOptions.path == null) {
      this.logger.info(
        colors.blue('No path was specified using the -p options. Tyrion will scan the current directory'),
      );
    }

    if (this.programOptions.evolution == null) {
      return this.programProvider.analyzeCurrentState();
    }

    const historyNumberOfDaysInput = parseInt(this.programOptions.evolution);
    const historyNumberOfDays = Number.isNaN(historyNumberOfDaysInput)
      ? HISTORY_DEFAULT_NUMBER_OF_DAYS
      : historyNumberOfDaysInput;
    const branchName = typeof this.programOptions.branch === 'string' ? this.programOptions.branch : DEFAULT_BRANCH;
    this.logger.info(`Tyrion will scan ${historyNumberOfDays} days backward from the last commit on ${branchName}`);

    if (this.programOptions.devs != null) {
      return this.programProvider.analyzeDevsContributions(historyNumberOfDays, branchName);
    }

    this.programProvider.analyzeDebtEvolution(historyNumberOfDays, branchName);
  }
}

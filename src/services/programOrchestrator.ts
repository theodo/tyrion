import colors from 'colors';
import open from 'open';
import TemplateRenderer from './templateRenderer';
import CodeQualityInformationDisplayer from './codeQualityInformationDisplayer';
import CSVExporter from './csvExporter';
import Collector from './collector';
import Pricer from './pricer';
import Config from './config';
import Contributions from '../model/contributions';
import CodeQualityInformationHistory from '../model/codeQualityInformationHistory';
import SyntaxParser from './syntaxParser';

const HISTORY_DEFAULT_NUMBER_OF_DAYS = 28;
const DEFAULT_BRANCH = 'master';

export interface ProgramOptionsList {
  [p: string]: string | undefined;
}

export default class ProgramOrchestrator {
  public constructor(private programOptions: ProgramOptionsList) {}
  public analyzeProgramOption(): void {
    if (this.programOptions.path == null) {
      console.info(colors.blue('No path was specified using the -p options. Tyrion will scan the current directory'));
    }
    const scanDirectory = (this.programOptions.path as string) ?? '.';
    const config = new Config(scanDirectory);
    const pricer = new Pricer(config.prices);
    const syntaxParser = new SyntaxParser(config);
    const collector = new Collector(syntaxParser, config, scanDirectory);

    if (this.programOptions.evolution == null) {
      return this.runCurrentStateAnalysis(collector, pricer, this.programOptions);
    }

    const historyNumberOfDaysInput = parseInt(this.programOptions.evolution);
    const historyNumberOfDays = Number.isNaN(historyNumberOfDaysInput)
      ? HISTORY_DEFAULT_NUMBER_OF_DAYS
      : historyNumberOfDaysInput;
    const branchName = typeof this.programOptions.branch === 'string' ? this.programOptions.branch : DEFAULT_BRANCH;
    console.info(`Tyrion will scan ${historyNumberOfDays} days backward from the last commit on ${branchName}`);

    if (this.programOptions.devs != null) {
      return this.analyzeDevsContributions(collector, historyNumberOfDays, branchName, this.programOptions);
    }

    this.analyzeDebtEvolution(collector, historyNumberOfDays, branchName, config, pricer, this.programOptions);
  }

  private runCurrentStateAnalysis(collector: Collector, pricer: Pricer, programOptions: ProgramOptionsList): void {
    const codeQualityInformation = collector.collect();
    CodeQualityInformationDisplayer.display(codeQualityInformation, pricer);
    const reportPath = TemplateRenderer.renderTypeParetoGraph(codeQualityInformation.debt.debtParetos, pricer);
    this.handleBrowserDisplay(reportPath, programOptions);

    if (programOptions.csv != null) {
      CSVExporter.generateCSV(codeQualityInformation, pricer);
    }
  }

  private analyzeDebtEvolution(
    collector: Collector,
    historyNumberOfDays: number,
    branchName: string,
    config: Config,
    pricer: Pricer,
    programOptions: ProgramOptionsList,
  ) {
    const codeQualityInformationHistoryPromise = collector.collectHistory(historyNumberOfDays, branchName);
    codeQualityInformationHistoryPromise
      .then((codeQualityInformationHistory: CodeQualityInformationHistory): void => {
        const reportPath = TemplateRenderer.renderHistoryGraph(codeQualityInformationHistory, config.standard, pricer);
        this.handleBrowserDisplay(reportPath, programOptions);

        if (programOptions.csv != null) {
          CSVExporter.generateHistoryCSV(codeQualityInformationHistory, pricer, config.standard);
        }
      })
      .catch((error): void => console.error(error));
  }

  private analyzeDevsContributions(
    collector: Collector,
    historyNumberOfDays: number,
    branchName: string,
    programOptions: ProgramOptionsList,
  ) {
    void collector
      .collectDevsContributions(historyNumberOfDays, branchName)
      .then((contributions: Contributions): void => {
        console.log('contributions', contributions);
        const reportPath = TemplateRenderer.renderContributionsGraph(contributions);
        this.handleBrowserDisplay(reportPath, programOptions);
      });
  }

  private handleBrowserDisplay(reportPath: string, programOptions: ProgramOptionsList) {
    console.log(colors.green('The report was generated at ' + reportPath));
    if (programOptions.nobrowser == null) {
      open(reportPath).catch((error): void => console.error(error));
    }
  }
}

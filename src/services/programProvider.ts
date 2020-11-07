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
import { ProgramOptionsList } from './programOrchestrator';
import Logger from './logger';

export default class ProgramProvider {
  public constructor(
    private collector: Collector,
    private pricer: Pricer,
    private programOptions: ProgramOptionsList,
    private config: Config,
    private logger: Logger,
  ) {}

  public analyzeCurrentState(): void {
    const codeQualityInformation = this.collector.collect();
    CodeQualityInformationDisplayer.display(codeQualityInformation, this.pricer);
    const reportPath = TemplateRenderer.renderTypeParetoGraph(codeQualityInformation.debt.debtParetos, this.pricer);
    this.handleBrowserDisplay(reportPath);

    if (this.programOptions.csv != null) {
      CSVExporter.generateCSV(codeQualityInformation, this.pricer);
    }
  }

  public analyzeDebtEvolution(historyNumberOfDays: number, branchName: string): void {
    const codeQualityInformationHistoryPromise = this.collector.collectHistory(historyNumberOfDays, branchName);
    codeQualityInformationHistoryPromise
      .then((codeQualityInformationHistory: CodeQualityInformationHistory): void => {
        const reportPath = TemplateRenderer.renderHistoryGraph(
          codeQualityInformationHistory,
          this.config.standard,
          this.pricer,
        );
        this.handleBrowserDisplay(reportPath);

        if (this.programOptions.csv != null) {
          CSVExporter.generateHistoryCSV(codeQualityInformationHistory, this.pricer, this.config.standard);
        }
      })
      .catch((error): void => this.logger.error(error));
  }

  public analyzeDevsContributions(historyNumberOfDays: number, branchName: string): void {
    void this.collector
      .collectDevsContributions(historyNumberOfDays, branchName)
      .then((contributions: Contributions): void => {
        const reportPath = TemplateRenderer.renderContributionsGraph(contributions);
        this.handleBrowserDisplay(reportPath);
      });
  }

  private handleBrowserDisplay(reportPath: string) {
    this.logger.log(colors.green('The report was generated at ' + reportPath));
    if (this.programOptions.nobrowser == null) {
      open(reportPath).catch((error): void => this.logger.error(error));
    }
  }
}

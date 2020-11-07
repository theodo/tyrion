import ReportGenerator from './reportGenerator';
import CodeQualityInformationDisplayer from './codeQualityInformationDisplayer';
import CSVExporter from './csvExporter';
import Collector from './collector';
import Contributions from '../model/contributions';
import CodeQualityInformationHistory from '../model/codeQualityInformationHistory';

export default class ProgramProvider {
  public constructor(
    private collector: Collector,
    private csvExporter: CSVExporter,
    private codeQualityInformationDisplayer: CodeQualityInformationDisplayer,
    private reportGenerator: ReportGenerator,
  ) {}

  public analyzeCurrentState(): void {
    const codeQualityInformation = this.collector.collect();
    this.codeQualityInformationDisplayer.display(codeQualityInformation);
    this.reportGenerator.renderTypeParetoGraph(codeQualityInformation.debt.debtParetos);
    this.csvExporter.handleCSVGeneration(codeQualityInformation);
  }

  public analyzeDebtEvolution(historyNumberOfDays: number, branchName: string): void {
    const codeQualityInformationHistoryPromise = this.collector.collectHistory(historyNumberOfDays, branchName);
    void codeQualityInformationHistoryPromise.then(
      (codeQualityInformationHistory: CodeQualityInformationHistory): void => {
        this.reportGenerator.renderHistoryGraph(codeQualityInformationHistory);
        this.csvExporter.handleHistoryCSVGeneration(codeQualityInformationHistory);
      },
    );
  }

  public analyzeDevsContributions(historyNumberOfDays: number, branchName: string): void {
    void this.collector
      .collectDevsContributions(historyNumberOfDays, branchName)
      .then((contributions: Contributions): void => {
        this.reportGenerator.renderContributionsGraph(contributions);
      });
  }
}

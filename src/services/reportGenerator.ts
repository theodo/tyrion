import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import colors from 'colors';
import open from 'open';
import DateHelper from '../utils/dateHelper';
import Pricer from './pricer';
import CodeQualityInformationHistory from '../model/codeQualityInformationHistory';
import Contributions from '../model/contributions';
import DebtPareto from '../model/debtPareto';
import { TypeDebtScorePrioritization } from '../model/types';
import Logger from './logger';
import { ProgramOptionsList } from './programOrchestrator';
import Config from './config';

const reportName = 'tyrion_report.html';

export default class ReportGenerator {
  public constructor(
    private pricer: Pricer,
    private logger: Logger,
    private programOptionsList: ProgramOptionsList,
    private config: Config,
  ) {}
  public renderHistoryGraph(codeQualityInformationHistory: CodeQualityInformationHistory): void {
    const file = fs.readFileSync(path.resolve(__dirname, '../template/google_charts/history_report.html'), 'utf-8');

    const debtGraphData = [];

    for (const codeQualityInformation of codeQualityInformationHistory.codeQualityInformationBag) {
      const debtGraphDataPoint = {
        date: DateHelper.getDateAsHtmlTemplate(codeQualityInformation.commitDateTime),
        debtScore: this.pricer.getDebtScoreFromDebt(codeQualityInformation.debt),
      };

      debtGraphData.push(debtGraphDataPoint);
    }

    const reportPath = this.renderGraph(file, { dataDebt: debtGraphData, standard: this.config.standard });
    this.handleBrowserDisplay(reportPath);
  }

  public renderTypeParetoGraph(debtParetos: Map<string, DebtPareto>): void {
    const file = fs.readFileSync(
      path.resolve(__dirname, '../template/google_charts/pareto_by_debt_type_report.html'),
      'utf-8',
    );
    const debtGraphData = this.pricer.getScoreByTypePrioritized(debtParetos);

    const reportPath = this.renderGraph(file, { dataDebt: debtGraphData });
    this.handleBrowserDisplay(reportPath);
  }

  public renderContributionsGraph(contributions: Contributions): void {
    const file = fs.readFileSync(
      path.resolve(__dirname, '../template/google_charts/contribution_report.html'),
      'utf-8',
    );

    const reportPath = this.renderGraph(file, contributions);
    this.handleBrowserDisplay(reportPath);
  }

  private renderGraph(
    template: string,
    data:
      | Contributions
      | { dataDebt: TypeDebtScorePrioritization[] }
      | { dataDebt: { date: string; debtScore: number }[]; standard: number },
  ): string {
    const compiled = _.template(template.toString());
    const htmlGraph = compiled(data);
    const reportPath = path.resolve(reportName);

    fs.writeFileSync(reportPath, htmlGraph);

    return reportPath;
  }

  private handleBrowserDisplay(reportPath: string) {
    this.logger.log(colors.green('The report was generated at ' + reportPath));
    if (this.programOptionsList.nobrowser == null) {
      open(reportPath).catch((error): void => this.logger.error(error));
    }
  }
}

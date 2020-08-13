import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import DateHelper from '../utils/dateHelper';
import Pricer from './pricer';
import CodeQualityInformationHistory from '../model/codeQualityInformationHistory';
import Contributions from '../model/Contributions';
import DebtPareto from '../model/debtPareto';

const reportName = 'tyrion_report.html';

export default class TemplateRenderer {
  private static renderGraph(template: string, data: {}): string {
    const compiled = _.template(template.toString());
    const htmlGraph = compiled(data);
    const reportPath = path.resolve(reportName);

    fs.writeFileSync(reportPath, htmlGraph);

    return reportPath;
  }

  public static renderHistoryGraph(
    codeQualityInformationHistory: CodeQualityInformationHistory,
    standard: number,
    pricer: Pricer,
  ): string {
    const file = fs.readFileSync(path.resolve(__dirname, '../template/google_charts/history_report.html'), 'utf-8');

    const debtGraphData = [];

    for (let codeQualityInformation of codeQualityInformationHistory.codeQualityInformationBag) {
      const debtGraphDataPoint = {
        date: DateHelper.getDateAsHtmlTemplate(codeQualityInformation.commitDateTime),
        debtScore: pricer.getDebtScoreFromDebt(codeQualityInformation.debt),
      };

      debtGraphData.push(debtGraphDataPoint);
    }

    return this.renderGraph(file, { dataDebt: debtGraphData, standard: standard });
  }

  public static renderTypeParetoGraph(debtParetos: Map<string, DebtPareto>, pricer: Pricer): string {
    const file = fs.readFileSync(
      path.resolve(__dirname, '../template/google_charts/pareto_by_debt_type_report.html'),
      'utf-8',
    );
    const debtGraphData = pricer.getScoreByTypePrioritized(debtParetos);

    return this.renderGraph(file, { dataDebt: debtGraphData });
  }

  public static renderContributionsGraph(contributions: Contributions): string {
    const file = fs.readFileSync(
      path.resolve(__dirname, '../template/google_charts/contribution_report.html'),
      'utf-8',
    );

    return this.renderGraph(file, contributions);
  }
}

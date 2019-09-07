import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import DateHelper from '../utils/dateHelper';
import { DebtParetoInterface, CodeQualityInformationHistoryInterface } from '../model/types';

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
    codeQualityInformationHistory: CodeQualityInformationHistoryInterface,
    standard: number,
  ): string {
    const file = fs.readFileSync(path.resolve(__dirname, '../template/google_charts/history_report.html'), 'utf-8');

    const debtGraphData = [];

    for (let codeQualityInformation of codeQualityInformationHistory.codeQualityInformationBag) {
      const debtGraphDataPoint = {
        date: DateHelper.getDateAsHtmlTemplate(codeQualityInformation.commitDateTime),
        debtScore: codeQualityInformation.debt.debtScore,
      };

      debtGraphData.push(debtGraphDataPoint);
    }

    return this.renderGraph(file, { dataDebt: debtGraphData, standard: standard });
  }

  public static renderTypeParetoGraph(debtParetos: Map<string, DebtParetoInterface>): string {
    const file = fs.readFileSync(
      path.resolve(__dirname, '../template/google_charts/pareto_by_debt_type_report.html'),
      'utf-8',
    );

    return this.renderGraph(file, { dataDebt: debtParetos });
  }
}

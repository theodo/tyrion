import fs from 'fs';

import Pricer from './pricer';
import CodeQualityInformation from '../model/codeQualityInformation';
import CodeQualityInformationHistory from '../model/codeQualityInformationHistory';
import DateHelper from '../utils/dateHelper';
import { PRIORITIZATION_TYPES } from '../model/debtPareto';

const csvFileName = 'tyrion_report.csv';

export default class CSVExporter {
  //ADR I didn't use a lib because the tradeoff between adding a lib and rewriting a simple csv function wasn't worth it
  public static generateCSV(codeQualityInformation: CodeQualityInformation, pricer: Pricer): string {
    let csvString = 'type, category, file, score, comment\n';

    for (const debtPareto of codeQualityInformation.debt.debtParetos.values()) {
      for (const debtItem of debtPareto.debtItems.values()) {
        csvString += `
        ${debtItem.type},
        ${debtItem.category},
        ${debtItem.fileName},
        ${pricer.getPriceFromDebtItem(debtItem)},
        ${debtItem.comment}
`;
      }
    }

    csvString += `Total,,${pricer.getDebtScoreFromDebt(codeQualityInformation.debt)},`;

    fs.writeFileSync(csvFileName, csvString);

    return csvFileName;
  }

  public static generateHistoryCSV(
    codeQualityInformationHistory: CodeQualityInformationHistory,
    pricer: Pricer,
    standard: number,
  ): string {
    console.info('Start generating the CSV report');
    let csvString = 'Date, Critical Debt, Dangerous Debt, Contagious Debt, Idle Debt, Standard\n';

    //TODO: sort by date the results
    for (const codeQualityInformation of codeQualityInformationHistory.codeQualityInformationBag.values()) {
      const priceDebt = pricer.getDebtScoreByCriticity(codeQualityInformation.debt.debtParetos);
      csvString += `
      ${DateHelper.getFrenchDayMonthYearFormat(codeQualityInformation.commitDateTime)},
      ${priceDebt[PRIORITIZATION_TYPES.IS_CRITICAL]},
      ${priceDebt[PRIORITIZATION_TYPES.IS_DANGEROUS]},
      ${priceDebt[PRIORITIZATION_TYPES.IS_CONTAGIOUS]},
      ${priceDebt[PRIORITIZATION_TYPES.IS_IDLE]},
      ${standard}`;
    }

    fs.writeFileSync(csvFileName, csvString);
    console.info('CSV report has been generated');

    return csvFileName;
  }
}

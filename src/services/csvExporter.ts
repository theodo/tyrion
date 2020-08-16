import fs from 'fs';

import Pricer from './pricer';
import CodeQualityInformation from '../model/codeQualityInformation';

const csvFileName = 'tyrion_report.csv';

export default class CSVExporter {
  //ADR I didn't use a lib because the tradeoff between adding a lib and rewriting a simple csv function wasn't worth it
  public static generateCSV(codeQualityInformation: CodeQualityInformation, pricer: Pricer): string {
    let csvString = 'type, file, score, comment\n';

    for (const debtPareto of codeQualityInformation.debt.debtParetos.values()) {
      for (const debtItem of debtPareto.debtItems.values()) {
        csvString +=
          debtItem.type +
          ',' +
          debtItem.fileName +
          ',' +
          pricer.getPriceFromDebtItem(debtItem) +
          ',' +
          debtItem.comment +
          '\n';
      }
    }

    csvString += 'Total,,' + pricer.getDebtScoreFromDebt(codeQualityInformation.debt) + ',';

    fs.writeFileSync(csvFileName, csvString);

    return csvFileName;
  }
}

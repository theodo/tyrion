import Table from 'cli-table';
import colors from 'colors';
import {
  DebtItemInterface,
  DebtParetoInterface,
  CodeQualityInformationInterface,
  DebtInterface,
} from '../model/types';

export default class CodeQualityInformationDisplayer {
  public static display(codeQualityInformation: CodeQualityInformationInterface): void {
    if (codeQualityInformation.debt) {
      this.displayDebtSummary(codeQualityInformation.debt);
    }
  }

  private static displayDebtSummary(debt: DebtInterface): void {
    let totalItems = 0;
    console.info(colors.green('\n ♻️♻️♻️ Debt Information ♻️♻️♻️'));

    const table = new Table({
      head: [colors.bold('Type'), colors.bold('Score'), colors.bold('File'), colors.bold('Comment')],
    });

    debt.debtParetos.forEach((debtPareto: DebtParetoInterface): void => {
      const debtItemsNumber = debtPareto.debtItems.length;
      debtPareto.debtItems.map((debtItem: DebtItemInterface): void => {
        table.push([debtItem.type, debt.pricer.getPrice(debtItem), debtItem.fileName, debtItem.comment]);
      });
      totalItems += debtItemsNumber;
    });

    table.push([
      colors.red(colors.bold('Total')),
      colors.red(colors.bold('' + debt.debtScore)),
      colors.red(colors.bold(totalItems + ' debt items')),
    ]);

    console.log(table.toString());
  }
}

import Table from 'cli-table';
import colors from 'colors';

import DebtPareto from '../model/debtPareto';
import DebtItem from '../model/debtItem';
import Debt from '../model/debt';
import CodeQualityInformation from '../model/codeQualityInformation';
import Louvre from '../model/louvre';
import JocondePareto from '../model/jocondePareto';
import Joconde from '../model/joconde';

export default class CodeQualityInformationDisplayer {
  public static display(codeQualityInformation: CodeQualityInformation): void {
    if (codeQualityInformation.debt) {
      this.displayDebtSummary(codeQualityInformation.debt);
    }

    if (codeQualityInformation.louvre) {
      this.displayLouvre(codeQualityInformation.louvre);
    }
  }

  private static displayDebtSummary(debt: Debt): void {
    let totalItems = 0;
    console.info(colors.green('\n ♻️♻️♻️ Debt Information ♻️♻️♻️'));

    const table = new Table({
      head: [colors.bold('Type'), colors.bold('Score'), colors.bold('File'), colors.bold('Comment')],
    });

    debt.debtParetos.forEach((debtPareto: DebtPareto): void => {
      const debtItemsNumber = debtPareto.debtItems.length;
      debtPareto.debtItems.map((debtItem: DebtItem): void => {
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

  private static displayLouvre(louvre: Louvre): void {
    let totalItems = 0;
    console.info(colors.green('\n 🖼🖼🖼 Quality Information 🖼🖼🖼'));

    const table = new Table({
      head: [colors.bold('Type'), colors.bold('File'), colors.bold('Comment')],
    });

    louvre.jocondeParetos.forEach((jocondePareto: JocondePareto): void => {
      const jocondeNumber = jocondePareto.jocondes.length;
      jocondePareto.jocondes.map((joconde: Joconde): void => {
        table.push([joconde.type, joconde.fileName, joconde.comment]);
      });
      totalItems += jocondeNumber;
    });

    table.push([colors.red(colors.bold('Total')), colors.red(colors.bold(totalItems + ' debt items'))]);

    console.log(table.toString());
  }
}

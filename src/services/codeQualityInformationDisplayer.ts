import Table from 'cli-table';
import colors from 'colors';
import {
  CodeQualityInformationInterface,
  DebtInterface,
  DebtItemInterface,
  JocondeInterface,
  JocondeParetoInterface,
  LouvreInterface,
} from '../model/types';
import Pricer from './pricer';
import DebtPareto from '../model/debtPareto';
import Logger from './logger';

export default class CodeQualityInformationDisplayer {
  public constructor(private logger: Logger, private pricer: Pricer) {}
  public display(codeQualityInformation: CodeQualityInformationInterface): void {
    this.displayDebtSummary(codeQualityInformation.debt);
    this.displayLouvre(codeQualityInformation.louvre);
  }

  private displayDebtSummary(debt: DebtInterface): void {
    let totalItems = 0;
    this.logger.info(colors.green('\n ♻️Debt Information ♻'));

    const table = new Table({
      head: [colors.bold('Type'), colors.bold('Score'), colors.bold('File'), colors.bold('Comment')],
    });

    debt.debtParetos.forEach((debtPareto: DebtPareto): void => {
      const debtItemsNumber = debtPareto.debtItems.length;
      debtPareto.debtItems.map((debtItem: DebtItemInterface): void => {
        table.push([debtItem.type, this.pricer.getPriceFromDebtItem(debtItem), debtItem.fileName, debtItem.comment]);
      });
      totalItems += debtItemsNumber;
    });

    table.push([
      colors.red(colors.bold('Total')),
      colors.red(colors.bold(`${this.pricer.getDebtScoreFromDebt(debt)}`)),
      colors.red(colors.bold(`${totalItems} debt items`)),
    ]);

    this.logger.log(table.toString());
  }

  private displayLouvre(louvre: LouvreInterface): void {
    let totalItems = 0;
    this.logger.info(colors.green('\n 🖼 Quality Information 🖼'));

    const table = new Table({
      head: [colors.bold('Type'), colors.bold('File'), colors.bold('Comment')],
    });

    louvre.jocondeParetos.forEach((jocondePareto: JocondeParetoInterface): void => {
      const jocondeNumber = jocondePareto.jocondes.length;
      jocondePareto.jocondes.map((joconde: JocondeInterface): void => {
        table.push([joconde.type, joconde.fileName, joconde.comment]);
      });
      totalItems += jocondeNumber;
    });

    table.push([colors.red(colors.bold('Total')), colors.red(colors.bold(`${totalItems} debt items`))]);
    this.logger.log(table.toString());
  }
}

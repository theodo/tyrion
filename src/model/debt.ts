import DebtPareto from './debtPareto';
import { DebtItemInterface, DebtInterface } from './types';

export default class Debt implements DebtInterface {
  public debtParetos: Map<string, DebtPareto>;

  public constructor() {
    this.debtParetos = new Map<string, DebtPareto>();
  }

  public addDebtItem(debtItem: DebtItemInterface): void {
    let debtPareto = this.debtParetos.get(debtItem.type);
    if (debtPareto) {
      debtPareto.addDebtItem(debtItem);
    } else {
      debtPareto = new DebtPareto(debtItem.type);
      debtPareto.addDebtItem(debtItem);
      this.debtParetos.set(debtItem.type, debtPareto);
    }
  }

  public collectFromDebt(debt: Debt): void {
    for (const debtPareto of debt.debtParetos.values()) {
      for (const debtItem of debtPareto.debtItems.values()) {
        this.addDebtItem(debtItem);
      }
    }
  }
}

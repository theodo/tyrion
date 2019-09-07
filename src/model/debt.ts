import DebtPareto from './debtPareto';
import { DebtItemInterface, PricerInterface, DebtParetoInterface, DebtInterface } from './types';

export default class Debt implements DebtInterface {
  public debtParetos: Map<string, DebtParetoInterface>;
  public debtScore: number;
  public pricer: PricerInterface;

  public constructor(pricer: PricerInterface) {
    this.debtParetos = new Map<string, DebtParetoInterface>();
    this.debtScore = 0;
    this.pricer = pricer;
  }

  public addDebtItem(debtItem: DebtItemInterface): void {
    this.debtScore += this.pricer.getPrice(debtItem);

    let debtPareto = this.debtParetos.get(debtItem.type);
    if (debtPareto) {
      debtPareto.addDebtItem(debtItem);
    } else {
      debtPareto = new DebtPareto(debtItem.type, this.pricer);
      debtPareto.addDebtItem(debtItem);
      this.debtParetos.set(debtItem.type, debtPareto);
    }
  }
}

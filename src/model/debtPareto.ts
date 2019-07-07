import DebtItem from './debtItem';
import { Pricer } from '../services/pricer';

export default class DebtPareto {
  public debtItems: DebtItem[];
  public type: string;

  public debtScore: number;
  private pricer: Pricer;

  public constructor(type: string, pricer: Pricer) {
    this.type = type;
    this.debtItems = new Array<DebtItem>();
    this.debtScore = 0;
    this.pricer = pricer;
  }

  public addDebtItem(debtItem: DebtItem): void {
    this.debtItems.push(debtItem);
    this.debtScore += this.pricer.getPrice(debtItem);
  }
}

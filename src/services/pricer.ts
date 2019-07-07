import DebtItem from '../model/debtItem';
import { Prices } from './config';

export class Pricer {
  private readonly prices: Prices;

  public constructor(prices: Prices) {
    this.prices = prices;
  }

  /**
   * @param debt
   */
  public getPrice(debt: DebtItem): number {
    if (debt.price) {
      return debt.price;
    }

    return this.prices[debt.type] ? this.prices[debt.type] : 1;
  }
}

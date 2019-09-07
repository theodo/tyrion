import { DebtItemInterface, PricesInterface } from '../model/types';

export class Pricer {
  private readonly prices: PricesInterface;

  public constructor(prices: PricesInterface = {}) {
    this.prices = prices;
  }

  /**
   * @param debt
   */
  public getPrice(debt: DebtItemInterface): number {
    if (debt.price) {
      return debt.price;
    }

    return this.prices[debt.type] ? this.prices[debt.type] : 1;
  }
}

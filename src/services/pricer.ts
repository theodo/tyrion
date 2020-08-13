import { DebtItemInterface, PricesInterface, PrioritizationTypes } from '../model/types';
import DebtPareto from '../model/debtPareto';
import Debt from '../model/debt';

export default class Pricer {
  private readonly prices: PricesInterface;

  public constructor(prices: PricesInterface = {}) {
    this.prices = prices;
  }

  public getScoreByTypePrioritized(
    debtParetos: Map<string, DebtPareto>,
  ): {
    type: string;
    debtScoreByPrioritization: { isCritical: number; isDangerous: number; isContagious: number; isIdle: number };
  }[] {
    const debtGraphData = [];

    for (let debtPareto of debtParetos.values()) {
      const debtGraphDataColumn = {
        type: debtPareto.type,
        debtScoreByPrioritization: this.getScoreByPrioritizationFromDebtPareto(debtPareto),
      };

      debtGraphData.push(debtGraphDataColumn);
    }
    return debtGraphData;
  }

  /**
   *
   * Get the debt score of one debt item
   *
   * @param debt
   */
  public getPriceFromDebtItem(debt: DebtItemInterface): number {
    return this.prices[debt.type] ? this.prices[debt.type] : 1;
  }

  /**
   * Get the debt score of one debtPareto
   *
   * @param debtPareto
   */
  public getDebtScoreFromDebtPareto(debtPareto: DebtPareto): number {
    let debtScore = 0;
    for (const debtItem of debtPareto.debtItems.values()) {
      debtScore += this.getPriceFromDebtItem(debtItem);
    }

    return debtScore;
  }

  /**
   * Get the debt score of one debt
   *
   * @param debt
   */
  public getDebtScoreFromDebt(debt: Debt): number {
    let debtScore = 0;
    for (const debtPareto of debt.debtParetos.values()) {
      debtScore += this.getDebtScoreFromDebtPareto(debtPareto);
    }

    return debtScore;
  }

  /**
   * This function is used to calculate score between the different prioritization type
   * @param debtParetos
   */
  private getScoreByPrioritizationFromDebtPareto(
    debtParetos: DebtPareto,
  ): { [prioritizationType in PrioritizationTypes]: number } {
    const debtScoreByPrioritization = {
      isCritical: 0,
      isDangerous: 0,
      isContagious: 0,
      isIdle: 0,
    };

    for (const debtItem of debtParetos.debtItems.values()) {
      debtScoreByPrioritization[DebtPareto.getPrioritizationType(debtItem)] += this.getPriceFromDebtItem(debtItem);
    }

    return debtScoreByPrioritization;
  }
}

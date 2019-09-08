import { PricerInterface, DebtItemInterface, PrioritizationTypes, DebtParetoInterface } from './types';

export const PRIORITIZATION_TYPES: { [prioritizationType: string]: PrioritizationTypes } = {
  IS_CRITICAL: 'isCritical',
  IS_DANGEROUS: 'isDangerous',
  IS_CONTAGIOUS: 'isContagious',
  IS_IDLE: 'isIdle',
};

export default class DebtPareto implements DebtParetoInterface {
  public debtItems: DebtItemInterface[];
  public type: string;

  public debtScore: number;
  public debtScoreByPrioritization: { [prioritizationType in PrioritizationTypes]: number };
  private pricer: PricerInterface;

  public constructor(type: string, pricer: PricerInterface) {
    this.type = type;
    this.debtItems = new Array<DebtItemInterface>();
    this.debtScore = 0;
    this.debtScoreByPrioritization = {
      isCritical: 0,
      isDangerous: 0,
      isContagious: 0,
      isIdle: 0,
    };
    this.pricer = pricer;
  }

  public addDebtItem(debtItem: DebtItemInterface): void {
    this.debtItems.push(debtItem);
    const debtScore = this.pricer.getPrice(debtItem);
    this.debtScore += debtScore;
    this.debtScoreByPrioritization[DebtPareto.getPrioritizationType(debtItem)] += debtScore;
  }

  private static getPrioritizationType({ isContagious, isDangerous }: DebtItemInterface): PrioritizationTypes {
    switch (true) {
      case isContagious && isDangerous:
        return PRIORITIZATION_TYPES.IS_CRITICAL;
      case isDangerous:
        return PRIORITIZATION_TYPES.IS_DANGEROUS;
      case isContagious:
        return PRIORITIZATION_TYPES.IS_CONTAGIOUS;
      default:
        return PRIORITIZATION_TYPES.IS_IDLE;
    }
  }
}

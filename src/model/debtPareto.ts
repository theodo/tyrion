import { DebtItemInterface, PrioritizationTypes } from './types';

export const PRIORITIZATION_TYPES: { [prioritizationType: string]: PrioritizationTypes } = {
  IS_CRITICAL: 'isCritical',
  IS_DANGEROUS: 'isDangerous',
  IS_CONTAGIOUS: 'isContagious',
  IS_IDLE: 'isIdle',
};

export default class DebtPareto {
  public debtItems: DebtItemInterface[];
  public type: string;

  public constructor(type: string) {
    this.type = type;
    this.debtItems = new Array<DebtItemInterface>();
  }

  public addDebtItem(debtItem: DebtItemInterface): void {
    this.debtItems.push(debtItem);
  }

  public static getPrioritizationType({ isContagious, isDangerous }: DebtItemInterface): PrioritizationTypes {
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

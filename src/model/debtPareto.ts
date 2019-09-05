import DebtItem from './debtItem';
import { Pricer } from '../services/pricer';

type PrioritizationTypes = 'isCritical' | 'isDangerous' | 'isContagious' | 'isIdle';
const PRIORIZATION_TYPES: { [prioritizationType: string]: PrioritizationTypes } = {
  IS_CRITICAL: 'isCritical',
  IS_DANGEROUS: 'isDangerous',
  IS_CONTAGIOUS: 'isContagious',
  IS_IDLE: 'isIdle',
};

export default class DebtPareto {
  public debtItems: DebtItem[];
  public type: string;

  public debtScore: number;
  public debtScoreByPrioritization: { [prioritizationType in PrioritizationTypes]: number };
  private pricer: Pricer;

  public constructor(type: string, pricer: Pricer) {
    this.type = type;
    this.debtItems = new Array<DebtItem>();
    this.debtScore = 0;
    this.debtScoreByPrioritization = {
      isCritical: 0,
      isDangerous: 0,
      isContagious: 0,
      isIdle: 0,
    };
    this.pricer = pricer;
  }

  public addDebtItem(debtItem: DebtItem): void {
    this.debtItems.push(debtItem);
    const debtScore = this.pricer.getPrice(debtItem);
    this.debtScore += debtScore;
    this.debtScoreByPrioritization[DebtPareto.getPrioritizationType(debtItem)] += debtScore;
  }

  private static getPrioritizationType({ isContagious, isDangerous }: DebtItem): PrioritizationTypes {
    switch (true) {
      case isContagious && isDangerous:
        return PRIORIZATION_TYPES.IS_CRITICAL;
      case isDangerous:
        return PRIORIZATION_TYPES.IS_DANGEROUS;
      case isContagious:
        return PRIORIZATION_TYPES.IS_CONTAGIOUS;
      default:
        return PRIORIZATION_TYPES.IS_IDLE;
    }
  }
}

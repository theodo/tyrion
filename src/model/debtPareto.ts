import DebtItem from './debtItem';
import { Pricer } from '../services/pricer';

type PriorizationTypes = 'isCritical' | 'isDangerous' | 'isContagious' | 'isIdle';
const PRIORIZATION_TYPES: { [priorizationType: string]: PriorizationTypes } = {
  IS_CRITICAL: 'isCritical',
  IS_DANGEROUS: 'isDangerous',
  IS_CONTAGIOUS: 'isContagious',
  IS_IDLE: 'isIdle',
};

export default class DebtPareto {
  public debtItems: DebtItem[];
  public type: string;

  public debtScore: number;
  public debtScoreByPriorization: { [priorizationType in PriorizationTypes]: number };
  private pricer: Pricer;

  public constructor(type: string, pricer: Pricer) {
    this.type = type;
    this.debtItems = new Array<DebtItem>();
    this.debtScore = 0;
    this.debtScoreByPriorization = {
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
    this.debtScoreByPriorization[DebtPareto.getPriorizationType(debtItem)] += debtScore;
  }

  private static getPriorizationType({ isContagious, isDangerous }: DebtItem): PriorizationTypes {
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

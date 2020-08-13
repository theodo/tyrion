import DebtPareto from './debtPareto';

export type PrioritizationTypes = 'isCritical' | 'isDangerous' | 'isContagious' | 'isIdle';

export type ItemInterface = {
  category: string;
  comment: string;
  fileName: string;
  type: string;
};

export type DebtItemInterface = ItemInterface & {
  isContagious: boolean;
  isDangerous: boolean;
};
export type JocondeInterface = ItemInterface;

export type JocondeParetoInterface = {
  jocondes: JocondeInterface[];
  type: string;
  addJoconde: (joconde: JocondeInterface) => void;
};

export type DebtInterface = {
  debtParetos: Map<string, DebtPareto>;
  addDebtItem: (debtItem: DebtItemInterface) => void;
  collectFromDebt: (debt: DebtInterface) => void;
};

export type LouvreInterface = {
  jocondeParetos: Map<string, JocondeParetoInterface>;
  addJoconde: (joconde: JocondeInterface) => void;
  collectFromLouvre: (louvre: LouvreInterface) => void;
};

export type CodeQualityInformationInterface = {
  debt: DebtInterface;
  louvre: LouvreInterface;
  commitDateTime: Date;
  collectFromCodeQualityInformation: (codeQualityInformation: CodeQualityInformationInterface) => void;
};

export type CodeQualityInformationHistoryInterface = {
  codeQualityInformationBag: CodeQualityInformationInterface[];
  addCodeQualityInformation: (codeQualityInformation: CodeQualityInformationInterface) => void;
};

export interface PricesInterface {
  [propName: string]: number;
}

export type ConfigInterface = {
  prices: PricesInterface;
  standard: number;
  ignorePaths: string[];
};

export type DeveloperInterface = {
  email: string;
  scoutScore: number;
  healerScore: number;
  addContributions(contributions: ContributionInterface): void;
};

export type ContributionInterface = {
  scoutScore: number;
  healerScore: number;
};

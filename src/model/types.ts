export type PriorizationTypes = 'isCritical' | 'isDangerous' | 'isContagious' | 'isIdle';

export type ItemInterface = {
  category: string;
  comment: string;
  fileName: string;
  type: string;
};

export type DebtItemInterface = ItemInterface & {
  price?: number;
  isContagious: boolean;
  isDangerous: boolean;
};
export type JocondeInterface = ItemInterface;

export type PricerInterface = {
  getPrice: (debt: DebtItemInterface) => number;
};

export type DebtParetoInterface = {
  debtItems: DebtItemInterface[];
  debtScore: number;
  debtScoreByPriorization: { [priorizationType in PriorizationTypes]: number };
  type: string;
  addDebtItem: (debtItem: DebtItemInterface) => void;
};
export type JocondeParetoInterface = {
  jocondes: JocondeInterface[];
  type: string;
  addJoconde: (joconde: JocondeInterface) => void;
};

export type DebtInterface = {
  debtParetos: Map<string, DebtParetoInterface>;
  debtScore: number;
  pricer: PricerInterface;
  addDebtItem: (debtItem: DebtItemInterface) => void;
};

export type LouvreInterface = {
  jocondeParetos: Map<string, JocondeParetoInterface>;
  addJoconde: (joconde: JocondeInterface) => void;
};

export type CodeQualityInformationInterface = {
  debt: DebtInterface;
  louvre: LouvreInterface;
  commitDateTime: Date;
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

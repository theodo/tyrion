import DebtItem from "./debtItem";
import { Pricer } from "../services/pricer";
import DebtPareto from "./debtPareto";
export default class Debt {
    debtParetos: Map<string, DebtPareto>;
    commitDateTime: Date;
    debtScore: number;
    private pricer;
    constructor(pricer: Pricer);
    addDebtItem(debtItem: DebtItem): void;
    getWholeDebtInformation(): string;
}

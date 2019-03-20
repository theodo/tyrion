import DebtItem from "./debtItem";
import DebtPareto from "./debtPareto";
export default class Debt {
    debtParetos: Map<string, DebtPareto>;
    commitDateTime: Date;
    debtScore: number;
    constructor();
    addDebtItem(debtItem: DebtItem): void;
    getWholeDebtInformation(): string;
}

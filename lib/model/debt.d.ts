import DebtItem from "./debtItem";
import DebtPareto from "./debtPareto";
export default class Debt {
    debtParetos: Map<string, DebtPareto>;
    private debtScore;
    constructor();
    addDebtItem(debtItem: DebtItem): void;
    getWholeDebtInformation(): string;
}

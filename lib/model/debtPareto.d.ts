import DebtItem from "./debtItem";
export default class DebtPareto {
    debtItems: Array<DebtItem>;
    type: string;
    private debtScore;
    constructor(type: string);
    addDebtItem(debtItem: DebtItem): void;
}

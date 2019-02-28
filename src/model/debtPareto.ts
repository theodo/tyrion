import DebtItem from "./debtItem";
import { Pricer } from "../services/pricer";

export default class DebtPareto {
    debtItems: Array<DebtItem>;
    type: string;

    private debtScore: number;

    constructor(type: string) {
        this.type = type;
        this.debtItems = new Array<DebtItem>();
        this.debtScore = 0;
    }

    addDebtItem(debtItem: DebtItem): void {
        this.debtItems.push(debtItem);
        this.debtScore += Pricer.getPrice(debtItem);
    }
}

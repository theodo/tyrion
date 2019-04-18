import DebtItem from "./debtItem";
import { Pricer } from "../services/pricer";

export default class DebtPareto {
    debtItems: Array<DebtItem>;
    type: string;

    debtScore: number;
    private pricer: Pricer;

    constructor(type: string, pricer: Pricer) {
        this.type = type;
        this.debtItems = new Array<DebtItem>();
        this.debtScore = 0;
        this.pricer = pricer;
    }

    addDebtItem(debtItem: DebtItem): void {
        this.debtItems.push(debtItem);
        this.debtScore += this.pricer.getPrice(debtItem);
    }
}

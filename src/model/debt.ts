import DebtItem from "./debtItem";
import Pricer from "../services/pricer";

export default class Debt {
    debtBag: Array<DebtItem>;
    pricer: Pricer;
    constructor() {
        this.debtBag = new Array<DebtItem>();
        this.pricer = new Pricer();
    }

    addDebtItem(debtItem: DebtItem): void {
        this.debtBag.push(debtItem);
    }

    getScore(): number {
        let score = 0;
        for (let debtItem of this.debtBag) {
            score += this.pricer.getPrice(debtItem);
        }

        return score;
    }

    displayDebt(): string {
        return JSON.stringify({'score': this.getScore()})
    }
}

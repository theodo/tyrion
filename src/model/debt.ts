import DebtItem from "./debtItem";
import { Pricer } from "../services/pricer";
import DebtPareto from "./debtPareto";

export default class Debt {
    debtParetos: Map<string, DebtPareto>;
    commitDateTime: Date = new Date();

    debtScore: number;

    constructor() {
        this.debtParetos = new Map<string, DebtPareto>();
        this.debtScore = 0;
    }

    addDebtItem(debtItem: DebtItem): void {
        this.debtScore += Pricer.getPrice(debtItem);

        let debtPareto = this.debtParetos.get(debtItem.type);
        if (debtPareto instanceof DebtPareto) {
            debtPareto.addDebtItem(debtItem);
        } else {
           debtPareto = new DebtPareto(debtItem.type);
           debtPareto.addDebtItem(debtItem);
           this.debtParetos.set(debtItem.type, debtPareto);
        }
    }

    getWholeDebtInformation(): string {

        let wholeDebtInformation = {
            'score': this.debtScore,
            'paretos': Array.from(this.debtParetos.values()),
        };

        return JSON.stringify(wholeDebtInformation);
    }
}

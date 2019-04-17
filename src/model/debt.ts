import DebtItem from "./debtItem";
import { Pricer } from "../services/pricer";
import DebtPareto from "./debtPareto";

export default class Debt {
    debtParetos: Map<string, DebtPareto>;
    commitDateTime: Date = new Date();
    debtScore: number;

    private pricer: Pricer;

    constructor(pricer: Pricer) {
        this.debtParetos = new Map<string, DebtPareto>();
        this.debtScore = 0;
        this.pricer = pricer;
    }

    addDebtItem(debtItem: DebtItem): void {
        this.debtScore += this.pricer.getPrice(debtItem);

        let debtPareto = this.debtParetos.get(debtItem.type);
        if (debtPareto instanceof DebtPareto) {
            debtPareto.addDebtItem(debtItem);
        } else {
           debtPareto = new DebtPareto(debtItem.type, this.pricer);
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

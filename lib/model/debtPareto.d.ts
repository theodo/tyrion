import DebtItem from "./debtItem";
import { Pricer } from "../services/pricer";
export default class DebtPareto {
    debtItems: Array<DebtItem>;
    type: string;
    debtScore: number;
    private pricer;
    constructor(type: string, pricer: Pricer);
    addDebtItem(debtItem: DebtItem): void;
}

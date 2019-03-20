import Debt from "./debt";
export default class DebtHistory {
    debtBag: Array<Debt>;
    constructor();
    addDebt(debt: Debt): void;
    getWholeDebtInformation(): string;
}

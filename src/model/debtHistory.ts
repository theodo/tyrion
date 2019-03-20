import Debt from "./debt";

export default class DebtHistory {
    debtBag: Array<Debt>;

    constructor() {
        this.debtBag = new Array<Debt>();
    }

    addDebt(debt: Debt): void {
        this.debtBag.push(debt);
    }

    getWholeDebtInformation(): string {
        return JSON.stringify(this.debtBag);
    }
}

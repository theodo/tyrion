import Debt from "./debt";
import Louvre from "./louvre";

export default class CodeQualityInformation {
    debt: Debt;
    louvre: Louvre;
    commitDateTime: Date = new Date();

    constructor(debt: Debt, louvre: Louvre) {
        this.debt = debt;
        this.louvre = louvre;
    }
}

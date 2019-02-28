import Debt from "../model/debt";
export default class Collector {
    scanningPath: string;
    debt: Debt;
    constructor(scanningPath: string);
    collect(): Promise<Debt>;
    private checkIfLineIsAComment;
    private parseDebtItemFromDebtLine;
}

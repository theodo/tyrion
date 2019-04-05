import Debt from "../model/debt";
import DebtHistory from "../model/debtHistory";
export default class Collector {
    scanningPath: string;
    constructor(scanningPath: string);
    collect(): Promise<Debt>;
    collectHistory(historyNumberOfDays: number): Promise<DebtHistory>;
    private getRelevantCommit;
    private collectDebtFromCommit;
    private getFilesFromCommit;
    private parseEntry;
    private parseFile;
    private checkIfLineIsAComment;
    private parseDebtItemFromDebtLine;
}

import Debt from "../model/debt";
import DebtHistory from "../model/debtHistory";
import { Pricer } from "./pricer";
export default class Collector {
    scanningPath: string;
    pricer: Pricer;
    filter: string;
    constructor(scanningPath: string, filter: string);
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

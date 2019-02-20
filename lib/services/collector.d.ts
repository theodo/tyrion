import Pricer from "./pricer";
export default class Collector {
    scanningPath: string;
    debtScore: number;
    pricer: Pricer;
    constructor(scanningPath: string);
    collect(): Promise<number>;
    private parserFileWrapper;
    private parseCommentsFromFile;
}

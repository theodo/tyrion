import Pricer from "./pricer";
import Debt from "../model/debt";

const glob = require("glob");
const parser = require("comment-parser");

export default class Collector {
    scanningPath: string;
    debtScore: number;
    pricer: Pricer;
    constructor(scanningPath: string) {
        this.scanningPath = scanningPath;
        this.pricer = new Pricer();
        this.debtScore = 0;
    }

    async collect(): Promise<number> {
        /**
         * @debt {bug} potential
         * Maximet: create a safer way of constructing the pattern string
         */
        const searchPattern = this.scanningPath + '/**/*.*';

        const files = glob.sync(searchPattern);

        for (let file of files) {
            try {
                const data = await this.parserFileWrapper(file);
                this.parseCommentsFromFile(data);
            } catch (error) {}
        }

        return this.debtScore;
    }

    private async parserFileWrapper(file: string) {
        return new Promise((resolve) => {
            parser.file(file, (str: any, data: any) => {
                resolve(data);
            });
        });
    }

    private parseCommentsFromFile(data: any): void {
        for (let commentBlock of data) {
            for (let comment of commentBlock.tags) {
                if (comment.tag.toLowerCase() === 'debt') {
                    const debt = Debt.buildFromComment(comment);
                    this.debtScore += this.pricer.getPrice(debt);
                }
            }
        }
    }
}

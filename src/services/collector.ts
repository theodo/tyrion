import DebtItem from "../model/debtItem";
import Debt from "../model/debt";

const glob = require("glob");
const parser = require("comment-parser");

export default class Collector {
    scanningPath: string;
    debt: Debt;
    constructor(scanningPath: string) {
        this.scanningPath = scanningPath;
        this.debt = new Debt();
    }

    async collect(): Promise<Debt> {
        /**
         * @debt {bug-risk} potential
         * Maximet: create a safer way of constructing the pattern string
         */
        const allNotHiddenFiles = this.scanningPath + '/**/*.*';
        const notHiddenFiles = glob.sync(allNotHiddenFiles);

        const allHiddenFiles = this.scanningPath + '/**/.*';
        const hiddenFiles = glob.sync(allHiddenFiles);

        const allFiles = notHiddenFiles.concat(hiddenFiles);

        for (let fileName of allFiles) {
            try {
                const data = await this.parserFileWrapper(fileName);
                this.parseCommentsFromFile(data, fileName);
            } catch (error) {}
        }

        return this.debt;
    }

    private async parserFileWrapper(file: string) {
        return new Promise((resolve) => {
            parser.file(file, (str: any, data: any) => {
                resolve(data);
            });
        });
    }

    private parseCommentsFromFile(data: any,fileName: string): void {
        for (let commentBlock of data) {
            for (let comment of commentBlock.tags) {
                if (comment.tag.toLowerCase() === 'debt') {
                    const debtItem = DebtItem.buildFromComment(comment, fileName);
                    this.debt.addDebtItem(debtItem);
                }
            }
        }
    }
}

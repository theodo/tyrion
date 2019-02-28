import DebtItem from "../model/debtItem";
import Debt from "../model/debt";

const glob = require("glob");
const fs = require('fs');

export default class Collector {
    scanningPath: string;
    debt: Debt;
    constructor(scanningPath: string) {
        this.scanningPath = scanningPath;
        this.debt = new Debt();
    }

    async collect(): Promise<Debt> {
        const allNotHiddenFiles = this.scanningPath + '/**/*.*';
        const notHiddenFiles = glob.sync(allNotHiddenFiles, {'nodir': true});

        const allHiddenFiles = this.scanningPath + '/**/.*';
        const hiddenFiles = glob.sync(allHiddenFiles, {'nodir': true});

        const allFiles = notHiddenFiles.concat(hiddenFiles);

        for (let fileName of allFiles) {
            let lines:Array<string> = fs.readFileSync(fileName, 'utf-8').split('\n');

            /**
             * @debt bug-risk:detection "Maximet: check if the line is a comment or not to avoid wrong debt detection"
             */
            lines = lines.filter(line => line.indexOf('@debt') >= 0 && this.checkIfLineIsAComment(line));

            for (let line of lines) {
                const debtItem = this.parseDebtItemFromDebtLine(line, fileName);
                this.debt.addDebtItem(debtItem);
            }
        }

        return this.debt;
    }

    private checkIfLineIsAComment(line:string): boolean {
        const lineTrimed = line.trim();
        const firstChar = lineTrimed.charAt(0);

        return firstChar === '#' ||  firstChar === '*';
    }

    private parseDebtItemFromDebtLine(line:string, fileName: string): DebtItem {
        const lineWithoutDebt = line.substr(line.indexOf('@debt') + 6);
        const indexOfComment = lineWithoutDebt.indexOf('"');
        const debtTypesExpression = lineWithoutDebt.substr(0, indexOfComment).trim();
        const types = debtTypesExpression.split(':');

        const debtType = types[0];
        const debtCategory = types[1] ? types[1] : '';

        let comment = line.substr(line.indexOf('"') + 1);
        if (comment.indexOf('"') >= 0) {
            comment = comment.substr(0, comment.indexOf('"'));
        }

        return new DebtItem(debtType, debtCategory, comment, fileName);
    }
}

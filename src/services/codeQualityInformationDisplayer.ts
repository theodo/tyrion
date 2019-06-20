import DebtPareto from "../model/debtPareto";
import DebtItem from "../model/debtItem";
import Debt from "../model/debt";
import CodeQualityInformation from "../model/codeQualityInformation";
import Louvre from "../model/louvre";
import JocondePareto from "../model/jocondePareto";
import Joconde from "../model/joconde";

export default class CodeQualityInformationDisplayer {

    static display(codeQualityInformation: CodeQualityInformation): void {
        if (codeQualityInformation.debt) {
            this.displayDebtSummary(codeQualityInformation.debt);
        }

        if (codeQualityInformation.louvre) {
            this.displayLouvre(codeQualityInformation.louvre);
        }
    }

    static displayDebtSummary(debt: Debt): void {
        let totalItems = 0;
        console.info('\n ♻️♻️♻️ Debt Information ♻️♻️♻️');
        debt.debtParetos.forEach((debtPareto: DebtPareto, key) => {
                const debtItemsNumber = debtPareto.debtItems.length;
                console.info(key + ': the score is ' + debtPareto.debtScore + ' and there are ' + debtItemsNumber + ' debt items:');

                debtPareto.debtItems.map((debtItem: DebtItem) => {
                    console.log(' - ' + debtItem.fileName + ': "'+ debtItem.comment + '" (' + debt.pricer.getPrice(debtItem) + ' points)');
                });

                console.log('');
                totalItems += debtItemsNumber;
            }
        );

        console.info('\n♻The total debt score is '+ debt.debtScore + ' and there are ' + totalItems + ' debt items♻');
    }

    static displayLouvre(louvre: Louvre): void {
        let totalItems = 0;
        console.info('\n 🖼🖼🖼 Quality Information 🖼🖼🖼');
        louvre.jocondeParetos.forEach((jocondePareto: JocondePareto, key) => {
                const jocondeNumber = jocondePareto.jocondes.length;
                console.info('There are ' + jocondeNumber + ' joconde for the ' + key +' category:');

                jocondePareto.jocondes.map((joconde: Joconde) => {
                    console.log(' - ' + joconde.fileName + ': "'+ joconde.comment +'"');
                });

                console.log('');
                totalItems += jocondeNumber;
            }
        );

        console.info('\n🖼 There is a total of ' + totalItems + ' jocondes 🖼');
    }
}

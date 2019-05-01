import DebtPareto from "../model/debtPareto";
import DebtItem from "../model/debtItem";
import Debt from "../model/debt";

export default class DebtDisplayer {
    static displayDebtSummary(debt: Debt): void {
        let totalItems = 0;
        console.info('\n');
        debt.debtParetos.forEach((debtPareto: DebtPareto, key) => {
                const numberDebtItems = debtPareto.debtItems.length;
                console.info(key + ': the score is ' + debtPareto.debtScore + ' and there are ' + numberDebtItems + ' debt items:');

                debtPareto.debtItems.map((debtItem: DebtItem) => {
                    console.log(' - ' + debtItem.fileName + ': "'+ debtItem.comment + '" (' + debt.pricer.getPrice(debtItem) + ' points)');
                });

                console.log('');
                totalItems += numberDebtItems;
            }
        );

        console.info('\nTotal: the score is '+ debt.debtScore + ' and the are ' + totalItems + ' debt items');
    }
}

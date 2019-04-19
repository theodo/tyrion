import DebtItem from "../model/debtItem";

export class Pricer {
    private prices: any;

    constructor(prices: any) {
        this.prices = prices;
    }

    /**
     * @param debt
     */
    getPrice(debt: DebtItem): number {
        if (debt.price) {
            return debt.price;
        }

        const price = this.prices[debt.type] ? this.prices[debt.type] : 1;

        return parseInt(price);
    }
}

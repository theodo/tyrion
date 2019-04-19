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
        const price = this.prices[debt.type] ? this.prices[debt.type] : 1;

        return parseInt(price);
    }
}

import DebtItem from "../model/debtItem";
export declare class Pricer {
    private prices;
    private path;
    constructor(path: string);
    /**
     * @param debt
     */
    getPrice(debt: DebtItem): number;
    private setPricingConfig;
}

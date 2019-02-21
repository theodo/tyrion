import Debt from "../model/debt";
export default class Pricer {
    /**
     * @param debt
     */
    getPrice(debt: Debt): number;
}

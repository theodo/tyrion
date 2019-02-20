import Debt from "../model/debt";
export default class Pricer {
    /**
     * @Todo {feature} calculate a different price depending on the type of the debt
     *
     * @param debt
     */
    getPrice(debt: Debt): number;
}

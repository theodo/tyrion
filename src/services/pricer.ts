import DebtItem from "../model/debtItem";
import fs from "fs";
import path from "path";

export class Pricer {
    private prices: any;
    private path: string;

    constructor(path:string) {
        this.prices = null;
        this.path = path;
    }

    /**
     * @param debt
     */
    getPrice(debt: DebtItem): number {

        if (!this.prices) {
            this.setPricingConfig();
        }

        const price = this.prices[debt.type] ? this.prices[debt.type] : 1;

        return parseInt(price);
    }

    private setPricingConfig() {
        const defaultConfigFile = fs.readFileSync(path.resolve(__dirname, '../../.tyrion-config.json'), 'utf-8');
        const defaultConfig = JSON.parse(defaultConfigFile);

        const projectConfigPath = this.path + '/.tyrion-config.json';

        if (fs.existsSync(projectConfigPath)) {
            const configFile = fs.readFileSync(projectConfigPath, 'utf-8');
            const config = JSON.parse(configFile.toString());
            this.prices = Object.assign(defaultConfig.pricer, config.pricer);
        } else {
            this.prices = defaultConfig.pricer;
        }

        console.info('\nHere are the pricing for each debt item of your project:\n', this.prices);
    }
}

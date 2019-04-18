"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var Pricer = /** @class */ (function () {
    function Pricer(path) {
        this.prices = null;
        this.path = path;
    }
    /**
     * @param debt
     */
    Pricer.prototype.getPrice = function (debt) {
        if (!this.prices) {
            this.setPricingConfig();
        }
        var price = this.prices[debt.type] ? this.prices[debt.type] : 1;
        return parseInt(price);
    };
    Pricer.prototype.setPricingConfig = function () {
        var defaultConfigFile = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../.tyrion-config.json'), 'utf-8');
        var defaultConfig = JSON.parse(defaultConfigFile);
        var projectConfigPath = this.path + '/.tyrion-config.json';
        if (fs_1.default.existsSync(projectConfigPath)) {
            var configFile = fs_1.default.readFileSync(projectConfigPath, 'utf-8');
            var config = JSON.parse(configFile.toString());
            this.prices = Object.assign(defaultConfig.pricer, config.pricer);
        }
        else {
            this.prices = defaultConfig.pricer;
        }
        console.info('\nHere are the pricing for each debt item of your project:\n', this.prices);
    };
    return Pricer;
}());
exports.Pricer = Pricer;

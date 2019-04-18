"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var debtPareto_1 = __importDefault(require("./debtPareto"));
var Debt = /** @class */ (function () {
    function Debt(pricer) {
        this.commitDateTime = new Date();
        this.debtParetos = new Map();
        this.debtScore = 0;
        this.pricer = pricer;
    }
    Debt.prototype.addDebtItem = function (debtItem) {
        this.debtScore += this.pricer.getPrice(debtItem);
        var debtPareto = this.debtParetos.get(debtItem.type);
        if (debtPareto instanceof debtPareto_1.default) {
            debtPareto.addDebtItem(debtItem);
        }
        else {
            debtPareto = new debtPareto_1.default(debtItem.type, this.pricer);
            debtPareto.addDebtItem(debtItem);
            this.debtParetos.set(debtItem.type, debtPareto);
        }
    };
    Debt.prototype.displayDebtSummary = function () {
        var totalItems = 0;
        console.info('\n');
        this.debtParetos.forEach(function (debtPareto, key) {
            var numberDebtItems = debtPareto.debtItems.length;
            console.info(key + ': the score is ' + debtPareto.debtScore + ' and there are ' + numberDebtItems + ' debt items');
            totalItems += numberDebtItems;
        });
        console.info('\nTotal: the score is ' + this.debtScore + ' and the are ' + totalItems + ' debt items');
    };
    return Debt;
}());
exports.default = Debt;

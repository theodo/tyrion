"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pricer_1 = require("../services/pricer");
var debtPareto_1 = __importDefault(require("./debtPareto"));
var Debt = /** @class */ (function () {
    function Debt() {
        this.debtParetos = new Map();
        this.debtScore = 0;
    }
    Debt.prototype.addDebtItem = function (debtItem) {
        this.debtScore += pricer_1.Pricer.getPrice(debtItem);
        var debtPareto = this.debtParetos.get(debtItem.type);
        if (debtPareto instanceof debtPareto_1.default) {
            debtPareto.addDebtItem(debtItem);
        }
        else {
            debtPareto = new debtPareto_1.default(debtItem.type);
            debtPareto.addDebtItem(debtItem);
            this.debtParetos.set(debtItem.type, debtPareto);
        }
    };
    Debt.prototype.getWholeDebtInformation = function () {
        var wholeDebtInformation = {
            'score': this.debtScore,
            'paretos': Array.from(this.debtParetos.values()),
        };
        return JSON.stringify(wholeDebtInformation);
    };
    return Debt;
}());
exports.default = Debt;

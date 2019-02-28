"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pricer_1 = require("../services/pricer");
var DebtPareto = /** @class */ (function () {
    function DebtPareto(type) {
        this.type = type;
        this.debtItems = new Array();
        this.debtScore = 0;
    }
    DebtPareto.prototype.addDebtItem = function (debtItem) {
        this.debtItems.push(debtItem);
        this.debtScore += pricer_1.Pricer.getPrice(debtItem);
    };
    return DebtPareto;
}());
exports.default = DebtPareto;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DebtPareto = /** @class */ (function () {
    function DebtPareto(type, pricer) {
        this.type = type;
        this.debtItems = new Array();
        this.debtScore = 0;
        this.pricer = pricer;
    }
    DebtPareto.prototype.addDebtItem = function (debtItem) {
        this.debtItems.push(debtItem);
        this.debtScore += this.pricer.getPrice(debtItem);
    };
    return DebtPareto;
}());
exports.default = DebtPareto;

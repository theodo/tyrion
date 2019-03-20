"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DebtHistory = /** @class */ (function () {
    function DebtHistory() {
        this.debtBag = new Array();
    }
    DebtHistory.prototype.addDebt = function (debt) {
        this.debtBag.push(debt);
    };
    DebtHistory.prototype.getWholeDebtInformation = function () {
        return JSON.stringify(this.debtBag);
    };
    return DebtHistory;
}());
exports.default = DebtHistory;

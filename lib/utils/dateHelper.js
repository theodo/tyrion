"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateHelper = /** @class */ (function () {
    function DateHelper() {
    }
    DateHelper.getDayMonthYearFormat = function (date) {
        return date.getDay() + "-" + date.getMonth() + "-" + date.getFullYear();
    };
    DateHelper.getDateAsHtmlTemplate = function (date) {
        return "new Date(" + date.getFullYear() + "," + date.getMonth() + "," + date.getDate() + ")";
    };
    return DateHelper;
}());
exports.default = DateHelper;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debt = /** @class */ (function () {
    function Debt(type, category, description) {
        this.type = type;
        this.category = category;
        this.description = description;
    }
    Debt.buildFromComment = function (comment) {
        return new Debt(comment.type, comment.name, comment.description);
    };
    return Debt;
}());
exports.default = Debt;

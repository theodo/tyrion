"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pricer = /** @class */ (function () {
    function Pricer() {
    }
    /**
     * @Todo {feature} calculate a different price depending on the type of the debt
     *
     * @param debt
     */
    Pricer.prototype.getPrice = function (debt) {
        return 1;
    };
    return Pricer;
}());
exports.default = Pricer;

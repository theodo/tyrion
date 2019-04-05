"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var lodash_1 = __importDefault(require("lodash"));
var dateHelper_1 = __importDefault(require("../utils/dateHelper"));
var TemplateRenderer = /** @class */ (function () {
    function TemplateRenderer() {
    }
    TemplateRenderer.renderHtmlGraph = function (debtHistory) {
        var file = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../template/google_charts/report.html'), 'utf-8');
        var debtGraphData = Array();
        for (var _i = 0, _a = debtHistory.debtBag; _i < _a.length; _i++) {
            var debt = _a[_i];
            var debtGraphDataPoint = {
                date: dateHelper_1.default.getDateAsHtmlTemplate(debt.commitDateTime),
                debtScore: debt.debtScore,
            };
            debtGraphData.push(debtGraphDataPoint);
        }
        var compiled = lodash_1.default.template(file.toString());
        var htmlGraph = compiled({ 'dataDebt': debtGraphData });
        fs_1.default.writeFile("tyrion_report.html", htmlGraph, function (err) {
            if (err) {
                return console.log(err);
            }
            console.info("The report was generated!");
        });
    };
    return TemplateRenderer;
}());
exports.default = TemplateRenderer;

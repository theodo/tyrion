#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var figlet_1 = __importDefault(require("figlet"));
var commander_1 = __importDefault(require("commander"));
var collector_1 = __importDefault(require("./services/collector"));
var templateRenderer_1 = __importDefault(require("./services/templateRenderer"));
var HISTORY_DEFAULT_NUMBER_OF_DAYS = 28;
commander_1.default
    .description("A debt collector from human comments in the code")
    .option('-p, --path [scanDirectory]', 'The path of the directory you want to analyse')
    .option('-e, --evolution [days]', 'Get the evolution of the debt since X days')
    .option('-j, --json', 'Limit the output to the json result')
    .parse(process.argv);
if (!commander_1.default.json) {
    console.log(chalk_1.default.green(figlet_1.default.textSync('TYRION', { horizontalLayout: 'full' })));
    console.info(commander_1.default.helpInformation());
}
var scanDirectory = commander_1.default.path;
if (!scanDirectory) {
    console.warn('No path was specified using the -p options. Tyrion will scan the current directory');
    scanDirectory = '.';
}
var collector = new collector_1.default(scanDirectory);
if (commander_1.default.evolution) {
    var historyNumberOfDays = commander_1.default.evolution ? commander_1.default.evolution : HISTORY_DEFAULT_NUMBER_OF_DAYS;
    var debtHistory = collector.collectHistory(historyNumberOfDays);
    debtHistory.then(function (debtHistory) {
        templateRenderer_1.default.renderHtmlGraph(debtHistory);
    });
}
else {
    var debtPromise = collector.collect();
    debtPromise.then(function (debt) {
        console.log(debt.getWholeDebtInformation());
    });
}

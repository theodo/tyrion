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
console.log(chalk_1.default.red(figlet_1.default.textSync('TYRION', { horizontalLayout: 'full' })));
commander_1.default
    .version('0.0.1')
    .description("A debt collector from human comments in the code")
    .option('-p, --path [scanDirectory]', 'The path of the directory you want to analyse')
    .option('-j, --json', 'The output will be a json string')
    .parse(process.argv);
console.info(commander_1.default.helpInformation());
var scanDirectory = commander_1.default.path;
if (!scanDirectory) {
    console.warn('No path was specified using the -p options. Tyrion will scan the current directory');
    scanDirectory = '.';
}
var collector = new collector_1.default(scanDirectory);
var debtScore = collector.collect();
debtScore.then(function (debtScore) { return console.log('debtScore', debtScore); });

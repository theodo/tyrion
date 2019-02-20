#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import program from 'commander';
import Collector from "./services/collector";

console.log(
    chalk.red(
        figlet.textSync('TYRION', { horizontalLayout: 'full' })
    )
);

program
    .version('0.0.1')
    .description("A debt collector from human comments in the code")
    .option('-p, --path [scanDirectory]', 'The path of the directory you want to analyse')
    .option('-j, --json', 'The output will be a json string')
    .parse(process.argv);

console.info(program.helpInformation());

let scanDirectory = program.path;

if (!scanDirectory) {
    console.warn('No path was specified using the -p options. Tyrion will scan the current directory');
    scanDirectory = '.';
}

const collector = new Collector(scanDirectory);

const debtScore = collector.collect();

debtScore.then((debtScore) => console.log('debtScore', debtScore));

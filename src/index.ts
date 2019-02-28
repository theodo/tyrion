#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import program from 'commander';
import Collector from "./services/collector";
import Debt from "./model/debt";

program
    .description("A debt collector from human comments in the code")
    .option('-p, --path [scanDirectory]', 'The path of the directory you want to analyse')
    .option('-j, --json', 'Limit the output to the json result')
    .parse(process.argv);

if (!program.json){
    console.log(
        chalk.red(
            figlet.textSync('TYRION', { horizontalLayout: 'full' })
        )
    );

    console.info(program.helpInformation());
}


let scanDirectory = program.path;

if (!scanDirectory) {
    console.warn('No path was specified using the -p options. Tyrion will scan the current directory');
    scanDirectory = '.';
}

const collector = new Collector(scanDirectory);

const debtPromise = collector.collect();

debtPromise.then((debt: Debt) => {
    console.log(debt.getWholeDebtInformation());
});

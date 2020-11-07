#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import program from 'commander';
import ProgramOrchestrator, { ProgramOptionsList } from './services/programOrchestrator';
import Config from './services/config';
import Pricer from './services/pricer';
import SyntaxParser from './services/syntaxParser';
import Collector from './services/collector';
import ProgramProvider from './services/programProvider';
import Logger from './services/logger';

program
  .description('A debt collector from human comments in the code')
  .option('-p, --path [scanDirectory]', 'The path of the directory you want to analyse')
  .option('-e, --evolution [days]', 'Get the evolution of the debt since X days')
  .option('-b, --branch [days]', 'Specify the branch used for the evolution. (Default to master)')
  .option('-n, --nobrowser [browser]', "Don't open the report after being generated")
  .option('-c, --csv [csv]', 'export the debt data into a csv file')
  .option('-d, --devs [devs]', 'Get information about who is contributing the most to quality (Beta)');

program.on('--help', function (): void {
  console.log('');
  console.log(chalk.green(figlet.textSync('TYRION', { horizontalLayout: 'full' })));
});

program.parse(process.argv);
const logger = new Logger(true);
const programOptions: ProgramOptionsList = program.opts() as ProgramOptionsList;
const scanDirectory = (programOptions.path as string) ?? '.';
const config = new Config(scanDirectory);
const pricer = new Pricer(config.prices);
const syntaxParser = new SyntaxParser(config);
const collector = new Collector(syntaxParser, config, scanDirectory);

const programProvider = new ProgramProvider(collector, pricer, programOptions, config, logger);
const programOrchestrator = new ProgramOrchestrator(programOptions, programProvider, logger);
programOrchestrator.selectAnalysis();

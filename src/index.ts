#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import program from 'commander';
import colors from 'colors';
import open from 'open';

import Collector from './services/collector';
import Config from './services/config';
import TemplateRenderer from './services/templateRenderer';
import CodeQualityInformationDisplayer from './services/codeQualityInformationDisplayer';
import CodeQualityInformationHistory from './model/codeQualityInformationHistory';
import { CodeQualityInformationInterface } from './model/types';
import Pricer from './services/pricer';
import Contributions from './model/Contributions';

const HISTORY_DEFAULT_NUMBER_OF_DAYS = 28;
const DEFAULT_BRANCH = 'master';

program
  .description('A debt collector from human comments in the code')
  .option('-p, --path [scanDirectory]', 'The path of the directory you want to analyse')
  .option('-e, --evolution [days]', 'Get the evolution of the debt since X days')
  .option('-b, --branch [days]', 'Specify the branch used for the evolution. (Default to master)')
  .option('-n, --nobrowser [browser]', "Don't open the report after being generated")
  .option('-d, --devs [devs]', 'Get information about who is contributing the most to quality (Beta)');

program.on('--help', function(): void {
  console.log('');
  console.log(chalk.green(figlet.textSync('TYRION', { horizontalLayout: 'full' })));
});

program.parse(process.argv);

let scanDirectory = program.path;

if (!scanDirectory) {
  console.warn(colors.yellow('⚠ No path was specified using the -p options. Tyrion will scan the current directory ⚠'));
  scanDirectory = '.';
}

const config = new Config(scanDirectory);
const pricer = new Pricer(config.prices);
const collector = Collector.createFromConfig(scanDirectory, config);

switch (true) {
  case Boolean(program.evolution):
    const historyNumberOfDays = isNaN(parseInt(program.evolution)) ? HISTORY_DEFAULT_NUMBER_OF_DAYS : program.evolution;
    const branchName = typeof program.branch === 'string' ? program.branch : DEFAULT_BRANCH;
    console.info('Tyrion will scan ' + historyNumberOfDays + ' days backward from the last commit on ' + branchName);

    if (Boolean(program.devs)) {
      collector.collectDevsContributions(historyNumberOfDays, branchName).then((contributions: Contributions): void => {
        console.log('contributions', contributions);
        const reportPath = TemplateRenderer.renderContributionsGraph(contributions);
        if (!program.nobrowser) {
          open(reportPath).catch((error): void => console.error(error));
        }
      });
    } else {
      const codeQualityInformationHistory = collector.collectHistory(historyNumberOfDays, branchName);

      codeQualityInformationHistory
        .then((codeQualityInformationHistory: CodeQualityInformationHistory): void => {
          const reportPath = TemplateRenderer.renderHistoryGraph(
            codeQualityInformationHistory,
            config.standard,
            pricer,
          );
          console.log(colors.green('The report was generated at ' + reportPath));

          if (!program.nobrowser) {
            open(reportPath).catch((error): void => console.error(error));
          }
        })
        .catch((error): void => console.error(error));
    }
    break;
  default:
    const codeQualityInformationPromise = collector.collect();
    codeQualityInformationPromise
      .then((codeQualityInformation: CodeQualityInformationInterface): void => {
        CodeQualityInformationDisplayer.display(codeQualityInformation, pricer);
        const reportPath = TemplateRenderer.renderTypeParetoGraph(codeQualityInformation.debt.debtParetos, pricer);
        console.log(colors.green('The report was generated at ' + reportPath));

        if (!program.nobrowser) {
          open(reportPath).catch((error): void => console.error(error));
        }
      })
      .catch((error): void => console.error(error));
}

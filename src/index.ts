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
import CodeQualityInformation from './model/codeQualityInformation';
import CodeQualityInformationHistory from './model/codeQualityInformationHistory';

const HISTORY_DEFAULT_NUMBER_OF_DAYS = 28;

program
  .description('A debt collector from human comments in the code')
  .option('-p, --path [scanDirectory]', 'The path of the directory you want to analyse')
  .option('-e, --evolution [days]', 'Get the evolution of the debt since X days')
  .option('-f, --filter [type]', 'Get the files that are concerned by a particular debt type')
  .option('-n, --nobrowser [browser]', "Don't open the report after being generated");

program.on('--help', function(): void {
  console.log('');
  console.log(chalk.green(figlet.textSync('TYRION', { horizontalLayout: 'full' })));
});

program.parse(process.argv);

let scanDirectory = program.path;

if (!scanDirectory) {
  console.warn(colors.red('⚠ No path was specified using the -p options. Tyrion will scan the current directory ⚠'));
  scanDirectory = '.';
}

const config = new Config(scanDirectory);

const collector = Collector.createFromConfig(scanDirectory, program.filter, config);

switch (true) {
  case Boolean(program.evolution):
    const historyNumberOfDays = isNaN(parseInt(program.evolution)) ? HISTORY_DEFAULT_NUMBER_OF_DAYS : program.evolution;
    console.info('Tyrion will scan ' + historyNumberOfDays + ' days backward from the last commit on master');
    const codeQualityInformationHistory = collector.collectHistory(historyNumberOfDays);

    codeQualityInformationHistory
      .then((codeQualityInformationHistory: CodeQualityInformationHistory): void => {
        const reportPath = TemplateRenderer.renderHistoryGraph(codeQualityInformationHistory, config.standard);
        console.log(colors.green('The report was generated at ' + reportPath));

        if (!program.nobrowser) {
          open(reportPath).catch((error): void => console.error(error));
        }
      })
      .catch((error): void => console.error(error));

  default:
    const codeQualityInformationPromise = collector.collect();
    codeQualityInformationPromise
      .then((codeQualityInformation: CodeQualityInformation): void => {
        CodeQualityInformationDisplayer.display(codeQualityInformation);
        const reportPath = TemplateRenderer.renderTypeParetoGraph(codeQualityInformation.debt.debtParetos);
        console.log(colors.green('The report was generated at ' + reportPath));

        if (!program.nobrowser) {
          open(reportPath).catch((error): void => console.error(error));
        }
      })
      .catch((error): void => console.error(error));
}

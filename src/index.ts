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
import Pricer from './services/pricer';
import Contributions from './model/contributions';
import CSVExporter from './services/csvExporter';

const HISTORY_DEFAULT_NUMBER_OF_DAYS = 28;
const DEFAULT_BRANCH = 'master';

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

if (program.path == null) {
  console.info(colors.blue('No path was specified using the -p options. Tyrion will scan the current directory'));
}
const scanDirectory = (program.path as string) ?? '.';
const config = new Config(scanDirectory);
const pricer = new Pricer(config.prices);
const collector = Collector.createFromConfig(scanDirectory, config);

if (program.evolution != null) {
  const historyNumberOfDaysInput = parseInt(program.evolution);
  const historyNumberOfDays = Number.isNaN(historyNumberOfDaysInput)
    ? HISTORY_DEFAULT_NUMBER_OF_DAYS
    : historyNumberOfDaysInput;
  const branchName = typeof program.branch === 'string' ? program.branch : DEFAULT_BRANCH;
  console.info(`Tyrion will scan ${historyNumberOfDays} days backward from the last commit on ${branchName}`);

  if (program.devs != null) {
    void collector
      .collectDevsContributions(historyNumberOfDays, branchName)
      .then((contributions: Contributions): void => {
        console.log('contributions', contributions);
        const reportPath = TemplateRenderer.renderContributionsGraph(contributions);
        if (program.nobrowser == null) {
          open(reportPath).catch((error): void => console.error(error));
        }
      });
  } else {
    const codeQualityInformationHistoryPromise = collector.collectHistory(historyNumberOfDays, branchName);
    codeQualityInformationHistoryPromise
      .then((codeQualityInformationHistory: CodeQualityInformationHistory): void => {
        const reportPath = TemplateRenderer.renderHistoryGraph(codeQualityInformationHistory, config.standard, pricer);
        console.log(colors.green('The report was generated at ' + reportPath));

        if (program.nobrowser == null) {
          open(reportPath).catch((error): void => console.error(error));
        }

        if (program.csv != null) {
          CSVExporter.generateHistoryCSV(codeQualityInformationHistory, pricer, config.standard);
        }
      })
      .catch((error): void => console.error(error));
  }
} else {
  const codeQualityInformation = collector.collect();
  CodeQualityInformationDisplayer.display(codeQualityInformation, pricer);
  const reportPath = TemplateRenderer.renderTypeParetoGraph(codeQualityInformation.debt.debtParetos, pricer);
  console.log(colors.green('The report was generated at ' + reportPath));

  if (program.nobrowser == null) {
    open(reportPath).catch((error): void => console.error(error));
  }

  if (program.csv != null) {
    CSVExporter.generateCSV(codeQualityInformation, pricer);
  }
}

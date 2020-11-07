import fs from 'fs';

import Pricer from './pricer';
import CodeQualityInformation from '../model/codeQualityInformation';
import CodeQualityInformationHistory from '../model/codeQualityInformationHistory';
import DateHelper from '../utils/dateHelper';
import { PRIORITIZATION_TYPES } from '../model/debtPareto';
import Logger from './logger';
import Config from './config';
import { ProgramOptionsList } from './programOrchestrator';

const csvFileName = 'tyrion_report.csv';

export default class CSVExporter {
  public constructor(
    private pricer: Pricer,
    private logger: Logger,
    private config: Config,
    private programOptionsList: ProgramOptionsList,
  ) {}

  //ADR I didn't use a lib because the tradeoff between adding a lib and rewriting a simple csv function wasn't worth it
  public handleCSVGeneration(codeQualityInformation: CodeQualityInformation): void {
    if (this.shouldGenerateCSV()) {
      return;
    }
    let csvString = 'type, category, file, score, comment\n';

    for (const debtPareto of codeQualityInformation.debt.debtParetos.values()) {
      for (const debtItem of debtPareto.debtItems.values()) {
        csvString += `
        ${debtItem.type},
        ${debtItem.category},
        ${debtItem.fileName},
        ${this.pricer.getPriceFromDebtItem(debtItem)},
        ${debtItem.comment}
`;
      }
    }

    csvString += `Total,,${this.pricer.getDebtScoreFromDebt(codeQualityInformation.debt)},`;

    fs.writeFileSync(csvFileName, csvString);
  }

  public handleHistoryCSVGeneration(codeQualityInformationHistory: CodeQualityInformationHistory): void {
    if (this.shouldGenerateCSV()) {
      return;
    }
    this.logger.info('Start generating the CSV report');
    let csvString = 'Date, Critical Debt, Dangerous Debt, Contagious Debt, Idle Debt, Standard\n';

    //TODO: sort by date the results
    for (const codeQualityInformation of codeQualityInformationHistory.codeQualityInformationBag.values()) {
      const priceDebt = this.pricer.getDebtScoreByCriticity(codeQualityInformation.debt.debtParetos);
      csvString += `
      ${DateHelper.getFrenchDayMonthYearFormat(codeQualityInformation.commitDateTime)},
      ${priceDebt[PRIORITIZATION_TYPES.IS_CRITICAL]},
      ${priceDebt[PRIORITIZATION_TYPES.IS_DANGEROUS]},
      ${priceDebt[PRIORITIZATION_TYPES.IS_CONTAGIOUS]},
      ${priceDebt[PRIORITIZATION_TYPES.IS_IDLE]},
      ${this.config.standard}`;
    }

    fs.writeFileSync(csvFileName, csvString);
    this.logger.info('CSV report has been generated');
  }

  private shouldGenerateCSV() {
    return this.programOptionsList.csv !== true;
  }
}

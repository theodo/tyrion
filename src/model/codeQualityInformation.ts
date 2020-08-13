import { CodeQualityInformationInterface } from './types';
import Louvre from './louvre';
import Debt from './debt';

export default class CodeQualityInformation implements CodeQualityInformationInterface {
  public debt: Debt;
  public louvre: Louvre;
  public commitDateTime: Date = new Date();

  public constructor() {
    this.debt = new Debt();
    this.louvre = new Louvre();
  }

  public collectFromCodeQualityInformation(codeQualityInformation: CodeQualityInformation): void {
    this.debt.collectFromDebt(codeQualityInformation.debt);
    this.louvre.collectFromLouvre(codeQualityInformation.louvre);
  }
}

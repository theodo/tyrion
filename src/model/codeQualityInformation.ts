import { DebtInterface, CodeQualityInformationInterface } from './types';

export default class CodeQualityInformation implements CodeQualityInformationInterface {
  public debt: DebtInterface;
  public commitDateTime: Date = new Date();

  public constructor(debt: DebtInterface) {
    this.debt = debt;
  }
}

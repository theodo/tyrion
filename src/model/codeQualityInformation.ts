import { DebtInterface, LouvreInterface, CodeQualityInformationInterface } from './types';

export default class CodeQualityInformation implements CodeQualityInformationInterface {
  public debt: DebtInterface;
  public louvre: LouvreInterface;
  public commitDateTime: Date = new Date();

  public constructor(debt: DebtInterface, louvre: LouvreInterface) {
    this.debt = debt;
    this.louvre = louvre;
  }
}

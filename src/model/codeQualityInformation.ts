import Debt from './debt';
import Louvre from './louvre';

export default class CodeQualityInformation {
  public debt: Debt;
  public louvre: Louvre;
  public commitDateTime: Date = new Date();

  public constructor(debt: Debt, louvre: Louvre) {
    this.debt = debt;
    this.louvre = louvre;
  }
}

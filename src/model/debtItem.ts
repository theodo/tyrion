import { DebtItemInterface } from './types';

export default class DebtItem implements DebtItemInterface {
  public type: string;
  public category: string;
  public comment: string;
  public fileName: string;
  public isContagious: boolean;
  public isDangerous: boolean;

  public constructor(
    type: string,
    category: string,
    comment: string,
    fileName: string,
    price?: number,
    isContagious: boolean = false,
    isDangerous: boolean = false,
  ) {
    this.type = type;
    this.category = category;
    this.comment = comment;
    this.fileName = fileName;
    this.isContagious = isContagious;
    this.isDangerous = isDangerous;
  }
}

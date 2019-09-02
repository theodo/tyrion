export default class DebtItem {
  public type: string;
  public category: string;
  public comment: string;
  public fileName: string;
  public price?: number;
  public isContagious: boolean;
  public isDangerous: boolean;

  public constructor(
    type: string,
    category: string,
    comment: string,
    fileName: string,
    price?: number,
    isContagious?: boolean,
    isDangerous?: boolean,
  ) {
    this.type = type;
    this.category = category;
    this.comment = comment;
    this.fileName = fileName;
    this.price = price;
    this.isContagious = typeof isContagious === 'boolean' ? isContagious : false;
    this.isDangerous = typeof isDangerous === 'boolean' ? isDangerous : false;
  }
}

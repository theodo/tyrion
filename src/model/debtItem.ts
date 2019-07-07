export default class DebtItem {
  public type: string;
  public category: string;
  public comment: string;
  public fileName: string;
  public price?: number;

  public constructor(type: string, category: string, comment: string, fileName: string, price?: number) {
    this.type = type;
    this.category = category;
    this.comment = comment;
    this.fileName = fileName;
    this.price = price;
  }
}

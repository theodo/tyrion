export default class Joconde {
  public type: string;
  public fileName: string;
  public category: string;
  public comment: string;

  public constructor(type: string, category: string, comment: string, fileName: string) {
    this.type = type;
    this.fileName = fileName;
    this.category = category;
    this.comment = comment;
  }
}

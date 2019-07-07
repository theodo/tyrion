import CodeQualityInformation from './codeQualityInformation';

export default class CodeQualityInformationHistory {
  public codeQualityInformationBag: CodeQualityInformation[];

  public constructor() {
    this.codeQualityInformationBag = new Array<CodeQualityInformation>();
  }

  public addCodeQualityInformation(codeQualityInformation: CodeQualityInformation): void {
    this.codeQualityInformationBag.push(codeQualityInformation);
  }
}

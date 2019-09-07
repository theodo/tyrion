import { CodeQualityInformationInterface, CodeQualityInformationHistoryInterface } from './types';

export default class CodeQualityInformationHistory implements CodeQualityInformationHistoryInterface {
  public codeQualityInformationBag: CodeQualityInformationInterface[];

  public constructor() {
    this.codeQualityInformationBag = new Array<CodeQualityInformationInterface>();
  }

  public addCodeQualityInformation(codeQualityInformation: CodeQualityInformationInterface): void {
    this.codeQualityInformationBag.push(codeQualityInformation);
  }
}

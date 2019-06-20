import CodeQualityInformation from "./codeQualityInformation";

export default class CodeQualityInformationHistory {
    codeQualityInformationBag: Array<CodeQualityInformation>;

    constructor() {
        this.codeQualityInformationBag = new Array<CodeQualityInformation>();
    }

    addCodeQualityInformation(codeQualityInformation: CodeQualityInformation): void {
        this.codeQualityInformationBag.push(codeQualityInformation);
    }
}

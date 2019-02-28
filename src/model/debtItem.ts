export default class DebtItem {
    type: string;
    category: string;
    comment: string;
    fileName: string;
    constructor(type: string, category: string, comment: string, fileName:string) {
        this.type = type;
        this.category = category;
        this.comment = comment;
        this.fileName = fileName;
    }
}

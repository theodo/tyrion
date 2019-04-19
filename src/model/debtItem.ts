export default class DebtItem {
    type: string;
    category: string;
    comment: string;
    fileName: string;
    price?: number;

    constructor(type: string, category: string, comment: string, fileName:string, price?:number) {
        this.type = type;
        this.category = category;
        this.comment = comment;
        this.fileName = fileName;
        this.price = price;
    }
}

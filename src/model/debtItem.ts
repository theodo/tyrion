export default class DebtItem {
    type: string;
    category: string;
    description: string;
    fileName: string;
    constructor(type: string, category: string, description: string, fileName:string) {
        this.type = type;
        this.category = category;
        this.description = description;
        this.fileName = fileName;
    }

    public static buildFromComment(comment: any, fileName:string): DebtItem {
        return new DebtItem(comment.type, comment.name, comment.description, fileName);
    }
}

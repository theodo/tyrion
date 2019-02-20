export default class Debt {
    type: string;
    category: string;
    description: string;
    constructor(type: string, category: string, description: string) {
        this.type = type;
        this.category = category;
        this.description = description;
    }

    public static buildFromComment(comment: any): Debt {
        return new Debt(comment.type, comment.name, comment.description);
    }
}

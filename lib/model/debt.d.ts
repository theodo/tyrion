export default class Debt {
    type: string;
    category: string;
    description: string;
    constructor(type: string, category: string, description: string);
    static buildFromComment(comment: any): Debt;
}

export default class Joconde {
    type: string;
    fileName: string;
    category: string;
    comment: string;

    constructor(type: string, category: string, comment: string, fileName:string) {
        this.type = type;
        this.fileName = fileName;
        this.category = category;
        this.comment = comment;
    }
}

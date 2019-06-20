import Joconde from "./joconde";

export default class JocondePareto {
    jocondes: Array<Joconde>;
    type: string;

    constructor(type: string) {
        this.type = type;
        this.jocondes = new Array<Joconde>();
    }

    addJoconde(joconde: Joconde): void {
        this.jocondes.push(joconde);
    }
}

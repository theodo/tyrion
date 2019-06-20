import JocondePareto from "./jocondePareto";
import Joconde from "./joconde";

export default class Louvre {
    jocondeParetos: Map<string, JocondePareto>;

    constructor() {
        this.jocondeParetos = new Map<string, JocondePareto>();
    }

    addJoconde(joconde: Joconde): void {
        let jocondePareto = this.jocondeParetos.get(joconde.type);
        if (jocondePareto instanceof JocondePareto) {
            jocondePareto.addJoconde(joconde)
        } else {
            jocondePareto = new JocondePareto(joconde.type);
            jocondePareto.addJoconde(joconde);
            this.jocondeParetos.set(joconde.type, jocondePareto);
        }
    }
}

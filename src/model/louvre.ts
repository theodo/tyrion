import JocondePareto from './jocondePareto';
import { JocondeParetoInterface, JocondeInterface, LouvreInterface } from './types';

export default class Louvre implements LouvreInterface {
  public jocondeParetos: Map<string, JocondeParetoInterface>;

  public constructor() {
    this.jocondeParetos = new Map<string, JocondeParetoInterface>();
  }

  public addJoconde(joconde: JocondeInterface): void {
    let jocondePareto = this.jocondeParetos.get(joconde.type);
    if (jocondePareto) {
      jocondePareto.addJoconde(joconde);
    } else {
      jocondePareto = new JocondePareto(joconde.type);
      jocondePareto.addJoconde(joconde);
      this.jocondeParetos.set(joconde.type, jocondePareto);
    }
  }

  public collectFromLouvre(louvre: Louvre): void {
    for (const jocondePareto of louvre.jocondeParetos.values()) {
      for (const joconde of jocondePareto.jocondes.values()) {
        this.addJoconde(joconde);
      }
    }
  }
}

import { JocondeInterface, JocondeParetoInterface } from './types';

export default class JocondePareto implements JocondeParetoInterface {
  public jocondes: JocondeInterface[];
  public type: string;

  public constructor(type: string) {
    this.type = type;
    this.jocondes = new Array<JocondeInterface>();
  }

  public addJoconde(joconde: JocondeInterface): void {
    this.jocondes.push(joconde);
  }
}

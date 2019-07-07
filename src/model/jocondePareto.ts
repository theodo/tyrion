import Joconde from './joconde';

export default class JocondePareto {
  public jocondes: Joconde[];
  public type: string;

  public constructor(type: string) {
    this.type = type;
    this.jocondes = new Array<Joconde>();
  }

  public addJoconde(joconde: Joconde): void {
    this.jocondes.push(joconde);
  }
}

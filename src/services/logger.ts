export default class Logger {
  public constructor(private displayLogs: boolean) {}
  public info(msg: string): void {
    if (this.displayLogs) {
      console.info(msg);
    }
  }

  public log(msg: string): void {
    if (this.displayLogs) {
      console.log(msg);
    }
  }

  public error(msg: string): void {
    if (this.displayLogs) {
      console.error(msg);
    }
  }
}

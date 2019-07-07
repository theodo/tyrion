export default class DateHelper {
  public static getDayMonthYearFormat(date: Date): string {
    return date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear();
  }

  public static getDateAsHtmlTemplate(date: Date): string {
    return 'new Date(' + date.getFullYear() + ',' + date.getMonth() + ',' + date.getDate() + ')';
  }
}

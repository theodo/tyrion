export default class DateHelper {
  // Caution: Month is as a number between 0 and 11 (January to December).
  public static getDayMonthYearFormat(date: Date): string {
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  }

  public static getDateAsHtmlTemplate(date: Date): string {
    return `new Date(${date.getFullYear()},${date.getMonth()},${date.getDate()})`;
  }

  public static getFrenchDayMonthYearFormat(date: Date): string {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }
}

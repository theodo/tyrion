export default class DateHelper {
    static getDayMonthYearFormat(date: Date): string {
        return date.getDay()+"-"+date.getMonth()+"-"+date.getFullYear();
    }

    static getDateAsHtmlTemplate(date: Date): string {
        return "new Date("+ date.getFullYear() + "," + date.getMonth() + "," + date.getDate() + ")";
    }
}

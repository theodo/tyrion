export default class DateHelper {
    static getDayMonthYearFormat(date: Date){
        return date.getDay()+"-"+date.getMonth()+date.getFullYear();
    }
}

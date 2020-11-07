import DateHelper from '../../utils/dateHelper';

describe('testing dateHelper', (): void => {
  const aliceBirthday = new Date(1991, 11, 19, 3, 24, 0);
  it('it should format correctly for french people', () => {
    expect(DateHelper.getFrenchDayMonthYearFormat(aliceBirthday)).toEqual('19-12-1991');
  });

  it('it should create a JS string with a date rounded to the day', () => {
    expect(DateHelper.getDateAsHtmlTemplate(aliceBirthday)).toEqual('new Date(1991,11,19)');
  });

  it('it should format correctly for french people', () => {
    expect(DateHelper.getDayMonthYearFormat(aliceBirthday)).toEqual('19-11-1991');
  });
});

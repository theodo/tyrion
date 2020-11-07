import { createMock } from 'ts-auto-mock';
import ProgramProvider from '../../services/programProvider';
import Collector from '../../services/collector';
import CSVExporter from '../../services/csvExporter';
import CodeQualityInformationDisplayer from '../../services/codeQualityInformationDisplayer';
import ReportGenerator from '../../services/reportGenerator';

describe('test programProvider', (): void => {
  it('it should call the right function for a current state analysis', () => {
    const collectorMock: Collector = createMock<Collector>();
    const csvExporterMock: CSVExporter = createMock<CSVExporter>();
    const codeQualityInformationDisplayerMock: CodeQualityInformationDisplayer = createMock<
      CodeQualityInformationDisplayer
    >();
    const reportGeneratorMock: ReportGenerator = createMock<ReportGenerator>();

    const programProvider = new ProgramProvider(
      collectorMock,
      csvExporterMock,
      codeQualityInformationDisplayerMock,
      reportGeneratorMock,
    );

    programProvider.analyzeCurrentState();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(collectorMock.collect).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(codeQualityInformationDisplayerMock.display).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(reportGeneratorMock.renderTypeParetoGraph).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(csvExporterMock.handleCSVGeneration).toHaveBeenCalled();
  });

  it('it should call the right function for a evolution analysis', () => {
    const collectorMock: Collector = createMock<Collector>();
    const csvExporterMock: CSVExporter = createMock<CSVExporter>();
    const codeQualityInformationDisplayerMock: CodeQualityInformationDisplayer = createMock<
      CodeQualityInformationDisplayer
    >();
    const reportGeneratorMock: ReportGenerator = createMock<ReportGenerator>();

    const programProvider = new ProgramProvider(
      collectorMock,
      csvExporterMock,
      codeQualityInformationDisplayerMock,
      reportGeneratorMock,
    );

    //TODO find a way to test the promises
    programProvider.analyzeDebtEvolution(120, 'staging');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(collectorMock.collectHistory).toHaveBeenCalled();
  });

  it('it should call the right function for a dev contributions analysis', () => {
    const collectorMock: Collector = createMock<Collector>();
    const csvExporterMock: CSVExporter = createMock<CSVExporter>();
    const codeQualityInformationDisplayerMock: CodeQualityInformationDisplayer = createMock<
      CodeQualityInformationDisplayer
    >();
    const reportGeneratorMock: ReportGenerator = createMock<ReportGenerator>();

    const programProvider = new ProgramProvider(
      collectorMock,
      csvExporterMock,
      codeQualityInformationDisplayerMock,
      reportGeneratorMock,
    );

    //TODO find a way to test the promises
    programProvider.analyzeDevsContributions(120, 'staging');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(collectorMock.collectDevsContributions).toHaveBeenCalled();
  });
});

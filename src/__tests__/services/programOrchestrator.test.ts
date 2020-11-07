import { createMock } from 'ts-auto-mock';
import ProgramProvider from '../../services/programProvider';
import ProgramOrchestrator, { ProgramOptionsList } from '../../services/programOrchestrator';
import Logger from '../../services/logger';

describe('test programOrchestrator', (): void => {
  const logger = new Logger(false);

  it('it should run analyzeCurrentState when no evolution is specified', () => {
    const programProviderMock: ProgramProvider = createMock<ProgramProvider>();

    const programOptions = {
      path: undefined,
      evolution: undefined,
      branch: undefined,
      nobrowser: undefined,
      csv: undefined,
      devs: undefined,
    } as ProgramOptionsList;

    const programOrchestrator = new ProgramOrchestrator(programOptions, programProviderMock, logger);
    programOrchestrator.selectAnalysis();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeCurrentState).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeDebtEvolution).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeDevsContributions).not.toHaveBeenCalled();

    const programOptions2 = {
      path: '.',
      evolution: undefined,
      branch: 'staging',
      nobrowser: undefined,
      csv: undefined,
      devs: undefined,
    } as ProgramOptionsList;

    const programOrchestrator2 = new ProgramOrchestrator(programOptions2, programProviderMock, logger);
    programOrchestrator2.selectAnalysis();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeCurrentState).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeDebtEvolution).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeDevsContributions).not.toHaveBeenCalled();
  });

  it('it should run analyzeDebtEvolution when evolution is specified', () => {
    const programProviderMock: ProgramProvider = createMock<ProgramProvider>();

    const programOptions = {
      path: undefined,
      evolution: '10',
      branch: undefined,
      nobrowser: undefined,
      csv: undefined,
      devs: undefined,
    } as ProgramOptionsList;

    const programOrchestrator = new ProgramOrchestrator(programOptions, programProviderMock, logger);
    programOrchestrator.selectAnalysis();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeCurrentState).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeDebtEvolution).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeDevsContributions).not.toHaveBeenCalled();
  });

  it('it should run analyzeDebtEvolution when evolution and devs are specified', () => {
    const programProviderMock: ProgramProvider = createMock<ProgramProvider>();
    const programOptions = {
      path: undefined,
      evolution: '10',
      branch: undefined,
      nobrowser: undefined,
      csv: undefined,
      devs: true,
    } as ProgramOptionsList;

    const programOrchestrator = new ProgramOrchestrator(programOptions, programProviderMock, logger);
    programOrchestrator.selectAnalysis();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeCurrentState).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeDebtEvolution).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeDevsContributions).toHaveBeenCalled();
  });

  it('it should run analyzeCurrentState when devs is specified but not evolution', () => {
    const programProviderMock: ProgramProvider = createMock<ProgramProvider>();
    const programOptions = {
      path: undefined,
      evolution: undefined,
      branch: undefined,
      nobrowser: undefined,
      csv: undefined,
      devs: true,
    } as ProgramOptionsList;

    const programOrchestrator = new ProgramOrchestrator(programOptions, programProviderMock, logger);
    programOrchestrator.selectAnalysis();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeCurrentState).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeDebtEvolution).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(programProviderMock.analyzeDevsContributions).not.toHaveBeenCalled();
  });
});

import Collector from '../services/collector';
import { PRIORITIZATION_TYPES } from '../model/debtPareto';
import Config from '../services/config';
import { CodeQualityInformationInterface } from '../model/types';

describe('collector', (): void => {
  it('should collect the correct debt paretos', (): Promise<void | CodeQualityInformationInterface> => {
    const testProjectPath = './test_project';
    const defaultConfig = new Config(testProjectPath);

    const collector = Collector.createFromConfig(testProjectPath, '', defaultConfig);
    return collector.collect().then(({ debt }): void => {
      expect(debt.debtScore).toEqual(224);

      expect(debt.getDebtScoreByPrioritization(PRIORITIZATION_TYPES.IS_CRITICAL)).toEqual(0);
      expect(debt.getDebtScoreByPrioritization(PRIORITIZATION_TYPES.IS_DANGEROUS)).toEqual(100);
      expect(debt.getDebtScoreByPrioritization(PRIORITIZATION_TYPES.IS_CONTAGIOUS)).toEqual(5);
      expect(debt.getDebtScoreByPrioritization(PRIORITIZATION_TYPES.IS_IDLE)).toEqual(119);

      expect(debt.getDebtScoreByType('dev-env')).toEqual(2);
      expect(debt.getDebtScoreByType('quality')).toEqual(20);
      expect(debt.getDebtScoreByType('OTHER')).toEqual(1);
      expect(debt.getDebtScoreByType('project-specific-type')).toEqual(1);
      expect(debt.getDebtScoreByType('security')).toEqual(200);
    });
  });
});

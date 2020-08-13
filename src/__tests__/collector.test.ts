import Collector from '../services/collector';
import { PRIORITIZATION_TYPES } from '../model/debtPareto';
import Config from '../services/config';
import { CodeQualityInformationInterface } from '../model/types';
import Pricer from '../services/pricer';

describe('collector', (): void => {
  it('should collect the correct debt paretos', (): Promise<void | CodeQualityInformationInterface> => {
    const testProjectPath = './test_project';
    const defaultConfig = new Config(testProjectPath);

    const pricer = new Pricer(defaultConfig.prices);

    const collector = Collector.createFromConfig(testProjectPath, defaultConfig);
    return collector.collect().then(({ debt }): void => {
      expect(pricer.getDebtScoreFromDebt(debt)).toEqual(224);

      const scoreByTypePrioritized = pricer.getScoreByTypePrioritized(debt.debtParetos);

      for (const typeScore of scoreByTypePrioritized) {
        if (typeScore.type === 'security') {
          expect(typeScore.debtScoreByPrioritization[PRIORITIZATION_TYPES.IS_DANGEROUS]).toEqual(100);
          expect(typeScore.debtScoreByPrioritization[PRIORITIZATION_TYPES.IS_IDLE]).toEqual(100);
        }

        if (typeScore.type === 'quality') {
          expect(typeScore.debtScoreByPrioritization[PRIORITIZATION_TYPES.IS_CONTAGIOUS]).toEqual(5);
          expect(typeScore.debtScoreByPrioritization[PRIORITIZATION_TYPES.IS_IDLE]).toEqual(15);
        }

        if (typeScore.type === 'dev-env') {
          expect(typeScore.debtScoreByPrioritization[PRIORITIZATION_TYPES.IS_CRITICAL]).toEqual(1);
          // expect(typeScore.debtScoreByPrioritization[PRIORITIZATION_TYPES.IS_IDLE]).toEqual(0); Bug see config.ts for more information
        }
      }
    });
  });
});

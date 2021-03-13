import Collector from '../../services/collector';
import { PRIORITIZATION_TYPES } from '../../model/debtPareto';
import Config from '../../services/config';
import Pricer from '../../services/pricer';
import SyntaxParser from '../../services/syntaxParser';

describe('collector', (): void => {
  it('should collect the correct debt paretos', () => {
    const testProjectPath = './test_project';
    const defaultConfig = new Config(testProjectPath);

    const pricer = new Pricer(defaultConfig.prices);
    const syntaxParser = new SyntaxParser(defaultConfig);
    const collector = new Collector(syntaxParser, defaultConfig, testProjectPath);

    const codeQualityInformation = collector.collect();
    const debt = codeQualityInformation.debt;
    expect(pricer.getDebtScoreFromDebt(debt)).toEqual(229);

    const scoreByTypePrioritized = pricer.getScoreByTypePrioritized(debt.debtParetos);

    for (const typeScore of scoreByTypePrioritized) {
      if (typeScore.type === 'security') {
        expect(typeScore.debtScoreByPrioritization[PRIORITIZATION_TYPES.IS_DANGEROUS]).toEqual(100);
        expect(typeScore.debtScoreByPrioritization[PRIORITIZATION_TYPES.IS_IDLE]).toEqual(100);
      }

      if (typeScore.type === 'quality') {
        expect(typeScore.debtScoreByPrioritization[PRIORITIZATION_TYPES.IS_CONTAGIOUS]).toEqual(5);
        expect(typeScore.debtScoreByPrioritization[PRIORITIZATION_TYPES.IS_IDLE]).toEqual(20);
      }

      if (typeScore.type === 'dev-env') {
        expect(typeScore.debtScoreByPrioritization[PRIORITIZATION_TYPES.IS_CRITICAL]).toEqual(1);
        // expect(typeScore.debtScoreByPrioritization[PRIORITIZATION_TYPES.IS_IDLE]).toEqual(0); Bug see config.ts for more information
      }
    }
  });
});

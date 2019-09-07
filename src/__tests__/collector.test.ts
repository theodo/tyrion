import Collector from '../services/collector';
import { PRIORIZATION_TYPES } from '../model/debtPareto';

describe('collector', () => {
  it('should collect the correct debt paretos', () => {
    const collector = new Collector('./test_project');
    collector.collect().then(({ debt }) => {
      expect(debt.debtScore).toEqual(8);

      expect(debt.getDebtScoreByPrioritization(PRIORIZATION_TYPES.IS_CRITICAL)).toEqual(0);
      expect(debt.getDebtScoreByPrioritization(PRIORIZATION_TYPES.IS_DANGEROUS)).toEqual(0);
      expect(debt.getDebtScoreByPrioritization(PRIORIZATION_TYPES.IS_CONTAGIOUS)).toEqual(0);
      expect(debt.getDebtScoreByPrioritization(PRIORIZATION_TYPES.IS_IDLE)).toEqual(8);

      expect(debt.getDebtScoreByType('dev-env')).toEqual(2);
      expect(debt.getDebtScoreByType('quality')).toEqual(3);
      expect(debt.getDebtScoreByType('OTHER')).toEqual(1);
      expect(debt.getDebtScoreByType('project-specific-type')).toEqual(1);
      expect(debt.getDebtScoreByType('security')).toEqual(1);
    });
  });
});

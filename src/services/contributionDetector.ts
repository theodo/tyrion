import { Commit } from 'nodegit';
import { ContributionInterface } from '../model/types';
import SyntaxParser from './syntaxParser';

export default class ContributionDetector {
  public static async detectHealersAndScoutFromCommit(commit: Commit): Promise<ContributionInterface> {
    const contributionScore: ContributionInterface = {
      healerScore: 0,
      scoutScore: 0,
    };

    let diffs = await commit.getDiff();
    for (let diff of diffs) {
      let patches = await diff.patches();
      for (let patch of patches) {
        let hunks = await patch.hunks();
        for (let oneHunk of hunks) {
          let lines = await oneHunk.lines();
          lines = lines.filter((line): boolean => SyntaxParser.isComment(line.content()));
          for (let line of lines) {
            const debtTag = SyntaxParser.getTag(line.content(), SyntaxParser.debtTags);

            if (debtTag) {
              if (line.newLineno() < 0) {
                contributionScore.healerScore++;
              }

              if (line.oldLineno() < 0) {
                contributionScore.scoutScore++;
              }
            }
          }
        }
      }
    }
    return contributionScore;
  }
}

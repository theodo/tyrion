import { Commit } from 'nodegit';
import DateHelper from '../utils/dateHelper';

export default class CommitSelector {
  public static async getRelevantCommits(lastCommit: Commit, historyNumberOfDays: number): Promise<Commit[]> {
    const history = lastCommit.history();
    return new Promise((resolve): void => {
      history.on('end', function(commits: Commit[]): void {
        // We select one commit per day, the first one we meet
        const startDate = lastCommit.date();
        const startDateTime = startDate.getTime();
        const NUMBER_OF_DAYS_TO_BUILD_HISTORY = historyNumberOfDays * 24 * 3600000;
        const endDateTime = startDateTime - NUMBER_OF_DAYS_TO_BUILD_HISTORY;

        const relevantCommits = new Map<string, Commit>();
        for (let commit of commits) {
          if (commit.date().getTime() < endDateTime) {
            break;
          }

          const formattedDate = DateHelper.getDayMonthYearFormat(commit.date());
          const commitOfTheDay = relevantCommits.get(formattedDate);

          // We keep only one commit per day
          if (!commitOfTheDay) {
            relevantCommits.set(formattedDate, commit);
          }
        }
        return resolve(Array.from(relevantCommits.values()));
      });

      history.start();
    });
  }

  public static async getAllCommitsAfterADate(lastCommit: Commit, historyNumberOfDays: number): Promise<Commit[]> {
    const history = lastCommit.history();
    return new Promise((resolve): void => {
      history.on('end', function(commits: Commit[]): void {
        // We select one commit per day, the first one we meet
        const startDate = lastCommit.date();
        const startDateTime = startDate.getTime();
        const NUMBER_OF_DAYS_TO_BUILD_HISTORY = historyNumberOfDays * 24 * 3600000;
        const endDateTime = startDateTime - NUMBER_OF_DAYS_TO_BUILD_HISTORY;

        const relevantCommits = new Array<Commit>();
        for (let commit of commits) {
          if (commit.date().getTime() < endDateTime) {
            break;
          }
          relevantCommits.push(commit);
        }
        return resolve(relevantCommits);
      });

      history.start();
    });
  }
}

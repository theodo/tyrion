import { ContributionInterface, DeveloperInterface } from './types';
import Developer from './developer';

export default class Contributions {
  public developers: Map<string, DeveloperInterface>;

  public constructor() {
    this.developers = new Map<string, DeveloperInterface>();
  }

  public addContributionFromDeveloper(emailDeveloper: string, contributions: ContributionInterface): void {
    const developer = this.developers.get(emailDeveloper) ?? new Developer(emailDeveloper);
    developer.addContributions(contributions);
    this.developers.set(emailDeveloper, developer);
  }
}

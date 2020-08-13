import { ContributionInterface, DeveloperInterface } from './types';

export default class Developer implements DeveloperInterface {
  public email: string;
  public scoutScore: number;
  public healerScore: number;

  public constructor(email: string) {
    this.email = email;
    this.scoutScore = 0;
    this.healerScore = 0;
  }

  public addContributions(contributions: ContributionInterface): void {
    this.scoutScore += contributions.scoutScore;
    this.healerScore += contributions.healerScore;
  }
}

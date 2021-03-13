import isEmpty from 'lodash/isEmpty';
import { TreeEntry } from 'nodegit';
import { DebtItemInterface, JocondeInterface } from '../model/types';
import DebtItem from '../model/debtItem';
import Joconde from '../model/joconde';
import CodeQualityInformation from '../model/codeQualityInformation';
import Config from './config';

export default class SyntaxParser {
  public constructor(private configService: Config) {}
  private jocondeTags = ['@best', '@standard', 'JOCONDE'];

  public async parseEntry(entry: TreeEntry): Promise<CodeQualityInformation> {
    const blob = await entry.getBlob();
    return this.parseFile(String(blob), entry.path());
  }

  public parseFile(file: string, fileName: string): CodeQualityInformation {
    const lines: string[] = file.split('\n');

    return this.parseLines(lines, fileName);
  }

  public parseLines(lines: string[], fileName: string): CodeQualityInformation {
    const codeQualityInformation = new CodeQualityInformation();
    for (const line of lines) {
      const debtTag = this.getDebtTag(line);
      if (debtTag != null) {
        const debtItem = this.parseDebtLine(line, fileName, debtTag);
        codeQualityInformation.debt.addDebtItem(debtItem);
      }

      const jocondeTag = this.getJocondeTag(line);
      if (jocondeTag != null) {
        const joconde = this.parseJocondeLine(line, fileName, jocondeTag);
        codeQualityInformation.louvre.addJoconde(joconde);
      }
    }

    return codeQualityInformation;
  }

  public getDebtTag(line: string): string | undefined {
    return this.getTag(line, this.configService.debtTags);
  }

  private getJocondeTag(line: string): string | undefined {
    return this.getTag(line, this.jocondeTags);
  }

  /**
   * Check if the line contains a Tag
   */
  private getTag(line: string, tags: string[]): string | undefined {
    for (const tag of tags) {
      if (line.indexOf(tag) >= 0) {
        return tag;
      }
    }
  }

  /**
   * Parse the different elements in a debt line.
   * A debt line may have a comment at the end.
   *
   * @param line
   * @param fileName
   * @param debtTag
   */
  public parseDebtLine(line: string, fileName: string, debtTag: string): DebtItemInterface {
    const lineWithoutDebtTag = line.substr(line.indexOf(debtTag) + debtTag.length + 1);

    const comment = this.parseDebtLineComment(line);

    const lineWithoutDebtAndComment =
      comment === '' ? lineWithoutDebtTag : lineWithoutDebtTag.substr(0, lineWithoutDebtTag.indexOf('"')).trim();

    // lineElements can be "DEBT_TYPE:SUB_TYPE" or "DEBT_TYPE:SUB_TYPE price:PRICE"
    const lineElements = lineWithoutDebtAndComment.split(' ');

    // Process DEBT_TYPE:SUB_TYPE
    const types = lineElements[0].split(':');
    const debtType = types[0] || 'OTHER';
    const debtCategory = types[1] ? types[1] : '';

    // Process price:PRICE
    const price = this.getPrice(lineElements);
    const { isContagious, isDangerous } = this.getDebtPriorization(lineElements);

    return new DebtItem(debtType, debtCategory, comment, fileName, price, isContagious, isDangerous);
  }

  /**
   * TODO quality "Maximet: parseDebtLine and parseJocondeLine can be refactored"
   *
   * @param line
   * @param fileName
   * @param tag
   */
  public parseJocondeLine(line: string, fileName: string, tag: string): JocondeInterface {
    const lineWithoutTag = line.substr(line.indexOf(tag) + tag.length + 1);

    const comment = this.parseDebtLineComment(line);

    const lineWithoutDebtAndComment =
      comment === '' ? lineWithoutTag : lineWithoutTag.substr(0, lineWithoutTag.indexOf('"')).trim();

    // lineElements can be "TYPE" or "TYPE:SUB_TYPE"
    const lineElements = lineWithoutDebtAndComment.split(' ');

    // Process DEBT_TYPE:SUB_TYPE
    const types = lineElements[0].split(':');
    const type = types[0];
    const category = types[1] ? types[1] : '';

    return new Joconde(type, category, comment, fileName);
  }

  /**
   * Return the comment of a line debt if any.
   *
   * @param line . A line without the @debt tag in it, like : bug:error price:50 "awesome comment"
   */
  public parseDebtLineComment(line: string): string {
    const comment = line.substr(line.indexOf('"') + 1);
    if (comment.indexOf('"') >= 0) {
      return comment.substr(0, comment.indexOf('"'));
    }
    return '';
  }

  /**
   * If exists, returns the price from a list of lineElements
   *
   * @param lineElements ["DEBT_TYPE:SUB_TYPE", "price:50"] or ["DEBT_TYPE:SUB_TYPE"]
   */
  public getPrice(lineElements: string[]): number | undefined {
    const priceAnnotation = lineElements.filter((lineElement): boolean => lineElement.startsWith('price:'));

    return !isEmpty(priceAnnotation) ? parseInt(priceAnnotation[0].split(':')[1]) : undefined;
  }

  public getDebtPriorization(lineElements: string[]): { isContagious: boolean; isDangerous: boolean } {
    const isContagious = lineElements.includes('contagious');
    const isDangerous = lineElements.includes('dangerous');

    return { isContagious, isDangerous };
  }
}

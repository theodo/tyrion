import { DebtItemInterface, JocondeInterface } from '../model/types';
import DebtItem from '../model/debtItem';
import Joconde from '../model/joconde';
import isEmpty from 'lodash/isEmpty';
import { TreeEntry } from 'nodegit';
import CodeQualityInformation from '../model/codeQualityInformation';

export default class SyntaxParser {
  public static debtTags = ['@debt', 'TODO', 'FIXME'];
  public static jocondeTags = ['@best', '@standard', 'JOCONDE'];

  public static async parseEntry(entry: TreeEntry): Promise<CodeQualityInformation> {
    const blob = await entry.getBlob();
    return this.parseFile(String(blob), entry.path());
  }

  public static parseFile(file: string, fileName: string): CodeQualityInformation {
    let lines: string[] = file.split('\n');

    return this.parseLines(lines, fileName);
  }

  public static parseLines(lines: string[], fileName: string): CodeQualityInformation {
    const codeQualityInformation = new CodeQualityInformation();
    const commentLines = this.extractCommentLines(lines);

    for (let line of commentLines) {
      const debtTag = SyntaxParser.getTag(line, this.debtTags);
      if (debtTag) {
        const debtItem = SyntaxParser.parseDebtLine(line, fileName, debtTag);
        codeQualityInformation.debt.addDebtItem(debtItem);
      }

      const jocondeTag = SyntaxParser.getTag(line, this.jocondeTags);
      if (jocondeTag) {
        const joconde = SyntaxParser.parseJocondeLine(line, fileName, jocondeTag);
        codeQualityInformation.louvre.addJoconde(joconde);
      }
    }

    return codeQualityInformation;
  }

  public static extractCommentLines(lines: string[]): string[] {
    return lines.filter((line): boolean => SyntaxParser.isComment(line));
  }

  /**
   * Check if the line contains a Tag
   *
   * @param line
   * @param tags
   */
  public static getTag(line: string, tags: string[]): string | undefined {
    for (let tag of tags) {
      if (line.indexOf(tag) >= 0) {
        return tag;
      }
    }
  }

  /**
   * Check if the line is a comment
   * @param line
   */
  public static isComment(line: string): boolean {
    const lineTrimmed = line.trim();
    const firstChar = lineTrimmed.charAt(0);

    return firstChar === '#' || firstChar === '*' || firstChar === '/';
  }

  /**
   * Parse the different elements in a debt line.
   * A debt line may have a comment at the end.
   *
   * @param line
   * @param fileName
   */
  public static parseDebtLine(line: string, fileName: string, debtTag: string): DebtItemInterface {
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
  public static parseJocondeLine(line: string, fileName: string, tag: string): JocondeInterface {
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
  public static parseDebtLineComment(line: string): string {
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
  public static getPrice(lineElements: string[]): number | undefined {
    const priceAnnotation = lineElements.filter((lineElement): boolean => lineElement.startsWith('price:'));

    return !isEmpty(priceAnnotation) ? parseInt(priceAnnotation[0].split(':')[1]) : undefined;
  }

  public static getDebtPriorization(lineElements: string[]): { isContagious: boolean; isDangerous: boolean } {
    const isContagious = lineElements.includes('contagious');
    const isDangerous = lineElements.includes('dangerous');

    return { isContagious, isDangerous };
  }
}

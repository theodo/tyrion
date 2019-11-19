import uuid from 'uuid';

import { DebtItemInterface } from './types';

export default class DebtItem implements DebtItemInterface {
  public id: string;
  public type: string;
  public category: string;
  public comment: string;
  public fileName: string;
  public price?: number;
  public isContagious: boolean;
  public isDangerous: boolean;

  public constructor({
    id,
    type,
    category,
    comment,
    fileName,
    price,
    isContagious,
    isDangerous,
  }: {
    id?: string;
    type: string;
    category: string;
    comment: string;
    fileName: string;
    price?: number;
    isContagious: boolean;
    isDangerous: boolean;
  }) {
    this.id = id || uuid();
    this.type = type;
    this.category = category;
    this.comment = comment;
    this.fileName = fileName;
    this.price = price;
    this.isContagious = isContagious || false;
    this.isDangerous = isDangerous || false;
  }
}

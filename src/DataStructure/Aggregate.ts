/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 16:57:11 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 16:57:11 
 */
import { SubSet } from "./SubSet";
import { BaseElement } from "./BaseElement";

export class Aggregate extends BaseElement {
  disproportionality: number;
  expectedProb: number;
  level: number;
  isCollapsed: boolean;
  subSets: SubSet[];

  constructor(
    aggregateId: number | string,
    aggregateName: string,
    level: number
  ) {
    super(aggregateId, aggregateName);
    this.subSets = [];
    this.isCollapsed = true;
    this.level = level;
    this.expectedProb = 0;
    this.disproportionality = 0;
  }

  addSubSet(subSet: SubSet) {
    this.subSets.push(subSet);
    this.items = this.items.concat(subSet.items);
    this.setSize += subSet.setSize;
    this.expectedProb += subSet.expectedProb;
    this.disproportionality += subSet.disproportionality;
  }
}

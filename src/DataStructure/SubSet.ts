/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 16:58:11 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 16:58:11 
 */
import { Set } from "./Set";

export class SubSet extends Set {
  expectedProb: number;
  disproportionality: number;
  selections: {};
  constructor(
    setId: number,
    setName: string,
    combinedSets: number[],
    itemList: number[],
    expectedProb: number
  ) {
    super(setId, setName, combinedSets, itemList);
    this.selections = {};
    this.expectedProb = expectedProb;
    let observedProb = this.setSize * 1.0 / this.depth;
    this.disproportionality = observedProb - expectedProb;
  }

  toString() {
    return `Subset ${this.id}, No of Combined Sets: ${this.noCombinedSets}`;
  }
}

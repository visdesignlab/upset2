/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 16:58:11 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 16:58:11 
 */
import { Set } from "./Set";
import { RowType } from "./RowType";

export class SubSet extends Set {
  expectedProb: number;
  disproportionality: number;
  selections: {};
  constructor(
    setId: number,
    setName: string,
    combinedSets: number[],
    itemList: number[],
    expectedProb: number,
    depth: number
  ) {
    super(setId, setName, combinedSets, itemList, depth, true);
    this.selections = {};
    this.depth = depth;
    this.expectedProb = expectedProb;
    let observedProb = this.setSize * 1.0 / this.depth;
    this.disproportionality = observedProb - expectedProb;
    this.type = RowType.SUBSET;
  }

  toString() {
    return `Subset ${this.id}, No of Combined Sets: ${this.noCombinedSets}`;
  }
}

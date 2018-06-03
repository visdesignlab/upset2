/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 16:58:07 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 16:58:07 
 */
import { BaseSet } from "./BaseSet";
export class Set extends BaseSet {
  isSelected: boolean;
  itemList: number[];

  constructor(
    setId: number,
    setName: string,
    combinedSets: number[],
    itemList: number[]
  ) {
    super(setId, setName, combinedSets, []);
    this.dataRatio = this.setSize / this.depth;
    this.itemList = itemList;
    this.isSelected = false;
  }
}

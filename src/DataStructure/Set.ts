/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 16:58:07 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 16:58:07 
 */
import { BaseSet } from "./BaseSet";
import { RowType } from "./RowType";
export class Set extends BaseSet {
  isSelected: boolean;
  itemList: number[];

  constructor(
    setId: number | string,
    setName: string,
    combinedSets: number[],
    itemList: number[],
    depth: number,
    isSuperCall: boolean = false
  ) {
    if (isSuperCall) super(setId, setName, combinedSets, itemList, depth);
    else {
      super(setId, setName, combinedSets, [], depth);
      for (let i = 0; i < itemList.length; ++i) {
        if (itemList[i] !== 0) {
          this.items.push(i);
          this.setSize++;
        }
      }
    }
    this.depth = depth;
    this.dataRatio = this.setSize / this.depth;
    this.itemList = itemList;
    this.isSelected = false;
    this.type = RowType.SET;
  }
}

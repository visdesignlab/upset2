/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 16:57:29 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 16:57:29 
 */
import { Aggregate } from "./Aggregate";
import { SubSet } from "./SubSet";
import { BaseElement } from "./BaseElement";
import { RowType } from "./RowType";

export class Group extends BaseElement {
  aggregate: Aggregate;
  disproportionalitySum: number;
  disproportionality: number;
  expectedProb: number;
  hiddenSets: SubSet[];
  visibleSets: SubSet[];
  subSets: SubSet[];
  level: number;
  nestedGroups: boolean;
  isCollapsed: boolean;
  constructor(groupId: number | string, groupName: string, level: number) {
    super(groupId, groupName);
    this.type = RowType.GROUP;
    this.isCollapsed = false;
    this.nestedGroups = false;
    this.level = 1;
    if (level) this.level = level;

    this.subSets = [];
    this.visibleSets = [];
    this.aggregate = new Aggregate(`empty${groupId}`, "Subsets", level + 1);

    this.hiddenSets = [];

    this.expectedProb = 0;
    this.disproportionality = 0;
    this.disproportionalitySum = 0;
  }

  addSubSet(subSet: SubSet) {
    this.subSets.push(subSet);

    if (subSet.setSize > 0) {
      this.visibleSets.unshift(subSet);
    } else {
      this.hiddenSets.unshift(subSet);
      this.aggregate.addSubSet(subSet);
    }

    this.items = this.items.concat(subSet.items);
    this.setSize += subSet.setSize;
    this.expectedProb += subSet.expectedProb;
    this.disproportionality += subSet.disproportionality;
  }

  contains(element: SubSet): boolean {
    if (this.subSets.indexOf(element) >= 0) return true;
    // if (element === this.aggregate) return true;
    return false;
  }
}

import { AggregateBy } from "./AggregateAndFilters";
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
  nestedGroups: Array<Group>;
  isCollapsed: boolean;
  aggBy: AggregateBy;
  setMemberships: number[];
  constructor(
    groupId: number | string,
    groupName: string,
    level: number,
    aggBy: AggregateBy,
    setMemberships?: number[]
  ) {
    super(groupId, groupName);

    if (level === 1) {
      if (groupName.length >= 9) {
        this.elementName = `${groupName.substring(0, 7)}...`;
      }
    } else {
      if (groupName.length >= 10) {
        this.elementName = `${groupName.substring(0, 5)}...`;
      }
    }

    this.type = RowType.GROUP;
    this.isCollapsed = false;
    this.nestedGroups = [];
    this.level = 1;
    if (level) this.level = level;

    this.subSets = [];
    this.visibleSets = [];
    this.aggregate = new Aggregate(`empty${groupId}`, "Subsets", level + 1);

    this.setMemberships = setMemberships;

    this.aggBy = aggBy;

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

  addNestedGroup(group: Group) {
    this.nestedGroups.push(group);

    this.hiddenSets = this.hiddenSets.concat(group.hiddenSets);
    this.visibleSets = this.visibleSets.concat(group.visibleSets);
    group.subSets.forEach(set => {
      this.aggregate.addSubSet(set);
    });

    // this.items = this.items.concat(group.items);
    // this.setSize += group.setSize;
    // this.expectedProb += group.expectedProb;
    // this.disproportionality += group.disproportionality;
  }

  contains(element: SubSet): boolean {
    return this.subSets.indexOf(element) >= 0;
  }
}

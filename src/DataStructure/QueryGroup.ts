/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 16:58:03 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-03 17:24:56
 */
import { Group } from "./Group";
import { Clause } from "./Clause";
import { RowType } from "./RowType";

export class QueryGroup extends Group {
  combinedSets: any[];
  orClauses: Clause[];
  constructor(
    groupId: number | string,
    groupName: string,
    orClauses: Clause[]
  ) {
    super(groupId, groupName, 1);
    this.orClauses = orClauses;
    this.type = RowType.QUERY_GROUP;
    if (orClauses.length == 1) {
      this.combinedSets = Object.keys(orClauses[0]).map(key => {
        return orClauses[0][key].state;
      });
    }
  }
}

import { SubSet } from "./SubSet";
import { RowType } from "./RowType";
import { RenderRow } from "./../type_declarations/types";
import { SortBy } from "./AggregateAndFilters";
import { Group } from "./Group";

let SortStrategy: {
  [key: string]: (data: RenderRow[], setId?: number) => RenderRow[];
} = {};

SortStrategy[SortBy.CARDINALITY] = sortByCardinality;
SortStrategy[SortBy.DEGREE] = sortByDegree;
SortStrategy[SortBy.DEVIATION] = sortByDeviation;
SortStrategy[SortBy.SET] = sortBySet;

export default SortStrategy;

//  Sorting function definitions

function sortByCardinality(data: RenderRow[]): RenderRow[] {
  let groups = data.reduce((p, c, i) => {
    if (c.data.type === RowType.GROUP) p.push(i);
    return p;
  }, []);
  let rr: Array<RenderRow> = [];
  if (groups.length === 0) {
    return data.sort((d1, d2) => {
      return d2.data.setSize - d1.data.setSize;
    });
  }
  groups.forEach((g, idx) => {
    rr.push(data[g]);
    let els = data.slice(g + 1, groups[idx + 1]);
    els = els.sort((d1, d2) => {
      return d2.data.setSize - d1.data.setSize;
    });
    rr = rr.concat(els);
  });

  return rr;
}

function sortBySet(data: RenderRow[], setId: number): RenderRow[] {
  let a = data.sort((d1, d2) => {
    return (
      (d2.data as SubSet).combinedSets[setId] -
      (d1.data as SubSet).combinedSets[setId]
    );
  });
  return a;
}

function sortByDegree(data: RenderRow[], setId: number): RenderRow[] {
  return data;
}
function sortByDeviation(data: RenderRow[], setId: number): RenderRow[] {
  data = data.sort((a, b) => {
    return a.data.disproportionality - b.data.disproportionality;
  });
  if (data.filter(_ => _.data.type === RowType.GROUP).length > 0) {
    data.forEach(row => {
      let group = row.data as Group;
      group.visibleSets = group.visibleSets.sort(
        (a, b) => a.disproportionality - b.disproportionality
      );
      if (group.nestedGroups.length > 0) {
        group.nestedGroups.forEach(ng => {
          ng.visibleSets = ng.visibleSets.sort(
            (a, b) => a.disproportionality - b.disproportionality
          );
        });
      }
    });
  }
  return data;
}

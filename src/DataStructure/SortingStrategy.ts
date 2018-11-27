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
  data.sort((a, b) => b.data.disproportionality - a.data.disproportionality);
  if (data.filter(_ => _.data.type === RowType.GROUP).length > 0) {
    data.forEach(row => {
      let group = row.data as Group;
      group.visibleSets.sort(
        (a, b) => b.disproportionality - a.disproportionality
      );
      if (group.nestedGroups.length > 0) {
        group.nestedGroups.sort(
          (a, b) => b.disproportionality - a.disproportionality
        );
        group.nestedGroups.forEach(ng => {
          ng.visibleSets.sort(
            (a, b) => b.disproportionality - a.disproportionality
          );
        });
      }
    });
  }
  return data;
}

function sortByCardinality(data: RenderRow[]): RenderRow[] {
  data.sort((a, b) => b.data.setSize - a.data.setSize);
  if (data.filter(_ => _.data.type === RowType.GROUP).length > 0) {
    data.forEach(row => {
      let group = row.data as Group;
      group.visibleSets.sort((a, b) => b.setSize - a.setSize);
      if (group.nestedGroups.length > 0) {
        group.nestedGroups.sort((a, b) => b.setSize - a.setSize);
        group.nestedGroups.forEach(ng => {
          ng.visibleSets.sort((a, b) => b.setSize - a.setSize);
        });
      }
    });
  }
  return data;
}

import { SubSet } from "./SubSet";
import { RowType } from "./RowType";
import { RenderRow } from "./../type_declarations/types";
import { SortBy } from "./AggregateAndFilters";

let SortStrategy: {
  [key: string]: (data: RenderRow[], setId?: number) => RenderRow[];
} = {};

SortStrategy[SortBy.CARDINALITY] = sortByCardinality;
SortStrategy[SortBy._SET] = sortBySet;

export default SortStrategy;

//  Sorting function definitions

function sortByCardinality(data: RenderRow[]): RenderRow[] {
  let groups = data.reduce((p, c, i) => {
    if (c.data.type === RowType.GROUP) p.push(i);
    return p;
  }, []);
  let rr: Array<RenderRow> = [];

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
  return data.sort((d1, d2) => {
    return (
      (d2.data as SubSet).combinedSets[setId] -
      (d1.data as SubSet).combinedSets[setId]
    );
  });
}

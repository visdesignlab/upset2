import { SubSet } from "./SubSet";
import { Group } from "./Group";
import { AggregateBy } from "./AggregateAndFilters";
import { RenderRow } from "./../type_declarations/types";

let AggregationStrategy: {
  [key: string]: (data: RenderRow[]) => RenderRow[];
} = {};

AggregationStrategy[AggregateBy.DEGREE] = aggregateByDegree;
AggregationStrategy[AggregateBy.SETS] = aggregateBySets;
AggregationStrategy[AggregateBy.DEVIATION] = aggregateByDeviation;
AggregationStrategy[AggregateBy.OVERLAPS] = aggregateByOverlap;

export default AggregationStrategy;

// Functions
function aggregateByDegree(data: RenderRow[], level: number = 1): RenderRow[] {
  let groups = data.reduce((groups: any, item) => {
    let val = (item.data as SubSet).noCombinedSets;
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
  let rr: RenderRow[] = [];

  for (let group in groups) {
    let g = new Group(`Group_Deg_${group}`, `Degree ${group}`, level);
    rr.push({ id: g.id.toString(), data: g });
    let subsets = groups[group] as RenderRow[];
    subsets.forEach(subset => {
      g.addSubSet(subset.data as SubSet);
      rr.push({ id: subset.id.toString(), data: subset.data });
    });
  }

  return rr;
}

function aggregateByDeviation(
  data: RenderRow[],
  level: number = 1
): RenderRow[] {
  return data;
}

function aggregateByOverlap(data: RenderRow[], level: number = 1): RenderRow[] {
  return data;
}

function aggregateBySets(data: RenderRow[], level: number = 1): RenderRow[] {
  let subSetNames: { [key: number]: string } = {};
  data.filter(d => (d.data as SubSet).noCombinedSets === 1).map(d => {
    subSetNames[(d.data as SubSet).combinedSets.findIndex(i => i === 1)] =
      d.data.elementName;
  });

  let groups = data.reduce((groups: any, item) => {
    let val = (item.data as SubSet).combinedSets;
    let vals: number[] = [];
    val.forEach((d, i) => {
      if (d === 1) {
        vals.push(i);
      }
    });

    vals.forEach(val => {
      groups[subSetNames[val]] = groups[subSetNames[val]] || [];
      groups[subSetNames[val]].push(item);
    });

    return groups;
  }, {});

  let rr: RenderRow[] = [];

  for (let group in groups) {
    let g = new Group(
      `Group_Set_${group.replace(" ", "_")}`,
      `Set: ${group}`,
      level
    );
    rr.push({ id: g.id.toString(), data: g });
    let subsets = groups[group] as RenderRow[];
    subsets.forEach(subset => {
      g.addSubSet(subset.data as SubSet);
      rr.push({ id: subset.id.toString(), data: subset.data });
    });
  }

  return rr;
}
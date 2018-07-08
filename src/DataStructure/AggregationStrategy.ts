import { SubSet } from "./SubSet";
import { Group } from "./Group";
import { AggregateBy } from "./AggregateAndFilters";
import { RenderRow } from "./../type_declarations/types";

let AggregationStrategy: {
  [key: string]: (data: RenderRow[], overlap?: number) => RenderRow[];
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
  let groups = data.reduce((groups: any, item) => {
    let val = (item.data as SubSet).disproportionality;
    if (val >= 0) {
      groups["Positive"] = groups["Positive"] || [];
      groups["Positive"].push(item);
    } else {
      groups["Negative"] = groups["Negative"] || [];
      groups["Negative"].push(item);
    }
    return groups;
  }, {});

  let rr: RenderRow[] = [];

  for (let group in groups) {
    let g = new Group(
      `${group}_Expected_Value`,
      `${group} Expected Value`,
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

function aggregateByOverlap(
  data: RenderRow[],
  overlap: number,
  level: number = 1
): RenderRow[] {
  let combinations = data
    .filter(d => {
      return (
        (d.data as SubSet).noCombinedSets.toString() === overlap.toString()
      );
    })
    .map(d => {
      return {
        name: (d.data as SubSet).elementName,
        idx: (d.data as SubSet).combinedSets
          .map((v, i) => [i, v === 1])
          .filter(v => v[1])
          .map(v => v[0])
      };
    });

  data = data.filter(d => {
    return (d.data as SubSet).noCombinedSets >= overlap;
  });

  let groups = data.reduce((groups: any, item) => {
    let idx = (item.data as SubSet).combinedSets;
    let matches = combinations.filter(c => {
      let match = true;
      c.idx.forEach(i => {
        if (idx[i as number] === 0) match = false;
      });
      return match;
    });

    matches.forEach(m => {
      groups[m.name] = groups[m.name] || [];
      groups[m.name].push(item);
    });
    return groups;
  }, {});
  let rr: RenderRow[] = [];

  for (let group in groups) {
    let g = new Group(group, group, level);
    rr.push({ id: g.id.toString(), data: g });
    let subsets = groups[group] as RenderRow[];
    subsets.forEach(subset => {
      g.addSubSet(subset.data as SubSet);
      rr.push({ id: subset.id.toString(), data: subset.data });
    });
  }
  return rr;
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

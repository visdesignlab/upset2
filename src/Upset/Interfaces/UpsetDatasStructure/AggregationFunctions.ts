import { Elements } from './Data';
import { AggregationOptions } from '../AggregationOptions';
import { Subset, Subsets } from './Subset';
import { Groups, createGroup, addSubsetToGroup } from './Group';

export type SetNameDictionary = { [key: number]: string };

export function applyFirstAggregation(
  inputData: Elements,
  aggregateBy: AggregationOptions,
  setNames: SetNameDictionary,
  overlap: number
): Elements {
  let data = [...inputData];

  switch (aggregateBy) {
    case 'Overlaps':
      data = aggregateByOverlaps(data, overlap, setNames);
      break;
    case 'Deviation':
      data = aggregateByDeviation(data);
      break;
    case 'Sets':
      data = aggregateBySets(data, setNames);
      break;
    case 'Degree':
      data = aggregateByDegree(data);
      break;
    default:
      break;
  }

  return data;
}

function aggregateByOverlaps(
  inputData: Elements,
  overlap: number,
  setNames: SetNameDictionary
): Elements {
  let data: Subsets = [...inputData] as any;

  data = data.filter(d => d.noCombinedSets === overlap);

  let combinations = data.map(d => ({
    name: d.elementName,
    idx: d.combinedSets
      .map((v, i) => [i, v === i])
      .filter(v => v[1])
      .map(v => v[0])
  }));

  let groups = data.reduce((groups: any, item) => {
    let idx = item.combinedSets;
    let matches = combinations.filter(c => {
      let match = true;
      c.idx.forEach(i => {
        if (idx[i as number] === 0) {
          match = false;
        }
      });
      return match;
    });

    matches.forEach(m => {
      groups[m.name] = groups[m.name] || [];
      groups[m.name].push(item);
    });

    return groups;
  }, {});

  let groupsArr: Groups = [];

  for (let group in groups) {
    let names = group.split(' ');
    names = names.map(n => n.replace(/ /g, '_'));

    let membership = Object.entries(setNames).map(ent =>
      names.indexOf(ent[1].replace(/ /g, '_')) > -1 ? 1 : 0
    );

    let g = createGroup(group, group, 1, 'Overlaps', membership);

    let subsets: Subsets = groups[group];

    subsets.forEach(subset => {
      g = addSubsetToGroup(g, subset);
    });
    groupsArr.push(g);
  }

  return groupsArr;
}

function aggregateByDeviation(inputData: Elements): Elements {
  let data: Subsets = [...inputData] as any;

  const POS = 'Positive';
  const NEG = 'Negative';

  let groups = data.reduce((groups: any, item) => {
    let val = item.disproportionality;
    if (val >= 0) {
      groups[POS] = groups[POS] || [];
      groups[POS].push(item);
    } else {
      groups[NEG] = groups[NEG] || [];
      groups[NEG].push(item);
    }

    return groups;
  }, {});

  let groupsArr: Groups = [];

  for (let group in groups) {
    let g = createGroup(`${group}_EV`, `${group} Expected Value`, 1, 'Deviation');
    let subsets: Subsets = groups[group];
    subsets.forEach(subset => {
      g = addSubsetToGroup(g, subset);
    });
    groupsArr.push(g);
  }

  return groupsArr;
}

function aggregateBySets(inputData: Elements, setNames: SetNameDictionary): Elements {
  let data: Subsets = [...inputData] as any;

  let groups = data.reduce((groups: any, item) => {
    let val = item.combinedSets;
    let vals: number[] = [];

    val.forEach((d, i) => {
      if (d === 1) {
        vals.push(i);
      }
    });

    vals.forEach(val => {
      groups[setNames[val]] = groups[setNames[val]] || [];
      groups[setNames[val]].push(item);
    });

    return groups;
  }, {});

  let groupsArr: Groups = [];

  for (let group in groups) {
    let membership = Object.entries(setNames).map(ent => (ent[1] === group ? 1 : 0));

    let g = createGroup(`Group_set_${group.replace(' ', '_')}`, `${group}`, 1, 'Sets', membership);
    let subsets: Subsets = groups[group];
    subsets.forEach(subset => {
      g = addSubsetToGroup(g, subset);
    });
    groupsArr.push(g);
  }

  return groupsArr;
}

function aggregateByDegree(inputData: Elements): Elements {
  let data = [...inputData];

  let groups = data.reduce((groups: any, item) => {
    let val = (item as Subset).noCombinedSets;
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});

  const groupsArr: Groups = [];

  for (let group in groups) {
    let g = createGroup(`Group_Deg_${group}`, `Degree ${group}`, 1, 'Degree');
    let subsets = groups[group];
    (subsets as Subsets).forEach(subset => {
      g = addSubsetToGroup(g, subset);
    });
    groupsArr.push(g);
  }
  data = groupsArr;
  return data;
}

import { Elements } from './Data';
import { AggregationOptions } from '../AggregationOptions';
import { Subset, Subsets } from './Subset';
import { Groups, createGroup, addSubsetToGroup, Group, addGroupToGroup } from './Group';
import isSubsetMemberOfGroup from '../../Utils/BitwiseCompare';

export type SetNameDictionary = { [key: number]: string };

export function applyFirstAggregation(
  inputData: Elements,
  aggregateBy: AggregationOptions,
  setNames: SetNameDictionary,
  overlap: number,
  masks: number[][]
): Elements {
  let data = [...inputData];

  switch (aggregateBy) {
    case 'Overlaps':
      data = aggregateByOverlaps(data, overlap, setNames, masks);
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

export function applySecondAggregation(
  inputData: Elements,
  aggregateBy: AggregationOptions,
  setNames: SetNameDictionary,
  overlap: number,
  masks: number[][]
): Elements {
  let data = [...inputData];

  switch (aggregateBy) {
    case 'Sets':
      data.forEach((group, idx) => {
        const subsets = (group as Group).subsets;
        const subGroups = aggregateBySets(subsets, setNames, 2);
        (subGroups as Groups).forEach(sub => {
          group = addGroupToGroup(group as Group, sub);
        });

        data[idx] = group;
      });
      break;
    default:
      break;
  }

  return data;
}

function aggregateByOverlaps(
  inputData: Elements,
  overlap: number,
  setNames: SetNameDictionary,
  masks: number[][]
): Elements {
  let data: Subsets = [...inputData] as any;

  data = data.filter(d => d.noCombinedSets >= overlap);

  const maskBits = masks.map(m => {
    return {
      name: m
        .map((a, i) => [i, a])
        .filter(a => a[1])
        .map(a => a[0])
        .map(a => setNames[a])
        .join(' '),
      bitmask: m
    };
  });

  let groups = data.reduce((groups: any, item) => {
    let idx = item.combinedSets;

    const matchedGroups = maskBits.filter(mb => isSubsetMemberOfGroup(idx, mb.bitmask));

    matchedGroups.forEach(mg => {
      const { name } = mg;

      groups[name] = groups[name] || [];
      groups[name].push(item);
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

function aggregateBySets(
  inputData: Elements,
  setNames: SetNameDictionary,
  level: number = 1
): Elements {
  let data: Subsets = [...inputData] as any;

  const NOSET = 'No Set';

  let groups = data.reduce((groups: any, item) => {
    let val = item.combinedSets;
    let vals: number[] = [];

    val.forEach((d, i) => {
      if (d === 1) {
        vals.push(i);
      }
    });

    if (vals.length !== 0) {
      vals.forEach(val => {
        groups[setNames[val]] = groups[setNames[val]] || [];
        groups[setNames[val]].push(item);
      });
    } else {
      groups[NOSET] = groups[NOSET] || [];
      groups[NOSET].push(item);
    }

    return groups;
  }, {});

  let groupsArr: Groups = [];

  for (let group in groups) {
    let membership = Object.entries(setNames).map(ent => (ent[1] === group ? 1 : 0));

    let g = createGroup(
      `Group_set_${group.replace(' ', '_')}`,
      `${group}`,
      level,
      'Sets',
      membership
    );
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

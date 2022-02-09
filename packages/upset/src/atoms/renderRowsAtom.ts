import {
  Rows,
  areRowsAggregates,
  firstAggregation,
  secondAggregation,
  sortRows,
  filterRows,
  isRowAggregate,
  Row,
} from '@visdesignlab/upset2-core';
import { selector } from 'recoil';
import { dimensionsSelector } from './dimensionsAtom';
import { setsAtom } from './setsAtoms';
import { subsetSelector } from './subsetAtoms';
import {
  firstAggregateByAtom,
  firstOverlapDegreeAtom,
  hideEmptyAtom,
  maxVisibleAtom,
  minVisibleAtom,
  secondAggregateByAtom,
  secondOverlapDegreeAtom,
  sortByAtom,
} from './upsetConfigAtoms';

const firstAggRRSelector = selector<Rows>({
  key: 'farr',
  get: ({ get }) => {
    const aggBy = get(firstAggregateByAtom);
    const overlapDegree = get(firstOverlapDegreeAtom);
    const sets = get(setsAtom);
    const subsets = get(subsetSelector);

    return firstAggregation(subsets, aggBy, overlapDegree, sets);
  },
});

const secondAggRRSelector = selector<Rows>({
  key: 'sarr',
  get: ({ get }) => {
    const aggBy = get(secondAggregateByAtom);
    const overlapDegree = get(secondOverlapDegreeAtom);
    const sets = get(setsAtom);
    const rr = get(firstAggRRSelector);

    if (areRowsAggregates(rr)) {
      return secondAggregation(rr, aggBy, overlapDegree, sets);
    }

    return rr;
  },
});

const sortByRRSelector = selector<Rows>({
  key: 'sortRR',
  get: ({ get }) => {
    const sortBy = get(sortByAtom);
    const rr = get(secondAggRRSelector);

    return sortRows(rr, sortBy);
  },
});

const filterRRSelector = selector<Rows>({
  key: 'filterRR',
  get: ({ get }) => {
    const maxVisible = get(maxVisibleAtom);
    const minVisible = get(minVisibleAtom);
    const hideEmpty = get(hideEmptyAtom);
    const rr = get(sortByRRSelector);

    return filterRows(rr, { maxVisible, minVisible, hideEmpty });
  },
});

export type RowConfig = {
  position: number;
  collapsed: boolean;
};

export type RowConfigMap = { [key: string]: RowConfig };

export const rowsSelector = selector<Rows>({
  key: 'rows',
  get: ({ get }) => get(filterRRSelector),
});

export type RenderRow = {
  id: string;
  row: Row;
};

function flattenRows(
  rows: Rows,
  flattenedRows: RenderRow[] = [],
  idPrefix: string = '',
): RenderRow[] {
  rows.order.forEach((rowId) => {
    const row = rows.values[rowId];
    idPrefix += row.id;
    flattenedRows.push({
      id: idPrefix,
      row,
    });
    if (isRowAggregate(row)) {
      flattenRows(row.items, flattenedRows, idPrefix);
    }
  });

  return flattenedRows;
}

export const flattenedRowsSelector = selector<RenderRow[]>({
  key: 'flattenedRows',
  get: ({ get }) => {
    const rows = get(rowsSelector);
    return flattenRows(rows);
  },
});

export const rowsCountSelector = selector({
  key: 'rrCount',
  get: ({ get }) => {
    const rr = get(flattenedRowsSelector);
    return rr.length;
  },
});

export const rowConfigSelector = selector<RowConfigMap>({
  key: 'rowConfig',
  get: ({ get }) => {
    const flattenedRows = get(flattenedRowsSelector);
    const dimensions = get(dimensionsSelector);

    const configMap: RowConfigMap = {};

    flattenedRows.forEach((row, idx) => {
      const config: RowConfig = {
        position: idx * dimensions.body.rowHeight,
        collapsed: false,
      };

      configMap[row.id] = config;
    });

    return configMap;
  },
});

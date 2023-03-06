import {
  areRowsAggregates,
  filterRows,
  firstAggregation,
  isRowAggregate,
  Row,
  Rows,
  secondAggregation,
  sortRows,
} from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { attributeAtom } from './attributeAtom';
import {
  firstAggregateSelector,
  firstOvelapDegreeSelector,
  secondAggregateSelector,
  secondOverlapDegreeSelector,
} from './config/aggregateAtoms';
import { hideEmptySelector, maxVisibleSelector, minVisibleSelector } from './config/filterAtoms';
import { sortBySelector } from './config/sortByAtom';
import { dimensionsSelector } from './dimensionsAtom';
import { itemsAtom } from './itemsAtoms';
import { setsAtom } from './setsAtoms';
import { subsetSelector } from './subsetAtoms';

const firstAggRRSelector = selector<Rows>({
  key: 'first-aggregate-render-row',
  get: ({ get }) => {
    const aggBy = get(firstAggregateSelector);
    const overlapDegree = get(firstOvelapDegreeSelector);
    const sets = get(setsAtom);
    const subsets = get(subsetSelector);
    const items = get(itemsAtom);
    const attributeColumns = get(attributeAtom);

    return firstAggregation(
      subsets,
      aggBy,
      overlapDegree,
      sets,
      items,
      attributeColumns,
    );
  },
});

const secondAggRRSelector = selector<Rows>({
  key: 'second-aggregate-render-row',
  get: ({ get }) => {
    const aggBy = get(secondAggregateSelector);
    const overlapDegree = get(secondOverlapDegreeSelector);
    const sets = get(setsAtom);
    const rr = get(firstAggRRSelector);
    const items = get(itemsAtom);
    const attributeColumns = get(attributeAtom);

    if (areRowsAggregates(rr)) {
      const secondAgg =  secondAggregation(
        rr,
        aggBy,
        overlapDegree,
        sets,
        items,
        attributeColumns,
      );

      return secondAgg
    }
    return rr;
  },
});

const sortByRRSelector = selector<Rows>({
  key: 'sort-render-row',
  get: ({ get }) => {
    const sortBy = get(sortBySelector);
    const rr = get(secondAggRRSelector);

    return sortRows(rr, sortBy);
  },
});

const filterRRSelector = selector<Rows>({
  key: 'filter-render-row',
  get: ({ get }) => {
    const maxVisible = get(maxVisibleSelector);
    const minVisible = get(minVisibleSelector);
    const hideEmpty = get(hideEmptySelector);
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
  key: 'flattened-rows',
  get: ({ get }) => {
    const rows = get(rowsSelector);

    return flattenRows(rows);
  },
});

export const flattenedOnlyRows = selector({
  key: 'only-rows',
  get: ({ get }) => {
    const rows = get(flattenedRowsSelector);
    const onlyRows: { [key: string]: Row } = {};

    rows.forEach(({ row }) => {
      onlyRows[row.id] = row;
    });

    return onlyRows;
  },
});

export const rowsCountSelector = selector({
  key: 'render-row-count',
  get: ({ get }) => {
    const rr = get(flattenedRowsSelector);
    return rr.length;
  },
});

export const rowConfigSelector = selector<RowConfigMap>({
  key: 'row-config',
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

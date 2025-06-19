import { firstAggregation, secondAggregation } from './aggregate';
import { filterRows } from './filter';
import { getSubsets } from './process';
import { sortRows } from './sort';
import {
  areRowsAggregates,
  getBelongingSetsFromSetMembership,
  isPopulatedSetQuery,
  isRowAggregate,
} from './typeutils';
import { CoreUpsetData, Row, Rows, SetQueryMembership, Sets, UpsetConfig } from './types';

/**
 * Maps Row IDs to Row objects
 */
export type RowMap = Record<string, Row>;

/**
 * Represents a row to be rendered.
 *
 * @typedef {Object} RenderRow
 * @property {string} id - The unique identifier for the row.
 * @property {Row} row - The row data to be rendered.
 */
export type RenderRow = {
  id: string;
  row: Row;
};

/**
 * Flattens a hierarchical structure of rows into a flat array of RenderRow objects.
 *
 * @param rows - The hierarchical structure of rows to flatten.
 * @param flattenedRows - The array to store the flattened rows (optional, defaults to an empty array).
 * @param idPrefix - The prefix to add to the IDs of the flattened rows (optional, defaults to an empty string).
 * @returns The flattened array of RenderRow objects.
 */
export const flattenRows = (
  rows: Rows,
  flattenedRows: RenderRow[] = [],
  idPrefix = '',
): RenderRow[] => {
  rows.order.forEach((rowId) => {
    const row = rows.values[rowId];
    const prefix = idPrefix + row.id;
    flattenedRows.push({
      id: prefix,
      row,
    });
    if (isRowAggregate(row)) {
      flattenRows(row.rows, flattenedRows, prefix);
    }
  });

  return flattenedRows;
};

/**
 * Calculates the first aggregation for the given data and state.
 * @param data - The data object containing items, sets, and attribute columns.
 * @param state - The UpsetConfig object containing the configuration state.
 * @returns The result of the first aggregation.
 */
const firstAggRR = (data: CoreUpsetData, state: UpsetConfig) => {
  const subsets = getSubsets(
    data.items,
    data.sets,
    state.visibleSets,
    data.attributeColumns,
  );
  return firstAggregation(
    subsets,
    state.firstAggregateBy,
    state.firstOverlapDegree,
    data.sets,
    data.items,
    data.attributeColumns,
  );
};

/**
 * Calculates the second-level aggregation for the given data and state.
 * If the first-level aggregation result is already an aggregate, it performs the second-level aggregation.
 * Otherwise, it returns the first-level aggregation result as is.
 *
 * @param data - The data to be aggregated.
 * @param state - The configuration state for the aggregation.
 * @returns The second-level aggregation result.
 */
const secondAggRR = (data: CoreUpsetData, state: UpsetConfig) => {
  const renderRows = firstAggRR(data, state);

  if (areRowsAggregates(renderRows)) {
    const secondAgg = secondAggregation(
      renderRows,
      state.secondAggregateBy,
      state.secondOverlapDegree,
      data.sets,
      data.items,
      data.attributeColumns,
    );

    return secondAgg;
  }

  return renderRows;
};

/**
 * Filters and returns rows based on the specified set membership query.
 *
 * @param rows - The rows to be filtered.
 * @param membership - An object representing the set membership query. The keys are set names and the values are 'Yes' or 'No' indicating whether the row should belong to the set or not.
 * @returns The filtered rows that match the set membership query.
 */
export function getQueryResult(rows: Rows, membership: SetQueryMembership): Rows {
  const queryResults: Rows = { order: [], values: {} };
  flattenRows(rows).forEach((renderRow) => {
    let match = true;
    Object.entries(membership).forEach(([set, status]) => {
      if (
        status === 'Yes' &&
        !getBelongingSetsFromSetMembership(renderRow.row.setMembership).includes(set)
      ) {
        match = false;
      }
      if (
        status === 'No' &&
        getBelongingSetsFromSetMembership(renderRow.row.setMembership).includes(set)
      ) {
        match = false;
      }
    });

    if (match) {
      queryResults.order.push(renderRow.id);
      queryResults.values[renderRow.id] = renderRow.row;
    }
  });

  return queryResults;
}

/**
 * Sorts the data by RR (Relative Risk) based on the provided state configuration.
 *
 * @param data - The data to be sorted.
 * @param state - The state configuration containing the visible sets and sorting options.
 * @param ignoreQuery - Whether to ignore the query when sorting the data. Set this to true to get the sorted rows as if there was no query.
 * @returns The sorted rows based on the RR and the provided sorting options.
 */
const sortByRR = (data: CoreUpsetData, state: UpsetConfig, ignoreQuery = false) => {
  if (!data || typeof data !== 'object' || !Object.hasOwn(data, 'sets'))
    return { order: [], values: {} };

  const vSets: Sets = Object.fromEntries(
    Object.entries(data.sets).filter(([name]) => state.visibleSets.includes(name)),
  );

  let renderRows: Rows;

  if (!ignoreQuery && state.setQuery !== null && isPopulatedSetQuery(state.setQuery)) {
    const subsets: Rows = getSubsets(
      data.items,
      data.sets,
      state.visibleSets,
      data.attributeColumns,
    );
    renderRows = getQueryResult(subsets, state.setQuery.query);
  } else {
    renderRows = secondAggRR(data, state);
  }

  return sortRows(
    renderRows,
    state.sortBy,
    state.sortVisibleBy,
    vSets,
    state.sortByOrder,
  );
};

/**
 * Filters the data based on the provided state using the RR (Relative Ranking) algorithm.
 *
 * @param data - The data to be filtered.
 * @param state - The state object containing the Upset configuration.
 * @param ignoreQuery - Whether to ignore the query when filtering the data. Set this to true to get the filtered rows as if there was no query.
 * @returns The filtered rows based on the RR algorithm and the provided filters.
 */
const filterRR = (data: CoreUpsetData, state: UpsetConfig, ignoreQuery = false) => {
  const renderRows = sortByRR(data, state, ignoreQuery);

  return filterRows(renderRows, state.filters);
};

/**
 * Retrieves the rows of data based on the provided data and state.
 * @param data - The data to filter.
 * @param state - The state of the UpsetConfig.
 * @param ignoreQuery - Whether to ignore the query when filtering the data. Set this to true to get the filtered rows as if there was no query.
 * @returns The filtered rows of data.
 */
export const getRows = (data: CoreUpsetData, state: UpsetConfig, ignoreQuery = false) =>
  filterRR(data, state, ignoreQuery);

/**
 * Flattens the rows of data based on the provided state configuration.
 *
 * @param data - The data to be flattened.
 * @param state - The state configuration for flattening the data.
 * @returns The flattened rows of data.
 */
export const flattenedRows = (data: CoreUpsetData, state: UpsetConfig) => {
  const rows = getRows(data, state);

  return flattenRows(rows);
};

/**
 * Returns an object containing only the rows from the flattened data.
 * Each row is keyed by its ID.
 *
 * @param data - The data to flatten.
 * @param state - The UpsetConfig state.
 * @returns An object containing only the rows.
 */
export function flattenedOnlyRows(data: CoreUpsetData, state: UpsetConfig): RowMap {
  const rows = flattenedRows(data, state);
  const onlyRows: { [key: string]: Row } = {};

  rows.forEach(({ row }) => {
    onlyRows[row.id] = row;
  });

  return onlyRows;
}

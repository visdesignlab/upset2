import {
  Aggregate,
  Aggregates,
  QuerySelection,
  VegaSelection,
  Row,
  Rows,
  SetMembershipStatus,
  SetQuery,
  Subset,
  Subsets,
} from './types';

/**
 * Converts an element selection to a bookmark.
 * Generates the ID by hashing the selection and labels the bookmark with the selection parameters.
 * Truncates keys to 16 characters and values to 2 sig figs.
 * @param selection The numerical attribute query.
 * @returns The element selection.
 */
export function vegaSelectionToString(selection: VegaSelection): string {
  let label = 'Atts: ';
  Object.entries(selection).forEach(([k, v]) => {
    // Ternary/toPrecision sets 2 sig fig bound on small numbers
    let min: string | number =
      v[0] < 100 ? parseFloat(v[0].toPrecision(2)) : Math.round(v[0]);
    let max: string | number =
      v[1] < 100 ? parseFloat(v[1].toPrecision(2)) : Math.round(v[1]);
    // Convert numbers with lots of 0s to exponential notation with 2 sig figs
    if (min >= 10000 || min <= 0.0009) min = min.toPrecision(2);
    if (max >= 10000 || max <= 0.0009) max = max.toPrecision(2);
    // Truncate names
    if (k.length > 16) {
      k = k.slice(0, 13);
      k += '...';
    }
    if (label !== 'Atts: ') label += ', ';
    label += `${k}: [${min} to ${max}]`;
  });

  return label;
}

/**
 * Converts an element selection to a bookmark.
 * Generates the ID by hashing the selection and labels the bookmark with the selection parameters.
 * @param selection The element query.
 * @returns The element selection.
 */
export function querySelectionToString(selection: QuerySelection): string {
  return `${selection.att} ${selection.type} ${selection.query}`;
}

/**
 * Checks if the given rows are aggregates.
 * @param rr The rows to check.
 * @param allowEmpty Whether to allow an object devoid of rows (default: false).
 * @returns `true` if the rows are aggregates, `false` otherwise.
 */
export function areRowsAggregates(rr: Rows, allowEmpty = false): rr is Aggregates {
  if (!allowEmpty && rr.order.length === 0) return false;
  return rr.order.map((id) => rr.values[id].type).every((type) => type === 'Aggregate');
}

/**
 * Checks if the given rows are subsets.
 * @param rr - The rows to check.
 * @param allowEmpty - Whether to allow an object devoid of rows (default: false).
 * @returns True if the rows are subsets, false otherwise.
 */
export function areRowsSubsets(rr: Rows, allowEmpty = false): rr is Subsets {
  if (!allowEmpty && rr.order.length === 0) return false;
  return rr.order.map((id) => rr.values[id].type).every((type) => type === 'Subset');
}

/**
 * Checks if a given row is an aggregate.
 * @param row - The row to check.
 * @returns True if the row is an aggregate, false otherwise.
 */
export function isRowAggregate(row: Row): row is Aggregate {
  return row.type === 'Aggregate';
}

/**
 * Checks if a given row is a subset.
 * @param row - The row to check.
 * @returns True if the row is a subset, false otherwise.
 */
export function isRowSubset(row: Row): row is Subset {
  return row.type === 'Subset';
}

/**
 * Checks if two element selections are equal
 * {} is considered == to undefined
 * @param a The first element selection
 * @param b The second element selection
 * @param {number} decimalPlaces The number of decimal places to use when comparing equality of numbers, default 4
 * @returns Whether a and b are equal
 */
export function vegaSelectionsEqual(
  a: VegaSelection | undefined,
  b: VegaSelection | undefined,
  decimalPlaces: number = 4,
): boolean {
  // We want undefined == {}
  if (!a || Object.keys(a).length === 0) {
    return !b || Object.keys(b).length === 0;
  }
  if (!a || !b) return false;

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;

  const round = 10 ** decimalPlaces;
  function prep(num: number): number {
    return Math.round(num * round);
  }

  return keys.every(
    (key) =>
      Object.hasOwn(b, key) &&
      prep(a[key][0]) === prep(b[key][0]) &&
      prep(a[key][1]) === prep(b[key][1]),
  );
}

/**
 * Calculates the degree of set membership based on the provided membership object.
 * The degree of set membership is the number of sets in which the subset is comprised of.
 *
 * @param membership - The membership object containing the set membership statuses.
 * @returns The degree of set membership.
 */
export function getDegreeFromSetMembership(membership: {
  [key: string]: SetMembershipStatus;
}): number {
  if (Object.values(membership).length === 0) return -1;
  return Object.values(membership).filter((m) => m === 'Yes').length;
}

/**
 * Retrieves the belonging sets from a set membership object.
 * @param membership - The set membership object.
 * @returns An array of strings representing the belonging sets.
 */
export function getBelongingSetsFromSetMembership(membership: {
  [key: string]: SetMembershipStatus;
}): string[] {
  return Object.entries(membership)
    .filter((mem) => mem[1] === 'Yes')
    .map((mem) => mem[0]);
}

/**
 * Checks if the given SetQuery is populated.
 *
 * @param query - The SetQuery object to check, or null.
 * @returns True if the query is not null and contains at least one query value, otherwise false.
 */
export function isPopulatedSetQuery(query: SetQuery | null) {
  return query !== null && Object.values(query.query).length > 0;
}

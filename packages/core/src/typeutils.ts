import {
  Aggregate,
  Aggregates, Bookmark, BookmarkedIntersection, BookmarkedSelection, ElementSelection, Row, Rows, SetMembershipStatus, Subset, Subsets,
} from './types';
import { hashString } from './utils';

/**
 * Checks if the given rows are aggregates.
 * @param rr The rows to check.
 * @returns `true` if the rows are aggregates, `false` otherwise.
 */
export function areRowsAggregates(rr: Rows): rr is Aggregates {
  const { order } = rr;

  if (order.length === 0) return false;

  const row = rr.values[order[0]];

  return row.type === 'Aggregate';
}

/**
 * Checks if the given rows are subsets.
 * @param rr - The rows to check.
 * @returns True if the rows are subsets, false otherwise.
 */
export function areRowsSubsets(rr: Rows): rr is Subsets {
  const { order } = rr;

  if (order.length === 0) return false;

  const row = rr.values[order[0]];

  return row.type === 'Subset';
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
 * Checks if a bookmark is a BookmarkedIntersection.
 * @param b - The bookmark to check.
 * @returns True if the bookmark is a BookmarkedIntersection, false otherwise.
 */
export function isBookmarkedIntersection(b: Bookmark): b is BookmarkedIntersection {
  return b.type === 'intersection';
}

/**
 * Checks if two element selections are equal
 * {} is considered == to undefined
 * @param a The first element selection
 * @param b The second element selection
 * @param {number} decimalPlaces The number of decimal places to use when comparing equality of numbers, default 4
 * @returns Whether a and b are equal
 */
export function elementSelectionsEqual(a: ElementSelection | undefined, b: ElementSelection | undefined, decimalPlaces = 4): boolean {
  // We want undefined == {}
  if (!a || Object.keys(a).length === 0) {
    return (!b || Object.keys(b).length === 0);
  }
  if (!a || !b) return false;

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;

  const round = 10 ** decimalPlaces;
  function prep(num: number): number {
    return Math.round(num * round);
  }

  return keys.every(
    (key) => Object.hasOwn(b, key)
      && prep(a[key][0]) === prep(b[key][0])
      && prep(a[key][1]) === prep(b[key][1]),
  );
}

/**
 * Converts an element selection to a bookmark.
 * Generates the ID by hashing the selection and labels the bookmark with the selection parameters.
 * Truncates keys to 16 characters and values to 2 sig figs.
 * @param selection The numerical attribute query.
 * @returns The element selection.
 */
export function elementSelectionToBookmark(selection: ElementSelection): BookmarkedSelection {
  // Normalizing prevents floating point error from causing different hashes
  const norm = (i : number) => Math.abs(Math.round(i * 10000));

  let i = 1;
  Object.entries(selection).forEach(([key, value]) => {
    i *= norm(hashString(key)) * norm(value[0]) * norm(value[1]);
  });
  i = norm(i);

  let label = 'Atts: ';
  Object.entries(selection).forEach(([k, v]) => {
    // Ternary/toPrecision sets 2 sig fig bound on small numbers
    let min: string | number = v[0] < 100 ? parseFloat(v[0].toPrecision(2)) : Math.round(v[0]);
    let max: string | number = v[1] < 100 ? parseFloat(v[1].toPrecision(2)) : Math.round(v[1]);
    // Convert numbers with lots of 0s to exponential notation with 2 sig figs
    if (min >= 10000 || min <= 0.0009) min = min.toPrecision(2);
    if (max >= 10000 || max <= 0.0009) max = max.toPrecision(2);
    // Truncate names
    if (k.length > 16) { k = k.slice(0, 13); k += '...'; }
    if (label !== 'Atts: ') label += ', ';
    label += `${k}: [${min} to ${max}]`;
  });

  return {
    id: i.toString(),
    label,
    type: 'elements',
    selection,
  };
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
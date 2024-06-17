import { Bookmark, NumericalAttQuery } from './types';

/**
 * Validates that the given value is an ElementSelection.
 * @param value The value to check.
 * @returns whether the value is an ElementSelection.
 */
export function isNumericalAttQuery(value: unknown): value is NumericalAttQuery {
  return (
    !!value
    && typeof value === 'object'
    && Object.values(value).every((v) => Array.isArray(v)
          && v.length === 2
          && typeof v[0] === 'number'
          && typeof v[1] === 'number')
  );
}

function hashString(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
  }
  return hash;
}

/**
 * Converts a numerical attribute query to an element selection.
 * Generates the ID by hashing the query and labels the selection with the query attributes.
 * @param query The numerical attribute query.
 * @returns The element selection.
 */
export function numAttsToBookmark(query: NumericalAttQuery): Bookmark {
  // hash the query to get a unique id
  let i = 1;
  for (const [key, value] of Object.entries(query)) {
    i *= hashString(key) * value[0] * value[1];
  }
  i = Math.round(Math.abs(i * 1e9));
  return {
    id: i.toString(),
    label: `Atts: ${Object.keys(query).join(', ')}`,
    type: 'element',
    selection: query,
  };
}

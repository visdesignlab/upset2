import { isNumericalBookmark, isElementBookmark } from './typecheck';
import { ElementSelection, Item, ElementQueryType } from './types';

/**
 * Version safe deep copy using structured cloning.
 * Create a deep copy (with all fields recursively copied) of an object using structured cloning;
 * if structured cloning fails, falls back to JSON serialization.
 * @param obj the object to copy
 * @returns a deep copy of the object
 */
export function deepCopy<T extends object>(obj: T): T {
  try {
    return structuredClone<T>(obj);
  } catch {
    return JSON.parse(JSON.stringify(obj));
  }
}

/**
 * Hash a string to a number
 * @param str the string to hash
 * @returns the hash of the string
 */
export function hashString(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
  }
  return hash;
}

/**
 * Filter items based on a selection
 * @param items Items to filter
 * @param filter Selection to filter by
 * @returns Filtered items
 */
export function filterItems(items: Item[], filter: ElementSelection): Item[] {
  const result: Item[] = [];
  if (isNumericalBookmark(filter)) {
    return items.filter(
      (item) => Object.entries(filter.selection).every(
        ([key, value]) => typeof item[key] === 'number'
              && item[key] as number >= value[0]
              && item[key] as number <= value[1],
      ),
    );
  } if (isElementBookmark(filter)) {
    const { att } = filter.selection;
    const { query } = filter.selection;

    return items.filter((item) => {
      if (!Object.prototype.hasOwnProperty.call(item, att)) return false;

      switch (filter.selection.type) {
        case ElementQueryType.CONTAINS:
          return (`${item[att]}`).includes(query);
        case ElementQueryType.EQUALS:
          return (`${item[att]}` === query);
        case ElementQueryType.LENGTH:
          return ((`${item[att]}`).length === Number(query));
        case ElementQueryType.REGEX:
          return (new RegExp(query).test(`${item[att]}`));
        case ElementQueryType.GREATER_THAN:
          return `${item[att]}`.localeCompare(query, undefined, { numeric: typeof item[att] === 'number' }) > 0;
        case ElementQueryType.LESS_THAN:
          return `${item[att]}`.localeCompare(query, undefined, { numeric: typeof item[att] === 'number' }) < 0;
        default:
      }
      return false;
    });
  }
  return result;
}

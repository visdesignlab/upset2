import {
  Item, ElementQueryType, Plot,
  FilteredItems,
  VegaSelection,
  QuerySelection,
} from './types';

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
 * Filters items based on a Vega selection
 * This function checks if each item in the items array falls within the specified range for each attribute in the filter.
 * If an item meets all the criteria, it is included in the 'included' array; otherwise, it is added to the 'excluded' array.
 * @param items Items to filter
 * @param filter Vega selection to filter by
 * @returns Filtered items, with 'included' and 'excluded' arrays
 */
export function filterByVega(items: Item[], filter: VegaSelection): FilteredItems {
  const included: Item[] = [];
  const excluded: Item[] = [];
  items.forEach(
    (item) => {
      if (Object.entries(filter).every(
        ([key, value]) => typeof item[key] === 'number'
            && item[key] as number >= value[0]
            && item[key] as number <= value[1],
      )) included.push(item);
      else excluded.push(item);
    },
  );
  return { included, excluded };
}

/**
 * Filters items based on a query selection
 * This function checks if each item in the items array matches the specified query for the given attribute.
 * Depending on the query type (e.g., contains, equals, regex), it determines if the item should be included or excluded.
 * @param items Items to filter
 * @param filter Query selection to filter by
 * @returns Filtered items, with 'included' and 'excluded' arrays
 */
export function filterByQuery(items: Item[], filter: QuerySelection): FilteredItems {
  const included: Item[] = [];
  const excluded: Item[] = [];

  const { att, query, type } = filter;

  items.forEach((item) => {
    let add = false;
    if (Object.hasOwn(item, att)) {
      switch (type) {
        case ElementQueryType.CONTAINS:
          add = (`${item[att]}`).includes(query);
          break;
        case ElementQueryType.EQUALS:
          add = (`${item[att]}` === query);
          break;
        case ElementQueryType.LENGTH:
          add = ((`${item[att]}`).length === Number(query));
          break;
        case ElementQueryType.REGEX:
          add = (new RegExp(query).test(`${item[att]}`));
          break;
        case ElementQueryType.GREATER_THAN:
          add = `${item[att]}`.localeCompare(query, undefined, { numeric: typeof item[att] === 'number' }) > 0;
          break;
        case ElementQueryType.LESS_THAN:
          add = `${item[att]}`.localeCompare(query, undefined, { numeric: typeof item[att] === 'number' }) < 0;
          break;
        default:
      }
    }
    if (add) included.push(item);
    else excluded.push(item);
  });
  return { included, excluded };
}

/**
 * Converts a plot to a displable string
 * @param plot Plot to convert.
 * @returns Display string with type & axis of plot
 */
export function plotToString(plot: Plot): string {
  switch (plot.type) {
    case 'Scatterplot': return `Scatterplot: ${plot.x} by ${plot.y}`;
    case 'Histogram': return `Histogram: ${plot.attribute}`;
    default: throw Error(`Cannot convert plot ${plot} to string`);
  }
}

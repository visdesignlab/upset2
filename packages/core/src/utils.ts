import {
  Item,
  ElementQueryType,
  Plot,
  FilteredItems,
  VegaSelection,
  QuerySelection,
} from './types';

const YEAR_ONLY_REGEX = /^\d{4}$/;
const ISO_LIKE_DATE_REGEX =
  /^\d{4}(?:-\d{2}(?:-\d{2})?)?(?:[T\s]\d{2}(?::\d{2}(?::\d{2}(?:\.\d{1,3})?)?)?(?:\s?(?:Z|[+-]\d{2}:?\d{2}))?)?$/;

/**
 * Converts a numeric or Date value into a number, if possible.
 * @param value Value to convert
 * @returns Numeric representation of the value, or undefined if not numeric
 */
export function getNumericValue(value: unknown): number | undefined {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (value instanceof Date) {
    const timestamp = value.getTime();
    if (!Number.isNaN(timestamp)) return timestamp;
  }
  return undefined;
}

/**
 * Parses supported date values into native Date objects.
 * Supports Date instances, 4-digit years, ISO-like date strings, and
 * native JS-parsable textual dates. Ambiguous numeric formats (for example
 * 01/02/2024) are intentionally rejected.
 * @param value Value to parse
 * @returns Parsed date, or undefined if the value is not in a supported format
 */
export function parseDateValue(value: unknown): Date | undefined {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value;

  if (typeof value === 'number' && Number.isFinite(value)) {
    if (Number.isInteger(value) && value >= 0 && value <= 9999) {
      return new Date(Date.UTC(value, 0, 1));
    }

    const parsedNumberDate = new Date(value);
    return Number.isNaN(parsedNumberDate.getTime()) ? undefined : parsedNumberDate;
  }

  if (typeof value !== 'string') return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (YEAR_ONLY_REGEX.test(trimmed)) {
    return new Date(Date.UTC(parseInt(trimmed, 10), 0, 1));
  }

  if (!ISO_LIKE_DATE_REGEX.test(trimmed) && !/[A-Za-z]/.test(trimmed)) {
    return undefined;
  }

  const normalized = ISO_LIKE_DATE_REGEX.test(trimmed)
    ? trimmed.replace(/^(\d{4}-\d{2}-\d{2})\s/, '$1T')
    : trimmed;
  const parsed = new Date(normalized);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

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
    hash = (hash << 5) - hash + char;
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
  items.forEach((item) => {
    if (
      Object.entries(filter).every(
        ([key, value]) => {
          const itemValue = getNumericValue(item.atts[key]);
          return itemValue !== undefined && itemValue >= value[0] && itemValue <= value[1];
        },
      )
    )
      included.push(item);
    else excluded.push(item);
  });
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
    if (Object.hasOwn(item.atts, att)) {
      switch (type) {
        case ElementQueryType.CONTAINS:
          add = `${item.atts[att]}`.includes(query);
          break;
        case ElementQueryType.EQUALS:
          switch (typeof item.atts[att]) {
            case 'number':
              add = Math.abs((item.atts[att] as number) - Number(query)) < 0.0001;
              break;
            case 'string':
              add = `${item.atts[att]}` === query;
              break;
            default:
              add = `${item.atts[att]}` === query;
          }
          break;
        case ElementQueryType.LENGTH:
          add = `${item.atts[att]}`.length === Number(query);
          break;
        case ElementQueryType.REGEX:
          add = new RegExp(query).test(`${item.atts[att]}`);
          break;
        case ElementQueryType.GREATER_THAN:
          switch (typeof item.atts[att]) {
            case 'number':
              add = Number(item.atts[att]) > Number(query);
              break;
            case 'string':
              add =
                `${item.atts[att]}`.localeCompare(query, undefined, {
                  numeric: typeof item.atts[att] === 'number',
                }) > 0;
              break;
            default:
              add = `${item.atts[att]}` < `${query}`;
          }
          break;
        case ElementQueryType.LESS_THAN:
          switch (typeof item.atts[att]) {
            case 'number':
              add = Number(item.atts[att]) < Number(query);
              break;
            case 'string':
              add =
                `${item.atts[att]}`.localeCompare(query, undefined, {
                  numeric: typeof item.atts[att] === 'number',
                }) < 0;
              break;
            default:
              add = `${item.atts[att]}` > `${query}`;
          }
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
    case 'Scatterplot':
      return `Scatterplot: ${plot.x} by ${plot.y}`;
    case 'Histogram':
      return `Histogram: ${plot.attribute}`;
    default:
      throw Error(`Cannot convert plot ${plot} to string`);
  }
}

import {
  Aggregate,
  Item,
  Row,
  flattenedOnlyRows,
  getItems,
  FilteredItems,
  filterByVega,
  filterByQuery,
  SelectionType,
  isRowAggregate,
} from '@visdesignlab/upset2-core';
import { selector, selectorFamily } from 'recoil';
import {
  bookmarkColorSelector,
  bookmarkSelector,
  currentIntersectionSelector,
  currentQuerySelection,
  currentSelectionType,
  currentVegaSelection,
} from './config/selectionAtoms';
import { itemsAtom } from './itemsAtoms';
import { dataAtom } from './dataAtom';
import { upsetConfigAtom } from './config/upsetConfigAtoms';
import { rowsSelector } from './renderRowsAtom';
import { DEFAULT_ELEMENT_COLOR } from '../utils/styles';
import { VegaItem } from '../types';
import { itemToVega } from '../typeutils';

/**
 * Gets all items in the row/intersection represented by the provided ID.
 * Items from this selector should NOT be used in vega specs;
 * they do not have the necessary properties for coloring and selection.
 * @param id - The ID of the row to get items for.
 * @returns The items in the row
 */
export const rowItemsSelector = selectorFamily<Item[], string | null | undefined>({
  key: 'row-items',
  get:
    (id: string | null | undefined) =>
    ({ get }) => {
      if (!id) return [];

      const items = get(itemsAtom);
      const intersections = get(rowsSelector);
      const row = intersections[id];

      if (!row) return [];

      return getItems(row).map((el) => items[el]);
    },
});

/**
 * Gets all of the items in visible rows, processed into VegaItems for use in Vega plots in the element view.
 * All items are given color, isCurrentSelected, isCurrent, and bookmarked properties.
 * Only bookmarked items are given the subset and subsetName properties.
 */
export const vegaItemsSelector = selector<VegaItem[]>({
  key: 'processed-items',
  get: ({ get }) => {
    const rows = get(rowsSelector);
    const bookmarkedIDs = get(bookmarkSelector).map((b) => b.id);
    const currentIntersection = get(currentIntersectionSelector);
    const selectionType = get(currentSelectionType);
    // A wild assignment, but the array returned by Recoil is readonly and we need to add to it
    const result: VegaItem[] = [];

    Object.values(rows).forEach((row) => {
      const items = get(rowItemsSelector(row.id));
      result.push(
        ...items.map((item) =>
          itemToVega(
            item,
            currentIntersection,
            selectionType,
            DEFAULT_ELEMENT_COLOR,
            (bookmarkedIDs.includes(row.id) || row.id === currentIntersection?.id) && {
              rowID: row.id,
              rowName: row.elementName,
              color: get(bookmarkColorSelector(row.id)),
            },
          ),
        ),
      );
    });
    return result;
  },
});

/** Gets all items in visible rows */
export const visibleItemsSelector = selector<Item[]>({
  key: 'visible-items',
  get: ({ get }) => {
    const rows = get(rowsSelector);
    const result: Item[] = [];
    Object.values(rows).forEach((row) =>
      get(rowItemsSelector(row.id)).forEach((item) => result.push(item)),
    );
    return result;
  },
});

/**
 * Gets all items that are currently displayed in intersections in the plot
 * (if the unincluded intersection is visible, this is all items)
 * sorted into included and excluded lists based on the current selection.
 * If no selection is active, all items are excluded.
 * @returns The included and excluded items
 */
const filteredItems = selector<FilteredItems>({
  key: 'filtered-items',
  get: ({ get }) => {
    const type = get(currentSelectionType);
    if (type === 'vega') {
      const selection = get(currentVegaSelection);
      if (selection) return filterByVega(get(visibleItemsSelector), selection);
    }
    if (type === 'query') {
      const selection = get(currentQuerySelection);
      if (selection) return filterByQuery(get(visibleItemsSelector), selection);
    }
    return { included: [], excluded: get(visibleItemsSelector) };
  },
});

/**
 * If the selection type is 'vega' or 'query', returns items from visible intersections included in the selection.
 * If the selection type is 'row', returns items from the selected intersection.
 * If the selection type is 'none', returns all items in visible intersections.
 */
export const selectedOrBookmarkedItemsSelector = selector<Item[]>({
  key: 'selected-elements',
  get: ({ get }) => {
    const type = get(currentSelectionType);
    if (type === 'vega' || type === 'query') return get(filteredItems).included;
    if (type === 'row')
      return get(rowItemsSelector(get(currentIntersectionSelector)?.id));
    return get(visibleItemsSelector);
  },
});

/**
 * Gets all values for a given attribute for all items in a given row.
 * If the provided attribute does not exist or is not numeric,
 * outputs a console warning & returns an empty list.
 */
export const attValuesSelector = selectorFamily<number[], { row: Row; att: string }>({
  key: 'att-values',
  get:
    ({ row, att }) =>
    ({ get }) => {
      const items = get(rowItemsSelector(row.id));

      // Basic check for performance reasons; we can eliminate most cases with this
      if (!items[0] || !items[0].atts[att] || typeof items[0].atts[att] !== 'number') {
        return [];
      }
      return (
        items
          // Safely cast the attribute to a number since we filter after
          .map((item) => item.atts[att] as number)
          .filter((val) => !Number.isNaN(val))
      );
    },
});

/**
 * Gets the number of elements in the intersection represented by the provided ID
 * @param id - The ID of the intersection to get elements for.
 * @returns The number of elements in the intersection
 */
export const intersectionCountSelector = selectorFamily<
  number,
  string | null | undefined
>({
  key: 'intersection-count',
  get:
    (id: string | null | undefined) =>
    ({ get }) => {
      if (!id) return 0;

      const data = get(dataAtom);
      const state = get(upsetConfigAtom);
      const intersections = flattenedOnlyRows(data, state);

      if (intersections[id] === undefined) {
        return 0;
      }

      const row = intersections[id];
      return row.size;
    },
});

/**
 * Counts the number of selected items.
 */
export const selectedItemsCounter = selector<number>({
  key: 'selected-item-count',
  get: ({ get }) => get(selectedOrBookmarkedItemsSelector).length,
});

/**
 * Counts the number of selected items in a subset using either the current vega or query selection.
 * @param id - The ID of the subset to count selected items for.
 * @param type - The type of selection ('vega' or 'query') to use for filtering.
 * @returns The number of selected items in the subset
 */
export const subsetSelectedCount = selectorFamily<
  number,
  { id: string; type: SelectionType | null }
>({
  key: 'subset-selected',
  get:
    ({ id, type }) =>
    ({ get }) => {
      if (!id) return 0;
      const rowItems = get(rowItemsSelector(id));

      if (type === 'vega') {
        const selection = get(currentVegaSelection);
        if (!selection) return 0;
        return filterByVega(rowItems, selection).included.length;
      }

      if (type === 'query') {
        const selection = get(currentQuerySelection);
        if (!selection) return 0;
        return filterByQuery(rowItems, selection).included.length;
      }

      // If the selection type is 'row' or null, no items are selected
      return 0;
    },
});

/**
 * Counts the number of selected items in an aggregate using either the current vega or query selection.
 * This selector recursively counts the selected items in all sub-aggregates and subsets.
 * It returns the total count of selected items across all levels of the aggregate.
 * * @param agg - The aggregate to count selected items for.
 * @param type - The type of selection ('vega' or 'query') to use for filtering.
 * @returns The total number of selected items in the aggregate
 */
export const aggregateSelectedCount = selectorFamily<
  number,
  { agg: Aggregate; type: SelectionType | null }
>({
  key: 'aggregate-selected',
  get:
    ({ agg, type }) =>
    ({ get }) => {
      let total = 0;
      Object.entries(agg.rows.values).forEach(([id, value]) => {
        total += isRowAggregate(value)
          ? get(aggregateSelectedCount({ agg: value, type }))
          : get(subsetSelectedCount({ id, type }));
      });
      return total;
    },
});

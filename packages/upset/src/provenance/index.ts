/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  AggregateBy, Plot, PlotInformation, SortByOrder, SortVisibleBy, UpsetConfig, DefaultConfig, Row,
  Bookmark, BookmarkedSelection,
  convertConfig,
  ColumnName,
  AltText,
} from '@visdesignlab/upset2-core';

import { Registry, StateChangeFunction, initializeTrrack } from '@trrack/core';

export type Metadata = {
  [key: string]: unknown;
};

const registry = Registry.create();

/**
 * Registers a new action that uses a StateChangeFunction with the provenance registry while also guaranteeing
 * that old upset config types (from outdated Trrack graph imports)
 * are converted to the new upset config type before being passed to the StateChangeFunction.
 * One type parameter is required; for the payload argument received by the action function.
 * @param type Action type, string
 * @param func Action function
 * @typeparam DoActionPayload The type of the payload argument received by the action function (required)
 * @typeparam UndoActionType The type of the undo action (optional)
 * @typeparam UndoActionPayload The type of the payload argument received by the undo action function (optional)
 * @returns An action creator that can be passed to provenance.apply
 */
function register<DoActionPayload, UndoActionType extends string = string, UndoActionPayload = any>(
  type: string,
  func: StateChangeFunction<UpsetConfig, DoActionPayload>,
) {
  return registry.register<typeof type, UndoActionType, DoActionPayload, UndoActionPayload, UpsetConfig>(
    type,
    (state, payload) => func(convertConfig(state), payload),
  );
}

const firstAggAction = register<AggregateBy>(
  'first-agg',
  (state, aggBy) => {
    state.firstAggregateBy = aggBy;
    if (aggBy === 'None' || aggBy === state.secondAggregateBy) {
      state.secondAggregateBy = 'None';
    }
    state.collapsed.length = 0; // reset collapsed state without triggering trrack event
    return state;
  },
);

const firstOverlapAction = register<number>(
  'first-overlap',
  (state, overlap) => {
    state.firstOverlapDegree = overlap;
    return state;
  },
);

const secondAggAction = register<AggregateBy>(
  'second-agg',
  (state, aggBy) => {
    state.secondAggregateBy = aggBy;
    state.collapsed.length = 0; // reset collapsed state without triggering trrack event
    return state;
  },
);

const secondOverlapAction = register<number>(
  'second-overlap',
  (state, overlap) => {
    state.secondOverlapDegree = overlap;
    return state;
  },
);

const sortVisibleSetsAction = register<SortVisibleBy>(
  'sort-visible-by',
  (state, sort) => {
    state.sortVisibleBy = sort;
    return state;
  },
);

const sortByAction = register<{sort: string, sortByOrder: SortByOrder}>(
  'sort-by',
  (state, { sort, sortByOrder }) => {
    state.sortBy = sort;
    // should only be 'None' if sortBy is a Set
    state.sortByOrder = sortByOrder || 'None';
    return state;
  },
);

const maxVisibleAction = register<number>(
  'max-visible',
  (state, maxVisible) => {
    state.filters.maxVisible = maxVisible;
    return state;
  },
);

const minVisibleAction = register<number>(
  'min-visible',
  (state, minVisible) => {
    state.filters.minVisible = minVisible;
    return state;
  },
);

const hideEmptyAction = register<boolean>(
  'hide-empty',
  (state, hide) => {
    state.filters.hideEmpty = hide;
    return state;
  },
);

const hideNoSetAction = register<boolean>(
  'hide-no-set',
  (state, hide) => {
    state.filters.hideNoSet = hide;
    return state;
  },
);

const addToVisibleAction = register<ColumnName>(
  'add-to-visible',
  (state: UpsetConfig, newSet) => {
    const newSets = new Set([...state.visibleSets, newSet]);
    state.visibleSets = Array.from(newSets);
    return state;
  },
);

const removeFromVisibleAction = register<ColumnName>(
  'remove-from-visible',
  (state: UpsetConfig, newSet) => {
    state.visibleSets = state.visibleSets.filter((v) => v !== newSet);
    return state;
  },
);

const addToVisibleAttributeAction = register<ColumnName>(
  'add-to-visible-attribute',
  (state, attribute) => {
    const newAttributes = new Set([...state.visibleAttributes, attribute]);
    state.visibleAttributes = Array.from(newAttributes);
    return state;
  },
);

const addMultipleVisibleAttributes = register<ColumnName[]>(
  'add-multiple-visible-attributes',
  (state, attributes) => {
    state.visibleAttributes = attributes;
    return state;
  },
);

const removeFromVisibleAttributes = register<ColumnName>(
  'remove-from-visible-attributes',
  (state, attribute) => {
    state.visibleAttributes = state.visibleAttributes.filter(
      (v) => v !== attribute,
    );
    return state;
  },
);

const removeMultipleVisibleAttributes = register<ColumnName[]>(
  'remove-multiple-visible-attributes',
  (state, attributes) => {
    state.visibleAttributes = state.visibleAttributes.filter(
      (v) => !attributes.includes(v),
    );
    return state;
  },
);

const updateAttributePlotType = registry.register(
  'update-attribute-plot-type',
  (state: UpsetConfig, { attr, plotType }) => {
    state.attributePlots[attr] = plotType;
    return state;
  },
);

const addBookmarkAction = register<Bookmark>(
  'add-bookmark',
  (state, newBookmark) => {
    if (!state.bookmarks.find((b) => b.id === newBookmark.id)) {
      state.bookmarks = [
        ...state.bookmarks,
        newBookmark,
      ];
    }

    return state;
  },
);

const removeBookmarkAction = register<Bookmark>(
  'remove-bookmark',
  (state: UpsetConfig, bookmark) => {
    state.bookmarks = state.bookmarks.filter(
      (b) => b.id !== bookmark.id,
    );

    return state;
  },
);

const addPlotAction = register<Plot>(
  'add-plot',
  (state, plot) => {
    switch (plot.type) {
      case 'Histogram':
        state.plots.histograms = [...state.plots.histograms, plot];
        break;
      case 'Scatterplot':
        state.plots.scatterplots = [...state.plots.scatterplots, plot];
        break;
      default:
        throw new Error('Unknown plot type');
    }

    return state;
  },
);

const removePlotAction = register<Plot>(
  'remove-plot',
  (state, plot) => {
    switch (plot.type) {
      case 'Histogram':
        state.plots.histograms = state.plots.histograms.filter(
          (d) => d.id !== plot.id,
        );
        break;
      case 'Scatterplot':
        state.plots.scatterplots = state.plots.scatterplots.filter(
          (d) => d.id !== plot.id,
        );
        break;
      default:
        throw new Error('Unknown plot type');
    }

    return state;
  },
);

const replaceStateAction = register<UpsetConfig>(
  'set-state',
  (state, newState) => {
    const replacement = JSON.parse(JSON.stringify(newState));

    Object.entries(state).forEach(([entry, val]) => {
      if (!Object.keys(replacement).includes(entry)) {
        replacement[entry] = val;
      } else if (typeof val === 'object' && val !== null) {
        /*
         * Remove the duplicate values in array fields
         * Sometimes the deep copy will add a duplicate value in array fields for seemingly no reason..
         */
        if (Array.isArray(val)) {
          const repSet = new Set(replacement[entry]);

          replacement[entry] = Array.from(repSet);
        } else {
          Object.entries(val).forEach(([key, value]) => {
            if (replacement[entry][key] === undefined) {
              replacement[entry][key] = value;
            }
          });
        }
      }
    });

    return replacement;
  },
);

const addCollapsedAction = register<string>(
  'add-collapsed',
  (state, id) => {
    const newCollapsed = new Set([...state.collapsed, id]);
    state.collapsed = Array.from(newCollapsed).sort();
    return state;
  },
);

const removeCollapsedAction = register<string>(
  'remove-collapsed',
  (state: UpsetConfig, id) => {
    state.collapsed = state.collapsed.filter((v) => v !== id);
    return state;
  },
);

const collapseAllAction = register<string[]>(
  'collapse-all',
  (state, ids) => {
    state.collapsed = ids.sort();
    return state;
  },
);

const expandAllAction = register<string[]>(
  'expand-all',
  (state: UpsetConfig, newCollapsed) => {
    state.collapsed = [...newCollapsed];
    return state;
  },
);

const setPlotInformationAction = register<PlotInformation>(
  'set-plot-information',
  (state: UpsetConfig, plotInformation) => {
    state.plotInformation = plotInformation;
    return state;
  },
);

const setSelectedAction = register<Row | null>(
  'select-intersection',
  (state: UpsetConfig, intersection) => {
    state.selected = intersection;
    return state;
  },
);

const setElementSelectionAction = register<BookmarkedSelection | null>(
  'select-elements',
  (state: UpsetConfig, bookmarkedSelection) => {
    state.elementSelection = bookmarkedSelection;
    return state;
  },
);
/**
 * Sets the alt text for the user
 * @param {AltText} altText The alt text to set
 */
const setUserAltTextAction = register<AltText | null>(
  'set-user-alt-text',
  (state: UpsetConfig, altText) => {
    state.userAltText = altText;
    return state;
  },
);

/**
 * Toggles whether the user alt text should be used
 * @param {boolean} useUserAlt whether to use the user alttext
 */
const setUseUserAltTextAction = register<boolean>(
  'set-use-user-alt-text',
  (state: UpsetConfig, useUserAlt) => {
    state.useUserAlt = useUserAlt;
    return state;
  },
);

export function initializeProvenanceTracking(
  // eslint-disable-next-line default-param-last
  config: Partial<UpsetConfig> = {},
  setter?: (state: UpsetConfig) => void,
) {
  const finalConfig: UpsetConfig = { ...DefaultConfig, ...config };

  const provenance = initializeTrrack(
    { initialState: finalConfig, registry },
  );

  if (setter) {
    provenance.currentChange(() => setter(provenance.getState()));
  }

  provenance.done();

  return provenance;
}

export type UpsetProvenance = ReturnType<typeof initializeProvenanceTracking>;

export function getActions(provenance: UpsetProvenance) {
  return {
    firstAggregateBy: (aggBy: AggregateBy) => provenance.apply(`First aggregate by ${aggBy}`, firstAggAction(aggBy)),
    firstOverlapBy: (overlap: number) => provenance.apply(`First overlap by ${overlap}`, firstOverlapAction(overlap)),
    secondAggregateBy: (aggBy: AggregateBy) => provenance.apply(`Second aggregate by ${aggBy}`, secondAggAction(aggBy)),
    secondOverlapBy: (overlap: number) => provenance.apply(`Second overlap by ${overlap}`, secondOverlapAction(overlap)),
    sortVisibleBy: (sort: SortVisibleBy) => provenance.apply(`Sort Visible Sets by ${sort}`, sortVisibleSetsAction(sort)),
    sortBy: (sort: string, sortByOrder: SortByOrder) => provenance.apply(`Sort by ${sort.replace('Set_', 'Set: ')}${sortByOrder ? `, ${sortByOrder}` : ''}`, sortByAction({ sort, sortByOrder })),
    setMaxVisible: (val: number) => provenance.apply(`Hide intersections above ${val}`, maxVisibleAction(val)),
    setMinVisible: (val: number) => provenance.apply(`Hide intersections below ${val}`, minVisibleAction(val)),
    setHideEmpty: (val: boolean) => provenance.apply(val ? 'Hide empty intersections' : 'Show empty intersections', hideEmptyAction(val)),
    setHideNoSet: (val: boolean) => provenance.apply(val ? 'Hide no-set intersection' : 'Show no-set intersection', hideNoSetAction(val)),
    addVisibleSet: (set: string) => provenance.apply(`Add set ${set}`, addToVisibleAction(set)),
    removeVisibleSet: (set: string) => provenance.apply(`Remove set ${set}`, removeFromVisibleAction(set)),
    addAttribute: (attr: string) => provenance.apply(`Show ${attr}`, addToVisibleAttributeAction(attr)),
    removeAttribute: (attr: string) => provenance.apply(`Hide ${attr}`, removeFromVisibleAttributes(attr)),
    addMultipleAttributes: (attrs: string[]) => provenance.apply(`Show ${attrs.length} attributes`, addMultipleVisibleAttributes(attrs)),
    removeMultipleVisibleAttributes: (attrs: string[]) => provenance.apply(`Hide ${attrs.length} attributes`, removeMultipleVisibleAttributes(attrs)),
    updateAttributePlotType: (attr: string, plotType: string) => provenance.apply(`Update ${attr} plot type to ${plotType}`, updateAttributePlotType({ attr, plotType })),
    /**
     * Adds a bookmark to the state
     * @param b bookmark to add
     */
    addBookmark: <T extends Bookmark>(b: T) => provenance.apply(`Bookmark ${b.label}`, addBookmarkAction(b)),
    /**
     * Removes a bookmark from the state
     * @param b bookmark to remove
     */
    removeBookmark: (b: Bookmark) => provenance.apply(`Unbookmark ${b.label}`, removeBookmarkAction(b)),
    /**
     * Adds a plot to the state
     * @param plot plot to add
     */
    addPlot: (plot: Plot) => provenance.apply(`Add Plot: ${plot.type}`, addPlotAction(plot)),
    /**
     * Removes a plot from the state
     * @param plot plot to remove
     */
    removePlot: (plot: Plot) => provenance.apply(`Remove ${plot}`, removePlotAction(plot)),
    replaceState: (state: UpsetConfig) => provenance.apply('Replace state', replaceStateAction(state)),
    addCollapsed: (id: string) => provenance.apply(`Collapsed ${id}`, addCollapsedAction(id)),
    removeCollapsed: (id: string) => provenance.apply(`Expanded ${id}`, removeCollapsedAction(id)),
    collapseAll: (ids: string[]) => provenance.apply('Collapsed all rows', collapseAllAction(ids)),
    expandAll: () => provenance.apply('Expanded all rows', expandAllAction([])),
    setPlotInformation: (plotInformation: PlotInformation) => provenance.apply('Update plot information', setPlotInformationAction(plotInformation)),
    setSelected: (intersection: Row | null) => provenance.apply(
      intersection ?
        `Select intersection "${intersection.elementName.replaceAll('~&~', ' & ')}"` :
        'Deselect intersection',
      setSelectedAction(intersection),
    ),
    /**
     * Sets a global element selection for the plot,
     * which is a filter on items based on their attributes.
     * @param selection The selection to set
     */
    setElementSelection: (selection: BookmarkedSelection | null) => provenance.apply(
      selection && Object.keys(selection.selection).length > 0 ?
        `Selected elements based on the following keys: ${Object.keys(selection.selection).join(' ')}`
        : 'Deselected elements',
      setElementSelectionAction(selection),
    ),
    setUserAltText: (altText: AltText | null) => provenance.apply(
      altText ? 'Set user alt text' : 'Cleared user alt text',
      setUserAltTextAction(altText),
    ),
    setUseUserAltText: (useUserAlt: boolean) => provenance.apply(
      useUserAlt ? 'Enabled user alt text' : 'Disabled user alt text',
      setUseUserAltTextAction(useUserAlt),
    ),
  };
}

export type UpsetActions = ReturnType<typeof getActions>;

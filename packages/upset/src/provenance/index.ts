import { AggregateBy, Plot, SortBy, SortVisibleBy, UpsetConfig } from '@visdesignlab/upset2-core';

import { defaultConfig } from '../atoms/config/upsetConfigAtoms';
import { Registry, initializeTrrack } from '@trrack/core';

export type Events = 'Test';

export type Metadata = {
  [key: string]: unknown;
};

const registry = Registry.create();

const firstAggAction = registry.register('first-agg',
  (state, aggBy) => {
    state.firstAggregateBy = aggBy;
    if (aggBy === 'None' || aggBy === state.secondAggregateBy) {
      state.secondAggregateBy = 'None';
    }
    state.collapsed.length = 0; // reset collapsed state without triggering trrack event
    return state;
  },
);

const firstOverlapAction = registry.register('first-overlap',
  (state, overlap) => {
    state.firstOverlapDegree = overlap;
    return state;
  },
);

const secondAggAction = registry.register('second-agg',
  (state, aggBy) => {
    state.secondAggregateBy = aggBy;
    state.collapsed.length = 0; // reset collapsed state without triggering trrack event
    return state;
  },
);

const secondOverlapAction = registry.register('second-overlap',
  (state, overlap) => {
    state.secondOverlapDegree = overlap;
    return state;
  },
);

const sortVisibleSetsAction = registry.register('sort-visible-by',
  (state, sort) => {
    state.sortVisibleBy = sort;
    return state;
  },
);

const sortByAction = registry.register('sort-by',
  (state, sort) => {
    state.sortBy = sort;
    return state;
  },
);

const maxVisibleAction = registry.register('max-visible',
  (state, maxVisible) => {
    state.filters.maxVisible = maxVisible;
    return state;
  },
);

const minVisibleAction = registry.register('min-visible',
  (state, minVisible) => {
    state.filters.minVisible = minVisible;
    return state;
  },
);

const hideEmptyAction = registry.register('hide-empty',
  (state, hide) => {
    state.filters.hideEmpty = hide;
    return state;
  },
);

const addToVisibleAction = registry.register('add-to-visible',
  (state, newSet) => {
    const newSets = new Set([...state.visibleSets, newSet]);
    state.visibleSets = Array.from(newSets);
    return state;
  },
);

const removeFromVisibleAction = registry.register('remove-from-visible',
  (state: UpsetConfig, newSet) => {
    state.visibleSets = state.visibleSets.filter((v) => v !== newSet);
    return state;
  },
);

const addToVisibleAttributeAction = registry.register('add-to-visible-attribute',
  (state, attribute) => {
    const newAttributes = new Set([...state.visibleAttributes, attribute]);
    state.visibleAttributes = Array.from(newAttributes);
    return state;
  },
);

const addMultipleVisibleAttributes = registry.register('add-multiple-visible-attributes',
(state, attributes) => {
  state.visibleAttributes = attributes;
  return state;
});

const removeFromVisibleAttributes = registry.register('remove-from-visible-attributes',
  (state : UpsetConfig, attribute) => {
    state.visibleAttributes = state.visibleAttributes.filter(
      (v) => v !== attribute,
    );
    return state;
  },
);

const removeMultipleVisibleAttributes = registry.register('remove-multiple-visible-attributes',
(state: UpsetConfig, attribute) => {
  state.visibleAttributes = state.visibleAttributes.filter(
    (v) => !attribute.includes(v),
  );
  return state;
});

const bookmarkIntersectionAction = registry.register('bookmark-intersection',
  (state: UpsetConfig, newBookmark) => {
    if (!state.bookmarkedIntersections.find((b) => b.id === newBookmark.id))
      state.bookmarkedIntersections = [
        ...state.bookmarkedIntersections,
        newBookmark,
      ];

    return state;
  },
);

const removeBookmarkIntersectionAction = registry.register('remove-bookmark-intersection',
(state: UpsetConfig, bookmark) => {
  state.bookmarkedIntersections = state.bookmarkedIntersections.filter(
    (b) => b.id !== bookmark.id,
  );

  return state;
});

const addPlotAction = registry.register('add-plot',
  (state, plot) => {
    switch (plot.type) {
      case 'Histogram':
        state.plots.histograms = [...state.plots.histograms, plot];
        break;
      case 'Scatterplot':
        state.plots.scatterplots = [...state.plots.scatterplots, plot];
        break;
      case 'Word Cloud':
        state.plots.wordClouds = [...state.plots.wordClouds, plot];
        break;
    }

    return state;
  },
);

const removePlotAction = registry.register('remove-plot',
  (state: UpsetConfig, plot) => {
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
      case 'Word Cloud':
        state.plots.wordClouds = state.plots.wordClouds.filter(
          (d) => d.id !== plot.id,
        );
        break;
    }

    return state;
  },
);

const replaceStateAction = registry.register('set-state',
  (_state: UpsetConfig, newState: UpsetConfig) => {
    const replacement = JSON.parse(JSON.stringify(newState));

    Object.entries(defaultConfig).forEach((entry) => {
      if (!Object.keys(replacement).includes(entry[0])) {
        console.error(`${entry[0]} is missing. Adding default value`);
        
        replacement[entry[0]] = entry[1];
      }
    })

    return replacement;
  },
);

const addCollapsedAction = registry.register('add-collapsed',
  (state, id) => {
    const newCollapsed = new Set([...state.collapsed, id]);
    state.collapsed = Array.from(newCollapsed).sort();
    return state;
  },
);

const removeCollapsedAction = registry.register('remove-collapsed',
  (state: UpsetConfig, id) => {
    state.collapsed = state.collapsed.filter((v) => v !== id);
    return state;
  },
);

const collapseAllAction = registry.register('collapse-all', 
  (state, ids) => {
    state.collapsed = ids.sort();
    return state;
  },
);

const expandAllAction = registry.register('expand-all', 
  (state: UpsetConfig, newCollapsed) => {
    state.collapsed = [...newCollapsed];
    return state;
  },
);

export function initializeProvenanceTracking(
  config: Partial<UpsetConfig> = {},
  setter?: (state: UpsetConfig) => void,
) {
  const finalConfig: UpsetConfig = { ...defaultConfig, ...config };
 
  const provenance = initializeTrrack (
    { initialState : finalConfig, registry }
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
    firstAggregateBy: (aggBy: AggregateBy) =>
      provenance.apply(
        `First aggregate by ${aggBy}`, firstAggAction(aggBy),
      ),
    firstOverlapBy: (overlap: number) =>
      provenance.apply(
        `First overlap by ${overlap}`, firstOverlapAction(overlap),
      ),
    secondAggregateBy: (aggBy: AggregateBy) =>
      provenance.apply(
        `Second aggregate by ${aggBy}`, secondAggAction(aggBy),
      ),
    secondOverlapBy: (overlap: number) =>
      provenance.apply(
        `Second overlap by ${overlap}`, secondOverlapAction(overlap),
      ),
    sortVisibleBy: (sort: SortVisibleBy) =>
        provenance.apply(`Sort Visible Sets by ${sort}`, sortVisibleSetsAction(sort)),
    sortBy: (sort: SortBy) =>
      provenance.apply(`Sort by ${sort}`, sortByAction(sort)),
    setMaxVisible: (val: number) =>
      provenance.apply(
        `Hide intersections above ${val}`, maxVisibleAction(val),
      ),
    setMinVisible: (val: number) =>
      provenance.apply(
        `Hide intersections below ${val}`, minVisibleAction(val),
      ),
    setHideEmpty: (val: boolean) =>
      provenance.apply(
        val ? 'Hide empty intersections' : 'Show empty intersections', hideEmptyAction(val)
      ),
    addVisibleSet: (set: string) =>
      provenance.apply(`Add set ${set}`, addToVisibleAction(set)),
    removeVisibleSet: (set: string) =>
      provenance.apply(
        `Remove set ${set}`, removeFromVisibleAction(set),
      ),
    addAttribute: (attr: string) =>
      provenance.apply(
        `Show ${attr}`, addToVisibleAttributeAction(attr),
      ),
    removeAttribute: (attr: string) =>
      provenance.apply(
        `Hide ${attr}`, removeFromVisibleAttributes(attr),
      ),
    addMultipleAttributes: (attrs: string[]) =>
      provenance.apply(
        `Show ${attrs.length} attributes`, addMultipleVisibleAttributes(attrs),
      ),
    removeMultipleVisibleAttributes: (attrs: string[]) =>
      provenance.apply(
        `Hide ${attrs.length} attributes`, removeMultipleVisibleAttributes(attrs),
      ),
    bookmarkIntersection: (id: string, label: string, size: number) =>
      provenance.apply(
        `Bookmark ${label}`, bookmarkIntersectionAction({id, label, size}),
      ),
    unBookmarkIntersection: (id: string, label: string, size: number) =>
      provenance.apply(
        `Unbookmark ${label}`, removeBookmarkIntersectionAction({id, label, size}),
      ),
    addPlot: (plot: Plot) => 
      provenance.apply(
        `Add Plot: ${plot.type}`, addPlotAction(plot)
      ),
    removePlot: (plot: Plot) =>
      provenance.apply(
        `Remove ${plot}`, removePlotAction(plot)
      ),
    replaceState: (state: UpsetConfig) =>
        provenance.apply(
          `Replace state`, replaceStateAction(state)
        ),
    addCollapsed: (id: string) => 
        provenance.apply(
          `Collapsed ${id}`, addCollapsedAction(id)
        ),
    removeCollapsed: (id: string) =>
        provenance.apply(
          `Expanded ${id}`, removeCollapsedAction(id)
        ),
    collapseAll: (ids: string[]) =>
        provenance.apply(
          `Collapsed all rows`, collapseAllAction(ids)
        ),
    expandAll: () =>
        provenance.apply(
          `Expanded all rows`, expandAllAction([])
        ),
  };
}

export type UpsetActions = ReturnType<typeof getActions>;

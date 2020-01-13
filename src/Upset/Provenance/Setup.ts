import UpsetProvenance from '../Interfaces/UpsetProvenance';
import { initProvenance, isStateNode } from '@visdesignlab/provenance-lib-core';
import UpsetState, { defaultState } from '../Interfaces/UpsetState';
import { upsetStore } from '../Store/UpsetStore';
import { DatasetInfo } from '../Interfaces/DatasetInfo';
import { AggregationOptions } from '../Interfaces/AggregationOptions';
import { SortingOptions } from '../Interfaces/SortOptions';

export function setupProvenance(): UpsetProvenance {
  const provenance = initProvenance(defaultState, true);

  provenance.addGlobalObserver(() => {
    let isAtRoot = false;

    const currentNode = provenance.current();

    if (isStateNode(currentNode)) {
      isAtRoot = currentNode.parent === provenance.root().id;
    }

    upsetStore.isAtRoot = isAtRoot;
    upsetStore.isAtLatest = provenance.current().children.length === 0;
  });

  provenance.addObserver(['dataset'], (state?: UpsetState) => {
    if (state) {
      upsetStore.dataset = state.dataset;
    }
  });

  provenance.addObserver(['firstAggregation'], (state?: UpsetState) => {
    if (state) {
      upsetStore.firstAggregation = state.firstAggregation;
    }
  });

  provenance.addObserver(['firstOverlap'], (state?: UpsetState) => {
    if (state) {
      upsetStore.firstOverlap = state.firstOverlap;
    }
  });

  provenance.addObserver(['secondAggregation'], (state?: UpsetState) => {
    if (state) {
      upsetStore.secondAggregation = state.secondAggregation;
    }
  });

  provenance.addObserver(['secondOverlap'], (state?: UpsetState) => {
    if (state) {
      upsetStore.secondOverlap = state.secondOverlap;
    }
  });

  provenance.addObserver(['sortBy'], (state?: UpsetState) => {
    if (state) {
      upsetStore.sortBy = state.sortBy;
      upsetStore.sortBySetName = state.sortBySetName;
    }
  });

  provenance.addObserver(['sortBySetName'], (state?: UpsetState) => {
    if (state) {
      upsetStore.sortBySetName = state.sortBySetName;
    }
  });

  provenance.addObserver(['hideEmpty'], (state?: UpsetState) => {
    if (state) {
      upsetStore.hideEmpty = state.hideEmpty;
    }
  });

  provenance.addObserver(['minDegree'], (state?: UpsetState) => {
    if (state) {
      upsetStore.minDegree = state.minDegree;
    }
  });

  provenance.addObserver(['maxDegree'], (state?: UpsetState) => {
    if (state) {
      upsetStore.maxDegree = state.maxDegree;
    }
  });

  provenance.addObserver(['dataset'], (state?: UpsetState) => {
    if (state) {
      upsetStore.dataset = state.dataset;
    }
  });
  provenance.done();

  const goForward = () => {
    provenance.goForwardOneStep();
  };
  const goBack = () => {
    provenance.goBackOneStep();
  };

  const setDataset = (info: DatasetInfo) => {
    provenance.applyAction(`Load dataset: ${info.name}`, (state: UpsetState) => {
      state.dataset = info;
      return state;
    });
  };

  const setFirstAggregation = (agg: AggregationOptions) => {
    provenance.applyAction(`Aggregate first by: ${agg}`, (state: UpsetState) => {
      state.firstAggregation = agg;
      if (state.sortBy === 'Set') {
        state.sortBy = 'Degree';
      }
      return state;
    });
  };

  const setSecondAggregation = (agg: AggregationOptions) => {
    provenance.applyAction(`Aggregate next by: ${agg}`, (state: UpsetState) => {
      state.secondAggregation = agg;
      return state;
    });
  };

  const setSortBy = (sortBy: SortingOptions) => {
    provenance.applyAction(`Sort By: ${sortBy}`, (state: UpsetState) => {
      state.sortBy = sortBy;
      state.sortBySetName = '';
      return state;
    });
  };

  const setHideEmpty = (hide: boolean) => {
    provenance.applyAction(
      hide ? 'Hide Empty Intersections' : 'Show Empty Intersections',
      (state: UpsetState) => {
        state.hideEmpty = hide;
        return state;
      }
    );
  };

  const setMinDegree = (degree: number) => {
    provenance.applyAction(`Set min degree to ${degree}`, (state: UpsetState) => {
      state.minDegree = degree;
      return state;
    });
  };

  const setMaxDegree = (degree: number) => {
    provenance.applyAction(`Set max degree to ${degree}`, (state: UpsetState) => {
      state.maxDegree = degree;
      return state;
    });
  };

  const setSortBySet = (set: string) => {
    provenance.applyAction(`Sort by set: ${set}`, (state: UpsetState) => {
      state.sortBy = 'Set';
      state.firstAggregation = 'None';
      state.secondAggregation = 'None';
      state.sortBySetName = set;
      return state;
    });
  };

  const setFirstOverlap = (overlap: number) => {
    provenance.applyAction(`Set first overlap to: ${overlap}`, (state: UpsetState) => {
      state.firstOverlap = overlap;
      return state;
    });
  };

  const setSecondOverlap = (overlap: number) => {
    provenance.applyAction(`Set second overlap to: ${overlap}`, (state: UpsetState) => {
      state.secondOverlap = overlap;
      return state;
    });
  };

  return {
    provenance,
    actions: {
      goForward,
      goBack,
      setDataset,
      setFirstAggregation,
      setSecondAggregation,
      setSortBy,
      setHideEmpty,
      setMinDegree,
      setMaxDegree,
      setSortBySet,
      setFirstOverlap,
      setSecondOverlap
    }
  };
}

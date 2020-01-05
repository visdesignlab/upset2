import UpsetProvenance from '../Interfaces/UpsetProvenance';
import { initProvenance, isStateNode } from '@visdesignlab/provenance-lib-core';
import UpsetState, { defaultState } from '../Interfaces/UpsetState';
import { upsetStore } from '../Store/UpsetStore';
import { DatasetInfo } from '../Interfaces/DatasetInfo';

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

  return {
    provenance,
    actions: { goForward, goBack, setDataset }
  };
}

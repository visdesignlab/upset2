import UpsetProvenance from '../Interfaces/UpsetProvenance';
import { initProvenance, isStateNode } from '@visdesignlab/provenance-lib-core';
import { defaultState } from '../Interfaces/UpsetState';
import { upsetStore } from '../Store/UpsetStore';

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

  provenance.done();

  const goForward = () => {
    provenance.goForwardOneStep();
  };
  const goBack = () => {
    provenance.goBackOneStep();
  };

  return {
    provenance,
    actions: { goForward, goBack }
  };
}

import { Provenance } from '@visdesignlab/provenance-lib-core';
import UpsetState from './UpsetState';
import { DatasetInfo } from './DatasetInfo';

export default interface UpsetProvenance {
  provenance: Provenance<UpsetState>;
  actions: {
    goForward: () => void;
    goBack: () => void;
    setDataset: (datasetInfo: DatasetInfo) => void;
  };
}

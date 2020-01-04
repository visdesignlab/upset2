import { Provenance } from '@visdesignlab/provenance-lib-core';
import UpsetState from './UpsetState';

export default interface UpsetProvenance {
  provenance: Provenance<UpsetState>;
  actions: {
    goForward: () => void;
    goBack: () => void;
  };
}

import { UpsetActions, UpsetProvenance } from '@visdesignlab/upset2-react';
import { createContext } from 'react';

export const ProvenanceContext = createContext<{
  provenance: UpsetProvenance;
  actions: UpsetActions;
}>(undefined!);

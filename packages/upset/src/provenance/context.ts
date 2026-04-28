import { createContext } from 'react';
import { DefaultConfig } from '@visdesignlab/upset2-core';
import {
  getActions,
  initializeProvenanceTracking,
  UpsetActions,
  UpsetProvenance,
} from './index';

// Necessary defaults for createContext; otherwise every consumer has to handle null.
const defaultProvenance = initializeProvenanceTracking(DefaultConfig, () => {
  throw new Error('Setter called on default provenance object');
});
const defaultActions = getActions(defaultProvenance);

export const ProvenanceContext = createContext<{
  provenance: UpsetProvenance;
  actions: UpsetActions;
}>({ provenance: defaultProvenance, actions: defaultActions });

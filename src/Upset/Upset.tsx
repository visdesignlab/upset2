import React, { createContext } from 'react';
import Navbar from './Components/Navbar';
import { Button } from 'semantic-ui-react';
import { setupProvenance } from './Provenance/Setup';
import { Provider } from 'mobx-react';
import { upsetStore } from './Store/UpsetStore';
import UpsetProvenance from './Interfaces/UpsetProvenance';

export const ProvenanceContext = createContext<UpsetProvenance>({} as any);

const Upset: React.FC = () => {
  const { provenance, actions } = setupProvenance();

  return (
    <Provider store={upsetStore}>
      <ProvenanceContext.Provider value={{ provenance, actions }}>
        <Navbar></Navbar>
        <Button primary>Test</Button>
      </ProvenanceContext.Provider>
    </Provider>
  );
};

export default Upset;

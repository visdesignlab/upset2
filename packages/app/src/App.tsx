import { createContext, useEffect, useMemo, useState } from 'react';

import { UpsetProvenance, UpsetActions, getActions, initializeProvenanceTracking } from '@visdesignlab/upset2-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { dataSelector, encodedDataAtom } from './atoms/dataAtom';
import { Root } from './components/Root';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DataTable } from './components/DataTable';
import { convertConfig, deepCopy, DefaultConfig, UpsetConfig } from '@visdesignlab/upset2-core';
import { configAtom } from './atoms/configAtoms';
import { queryParamAtom } from './atoms/queryParamAtom';
import { getMultinetSession } from './api/session';
import { CircularProgress } from '@mui/material';
import { ProvenanceGraph } from '@trrack/core/graph/graph-slice';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const defaultVisibleSets = 6;

type SessionState = ProvenanceGraph<UpsetConfig, string> | null | 'not found';

export const ProvenanceContext = createContext<{
  provenance: UpsetProvenance;
  actions: UpsetActions;
}>(undefined!);

function App() {
  const multinetData = useRecoilValue(dataSelector);
  const encodedData = useRecoilValue(encodedDataAtom);
  const setState = useSetRecoilState(configAtom);
  const data = (encodedData === null) ? multinetData : encodedData
  const { workspace, sessionId } = useRecoilValue(queryParamAtom);
  const [sessionState, setSessionState] = useState<SessionState>(null); // null is not tried to load, undefined is tried and no state to load, and value is loaded value

  const conf = useMemo(() => {
    const config: UpsetConfig = { ...DefaultConfig }
    if (data !== null) {
      const conf: UpsetConfig = JSON.parse(JSON.stringify(config))
      if (config.visibleSets.length === 0) {
        const setList = Object.entries(data.sets);
        conf.visibleSets = setList.slice(0, defaultVisibleSets).map((set) => set[0]) // get first 6 set names
        conf.allSets = setList.map((set) => {return { name: set[0], size: set[1].size }})
      }

      // Add first 4 attribute columns (deviation + 3 attrs) to visibleAttributes
      conf.visibleAttributes = [...DefaultConfig.visibleAttributes, ...data.attributeColumns.slice(0, 4)];

      // Default: a histogram for each attribute if no plots exist
      if (conf.plots.histograms.length + conf.plots.scatterplots.length === 0) {
        conf.plots.histograms = data.attributeColumns.map((attr) => {
          return { 
            attribute: attr, 
            bins: 20, // 20 bins is the default used in upset/.../AddPlot.tsx
            type: 'Histogram', 
            frequency: false, 
            id: Date.now().toString() // Same calculation as in upset/.../AddPlot.tsx
          }
        })
      }

      return conf;
    }
  }, [data]);

  // Initialize Provenance and pass it setter to connect
  const { provenance, actions } = useMemo(() => {
    if (sessionState) {
      const provenance: UpsetProvenance = initializeProvenanceTracking(conf);
      const actions: UpsetActions = getActions(provenance);

      // Make sure the provenance state gets converted every time this is called
      (provenance as UpsetProvenance & {_getState: typeof provenance.getState})._getState = provenance.getState;
      provenance.getState = () => convertConfig(
        (provenance as UpsetProvenance & {_getState: typeof provenance.getState})._getState()
      );

      if (sessionState && sessionState !== 'not found') {
        provenance.importObject(deepCopy(sessionState));
      }

      // Make sure the config atom stays up-to-date with the provenance
      provenance.currentChange(() => setState(provenance.getState()));

      return { provenance: provenance, actions: actions };
    }
    return { provenance: null, actions: null };
  }, [conf, setState, sessionState]);

  /*
   * Effects
   */

  useEffect(() => {
    async function update() {
      if (sessionId) {
        const session = await getMultinetSession(workspace || '', sessionId);
        // Load the session if the object is not empty
        if (session?.state && typeof session.state === 'object' && Object.keys(session.state).length !== 0) {
          setSessionState(session.state);
        } else {
          setSessionState('not found');
        }
      } else {
        setSessionState('not found');
      }
    }
    update();
  }, [sessionId, workspace]);

  // Update the state on first render and if the provenance object changes
  useEffect(() => {if (provenance?.getState()) setState(provenance?.getState())}, [provenance, setState]);

  return (
    <BrowserRouter>
      {provenance ? 
        <ProvenanceContext.Provider
          value={{
              provenance,
              actions,
          }}
        >
          <Routes>
            <Route path="*" element={<Root provenance={provenance} actions={actions} data={null} config={conf} />} />
            <Route path="/" element={<Root provenance={provenance} actions={actions} data={data} config={conf} />} />
            <Route path="/datatable" element={<DataTable />} />
          </Routes>
        </ProvenanceContext.Provider>
      :
        <Routes>
          <Route path="*" element={<CircularProgress />} />
          <Route path="/" element={<CircularProgress />} />
          <Route path="/datatable" element={<DataTable />} />
        </Routes>
      }
    </BrowserRouter>
  );
}

export default App;

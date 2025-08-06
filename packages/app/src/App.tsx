import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  UpsetProvenance,
  UpsetActions,
  getActions,
  initializeProvenanceTracking,
  Upset,
  getAltTextConfig,
} from '@visdesignlab/upset2-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  AltText,
  convertConfig,
  deepCopy,
  DefaultConfig,
  getRows,
  populateConfigDefaults,
  RIGHT_SIDEBAR_URL_PARAM,
  RightSidebar,
  UpsetConfig,
} from '@visdesignlab/upset2-core';
import { CircularProgress } from '@mui/material';
import { ProvenanceGraph } from '@trrack/core/graph/graph-slice';
import { dataSelector, encodedDataAtom } from './atoms/dataAtom';
import { Root } from './components/Root';
import { DataTable } from './components/DataTable';
import { configAtom } from './atoms/configAtoms';
import { queryParamAtom } from './atoms/queryParamAtom';
import { getMultinetSession } from './api/session';
import { ProvenanceContext } from './provenance';
import { Home } from './components/Home';
import { generateAltText } from './api/generateAltText';

/** @jsxImportSource @emotion/react */

type SessionState = ProvenanceGraph<UpsetConfig, string> | null | 'not found';

const ALTTEXT_EMBED_ERR = 'Error generating alt text';

function App() {
  const multinetData = useRecoilValue(dataSelector);
  const encodedData = useRecoilValue(encodedDataAtom);
  const setState = useSetRecoilState(configAtom);
  const data = useMemo(
    () => encodedData ?? multinetData ?? null,
    [encodedData, multinetData],
  );
  const { workspace, sessionId } = useRecoilValue(queryParamAtom);
  const [sessionState, setSessionState] = useState<SessionState>(null); // null is not tried to load, undefined is tried and no state to load, and value is loaded value
  // This might not work on Edge or iOS Safari, oh well!
  const urlParams = new URLSearchParams(window.location.search);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Only for embed mode

  const conf = useMemo(() => {
    if (data !== null) return populateConfigDefaults({ ...DefaultConfig }, data, true);
    return undefined;
  }, [data]);

  const rows = useMemo(() => {
    return data ? getRows(data, conf ?? DefaultConfig) : null;
  }, [data, conf]);

  const generateAltTextFunc: () => Promise<AltText> = useCallback(
    () =>
      data && rows && conf
        ? generateAltText(getAltTextConfig(conf, data, rows)).then((text) => text.alttxt)
        : Promise.resolve({
            longDescription: ALTTEXT_EMBED_ERR,
            shortDescription: ALTTEXT_EMBED_ERR,
          }),
    [conf, data, rows],
  );

  // Initialize Provenance and pass it setter to connect
  const { provenance, actions } = useMemo(() => {
    const prov: UpsetProvenance = initializeProvenanceTracking(conf ?? undefined);
    const act: UpsetActions = getActions(prov);

    if (!data) return { provenance: prov, actions: act };

    if (sessionState && sessionState !== 'not found') {
      prov.importObject(deepCopy(sessionState));
    }

    // Make sure the config atom stays up-to-date with the provenance
    prov.currentChange(() => setState(convertConfig(prov.getState())));

    return { provenance: prov, actions: act };
  }, [conf, setState, sessionState]);

  /*
   * Effects
   */

  useEffect(() => {
    async function update() {
      if (sessionId) {
        const session = await getMultinetSession(workspace || '', sessionId);
        // Load the session if the object is not empty
        if (
          session?.state &&
          typeof session.state === 'object' &&
          Object.keys(session.state).length !== 0
        ) {
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

  const provContext = useMemo(() => ({ provenance, actions }), [provenance, actions]);

  // Update the state on first render and if the provenance object changes
  useEffect(() => {
    if (provenance?.getState()) setState(provenance?.getState());
  }, [provenance, setState]);

  return (
    <BrowserRouter>
      <ProvenanceContext.Provider value={provContext}>
        <Routes>
          {/* Session state is set to 'not found' if we fail to load it,
          so we only show a spinner if we're trying to load the session (not if we've failed or aren't trying) */}
          {sessionId && !sessionState ? (
            <>
              <Route path="*" element={<CircularProgress />} />
              <Route path="/" element={<CircularProgress />} />
            </>
          ) : (
            <>
              <Route
                path="*"
                element={
                  <Root
                    provenance={provenance}
                    actions={actions}
                    data={null}
                    config={conf}
                  />
                }
              />
              <Route
                path="/embed"
                element={
                  data ? (
                    <Upset
                      data={data}
                      config={conf}
                      altTextSidebar={
                        urlParams.get(RIGHT_SIDEBAR_URL_PARAM) === RightSidebar.ALTTEXT
                          ? { open: sidebarOpen, close: () => setSidebarOpen(false), embedded: true }
                          : undefined
                      }
                      elementSidebar={
                        urlParams.get(RIGHT_SIDEBAR_URL_PARAM) === RightSidebar.ELEMENT
                          ? { open: sidebarOpen, close: () => setSidebarOpen(false), embedded: true }
                          : undefined
                      }
                      generateAltText={
                        urlParams.get(RIGHT_SIDEBAR_URL_PARAM) === RightSidebar.ALTTEXT
                          ? generateAltTextFunc
                          : undefined
                      }
                    />
                  ) : (
                    <Home />
                  )
                }
              />
              <Route
                path="/"
                element={
                  <Root
                    provenance={provenance}
                    actions={actions}
                    data={data}
                    config={conf}
                  />
                }
              />
            </>
          )}
          <Route path="/datatable" element={<DataTable />} />
        </Routes>
      </ProvenanceContext.Provider>
    </BrowserRouter>
  );
}

export default App;

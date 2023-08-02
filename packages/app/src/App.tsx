import { useEffect, useMemo } from 'react';

import { UpsetProvenance, UpsetActions, getActions, initializeProvenanceTracking } from '@visdesignlab/upset2-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { dataSelector, encodedDataAtom } from './atoms/dataAtom';
import { upsetConfigAtom } from './atoms/config/upsetConfigAtoms';
import { Root } from './components/Root';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DataTable } from './components/DataTable';
import { queryParamAtom } from './atoms/queryParamAtom';
import { api } from './atoms/authAtoms';

/** @jsxImportSource @emotion/react */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

function App() {
  const multinetData = useRecoilValue(dataSelector);
  const encodedData = useRecoilValue(encodedDataAtom);
  const data = (encodedData === null) ? multinetData : encodedData
  const config = useRecoilValue(upsetConfigAtom);

  const setState = useSetRecoilState(upsetConfigAtom);

  useEffect(() => {
    setState(config);
  }, [config, setState]);

  const conf = useMemo(() => {
    if (data !== null) {
      const conf = JSON.parse(JSON.stringify(config))
      if (config.visibleSets.length === 0) {
        const setList = Object.keys(data.sets);
        conf.visibleSets = setList.slice(0, 6);
        conf.allSets = setList;
      }
      
      conf.visibleAttributes = data.attributeColumns.slice(0, 3);

      return conf;
    }
  }, [config, data]);

  // Initialize Provenance and pass it setter to connect
  const { provenance, actions } = useMemo(() => {
    const provenance: UpsetProvenance = initializeProvenanceTracking(conf);
    const actions: UpsetActions = getActions(provenance);
    return { provenance, actions };
  }, [conf]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Root provenance={provenance} actions={actions} data={null} config={conf} />} />
        <Route path="/" element={<Root provenance={provenance} actions={actions} data={data} config={conf} />} />
        <Route path="/datatable" element={<DataTable />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

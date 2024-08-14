import { useMemo } from 'react';

import { UpsetProvenance, UpsetActions, getActions, initializeProvenanceTracking } from '@visdesignlab/upset2-react';
import { useRecoilValue } from 'recoil';
import { dataSelector, encodedDataAtom } from './atoms/dataAtom';
import { Root } from './components/Root';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DataTable } from './components/DataTable';
import { DefaultConfig, UpsetConfig } from '@visdesignlab/upset2-core';

/** @jsxImportSource @emotion/react */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const defaultVisibleSets = 6;

function App() {
  const multinetData = useRecoilValue(dataSelector);
  const encodedData = useRecoilValue(encodedDataAtom);
  const data = (encodedData === null) ? multinetData : encodedData

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

import { Upset, getAltTextConfig } from '@visdesignlab/upset2-react';
import { UpsetConfig, getRows } from '@visdesignlab/upset2-core';
import { useRecoilValue, useRecoilState } from 'recoil';
import { encodedDataAtom } from '../atoms/dataAtom';
import { doesHaveSavedQueryParam, queryParamAtom, saveQueryParam } from '../atoms/queryParamAtom';
import { ErrorModal } from './ErrorModal';
import { ProvenanceContext } from './Root';
import { useContext, useEffect } from 'react';
import { provenanceVisAtom } from '../atoms/provenanceVisAtom';
import React from 'react';
import { elementSidebarAtom } from '../atoms/elementSidebarAtom';
import { api } from '../atoms/authAtoms';
import { altTextSidebarAtom } from '../atoms/altTextSidebarAtom';
import { loadingAtom } from '../atoms/loadingAtom';
import { Backdrop, CircularProgress } from '@mui/material';

type Props = {
  yOffset: number;
  data: any;
  config?: UpsetConfig;
};

export const Body = ({ yOffset, data, config }: Props) => {
  const { workspace, table, sessionId } = useRecoilValue(queryParamAtom);
  const provObject = useContext(ProvenanceContext);
  const encodedData = useRecoilValue(encodedDataAtom);
  const [ isProvVisOpen, setIsProvVisOpen ] = useRecoilState(provenanceVisAtom);
  const [ isElementSidebarOpen, setIsElementSidebarOpen ] = useRecoilState(elementSidebarAtom);
  const [ isAltTextSidebarOpen, setIsAltTextSidebarOpen ] = useRecoilState(altTextSidebarAtom);
  const loading = useRecoilValue(loadingAtom);

  const provVis = {
    open: isProvVisOpen,
    close: () => { setIsProvVisOpen(false) }
  }

  const elementSidebar = {
    open: isElementSidebarOpen,
    close: () => { setIsElementSidebarOpen(false) }
  }

  const altTextSidebar = {
    open: isAltTextSidebarOpen,
    close: () => { setIsAltTextSidebarOpen(false) }
  }

  useEffect(() => {
    provObject.provenance.currentChange(() => {
      api.updateSession(workspace || '', parseInt(sessionId || ''), 'table', provObject.provenance.exportObject());
    })
  }, [provObject.provenance, sessionId, workspace]);

  async function generateAltText() {
    const state = provObject.provenance.getState();
    const config = getAltTextConfig(state, data, getRows(data, state));

    const response = await api.generateAltText(true, config);
    return response.alttxt.longDescription;
  }

  if (data === null) return null;

  // if no data has been loaded or if the error/one-hot modal has been closed by the user
  if (((!workspace || !table) && !doesHaveSavedQueryParam()) || (encodedData !== null && data.setColumns.length === 0)) {
    return <div>Please click Load Data button to go to data interface.</div>;
  }

  if (data.setColumns.length > 0) {
    saveQueryParam();
  }

  return (
    <div style={{maxWidth: "100vw"}}>
      { data.setColumns.length === 0 ?
        <ErrorModal />:
        <div>
          <Backdrop open={loading} style={{zIndex: 1000}}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Upset
            data={data}
            loadAttributes={3}
            yOffset={yOffset === -1 ? 0 : yOffset}
            extProvenance={provObject}
            config={config}
            provVis={provVis}
            elementSidebar={elementSidebar}
            altTextSidebar={altTextSidebar}
            generateAltText={generateAltText}
          />
        </div>
      }
    </div>
  );
};

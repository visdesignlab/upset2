import { AltText, Upset, getAltTextConfig } from '@visdesignlab/upset2-react';
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

  /**
   * Generates alt text for a plot based on the current state and configuration.
   * If an error occurs during the generation, an error message is returned.
   * Alt text generation currently is not supported for aggregated or attribute sorted plots
   * and an error message is returned.
   * @throws Error with descriptive message if an error occurs while generating the alttxt
   * @returns A promise that resolves to the generated alt text.
   */
  async function generateAltText(): Promise<AltText> {
    const state = provObject.provenance.getState();
    const config = getAltTextConfig(state, data, getRows(data, state));

    if (config.firstAggregateBy !== "None") {
      throw new Error("Alt text generation is not yet supported for aggregated plots. To generate an alt text, set aggregation to 'None' in the left sidebar.");
    }

    if (!['Size', 'Degree', 'Deviation'].includes(config.sortBy)) {
      throw new Error(`Alt text generation is not yet supported for ${config.sortBy.includes("Set_") ? 'set' : 'attribute'} sorting. To generate an alt text, sort by Size, Degree, or Deviation.`);
    }

    let response;
    try {
      response = await api.generateAltText(true, config);
    } catch (e: any) {
      if (e.response.status === 500) {
        throw Error("Server error while generating alt text. Please try again later. If the issue persists, please contact an UpSet developer at vdl-faculty@sci.utah.edu.");
      } else if (e.response.status === 400) {
        throw Error("Error generating alt text. Contact an upset developer at vdl-faculty@sci.utah.edu.");
      } else {
        throw Error("Unknown error while generating alt text: " + e.response.statusText + ". Please contact an UpSet developer at vdl-faculty@sci.utah.edu.");
      }
    }
    return response.alttxt;
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

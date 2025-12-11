import { Upset, getAltTextConfig } from '@visdesignlab/upset2-react';
import { AltText, CoreUpsetData, deepCopy, UpsetConfig } from '@visdesignlab/upset2-core';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import { encodedDataAtom } from '../atoms/dataAtom';
import {
  doesHaveSavedQueryParam,
  queryParamAtom,
  saveQueryParam,
} from '../atoms/queryParamAtom';
import { ErrorModal } from './ErrorModal';
import { provenanceVisAtom } from '../atoms/provenanceVisAtom';
import { elementSidebarAtom } from '../atoms/elementSidebarAtom';
import { altTextSidebarAtom } from '../atoms/altTextSidebarAtom';
import { loadingAtom } from '../atoms/loadingAtom';
import { updateMultinetSession } from '../api/session';
import { generateAltText } from '../api/generateAltText';
import { api } from '../api/api';
import { rowsSelector } from '../atoms/selectors';
import { FOOTER_HEIGHT } from './Root';
import { ProvenanceContext } from '../provenance';

type Props = {
  data: CoreUpsetData;
  config?: UpsetConfig;
};

export const Body = ({ data, config }: Props) => {
  const { workspace, table, sessionId } = useRecoilValue(queryParamAtom);
  const provObject = useContext(ProvenanceContext);
  const encodedData = useRecoilValue(encodedDataAtom);
  const [isProvVisOpen, setIsProvVisOpen] = useRecoilState(provenanceVisAtom);
  const [isElementSidebarOpen, setIsElementSidebarOpen] =
    useRecoilState(elementSidebarAtom);
  const [isAltTextSidebarOpen, setIsAltTextSidebarOpen] =
    useRecoilState(altTextSidebarAtom);
  const loading = useRecoilValue(loadingAtom);
  const rows = useRecoilValue(rowsSelector);

  const provVis = {
    open: isProvVisOpen,
    close: () => {
      setIsProvVisOpen(false);
    },
  };

  const elementSidebar = {
    open: isElementSidebarOpen,
    close: () => {
      setIsElementSidebarOpen(false);
    },
  };

  const altTextSidebar = {
    open: isAltTextSidebarOpen,
    close: () => {
      setIsAltTextSidebarOpen(false);
    },
  };

  useEffect(() => {
    provObject?.provenance.currentChange(() => {
      updateMultinetSession(
        workspace || '',
        sessionId || '',
        provObject.provenance.exportObject(),
      );
    });
  }, [provObject?.provenance, sessionId, workspace]);

  // Check if the user has permissions to edit the plot
  const [permissions, setPermissions] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const r = await api.getCurrentUserWorkspacePermissions(workspace || '');
        // https://api.multinet.app/swagger/?format=openapi#/definitions/PermissionsReturn for possible permissions returns
        setPermissions(
          r.permission_label === 'owner' || r.permission_label === 'maintainer',
        );
      } catch {
        setPermissions(false);
      }
    };

    fetchPermissions();
  }, [workspace]);

  /**
   * Generates alt text for a plot based on the current state and configuration.
   * If an error occurs during the generation, an error message is returned.
   * Alt text generation currently is not supported for aggregated or attribute sorted plots
   * and an error message is returned.
   * @throws Error with descriptive message if an error occurs while generating the alttxt
   * @returns A promise that resolves to the generated alt text.
   */
  const getAltText: () => Promise<AltText> = useCallback(async () => {
    const state = provObject?.provenance.getState();
    if (!state) return Promise.reject(new Error('Provenance state is not available.'));
    // Rows must be cloned to avoid a recoil error triggered far down in this call chain when a function writes rows
    const ATConfig = getAltTextConfig(state, data, deepCopy(rows));

    if (ATConfig.firstAggregateBy !== 'None') {
      throw new Error(
        "Alt text generation is not yet supported for aggregated plots. To generate an alt text, set aggregation to 'None' in the left sidebar.",
      );
    }

    if (!['Size', 'Degree', 'Deviation'].includes(ATConfig.sortBy)) {
      throw new Error(
        `Alt text generation is not yet supported for ${ATConfig.sortBy.includes('Set_') ? 'set' : 'attribute'} sorting. To generate an alt text, sort by Size, Degree, or Deviation.`,
      );
    }

    if (!['Descending', 'Ascending', 'Alphabetical'].includes(ATConfig.sortVisibleBy)) {
      throw new Error(
        'Alt text generation is not yet supported for custom visible set orders. To generate an alt text, set visible set sorting to Alphabetical, Size - Ascending, or Size - Descending.',
      );
    }

    let response;
    try {
      response = await generateAltText(ATConfig);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.response.status === 500) {
        throw Error(
          'Server error while generating alt text. Please try again later. If the issue persists, please contact an UpSet developer at vdl-faculty@sci.utah.edu.',
        );
      } else if (e.response.status === 400) {
        throw Error(
          'Error generating alt text. Contact an upset developer at vdl-faculty@sci.utah.edu.',
        );
      } else {
        throw Error(
          `Unknown error while generating alt text: ${e.response.statusText}. Please contact an UpSet developer at vdl-faculty@sci.utah.edu.`,
        );
      }
    }
    return response.alttxt;
  }, [provObject?.provenance, data, rows]);

  if (data === null) return null;

  // if no data has been loaded or if the error/one-hot modal has been closed by the user
  if (
    ((!workspace || !table) && !doesHaveSavedQueryParam()) ||
    (encodedData !== null && data.setColumns.length === 0)
  ) {
    return <div>Please click Load Data button to go to data interface.</div>;
  }

  if (data.setColumns.length > 0) {
    saveQueryParam();
  }

  return (
    <div style={{ maxWidth: '100vw' }}>
      {data.setColumns.length === 0 ? (
        <ErrorModal />
      ) : (
        <div>
          <Backdrop open={loading} style={{ zIndex: 1000 }}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Upset
            data={data}
            extProvenance={provObject}
            canEditPlotInformation={permissions}
            config={config}
            provVis={provVis}
            elementSidebar={elementSidebar}
            altTextSidebar={altTextSidebar}
            footerHeight={FOOTER_HEIGHT}
            generateAltText={getAltText}
            visualizeUpsetAttributes
            allowAttributeRemoval
          />
        </div>
      )}
    </div>
  );
};

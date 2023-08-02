import { Upset } from '@visdesignlab/upset2-react';
import { UpsetConfig } from '@visdesignlab/upset2-core';
import { useRecoilValue, useRecoilState } from 'recoil';
import { encodedDataAtom } from '../atoms/dataAtom';
import { doesHaveSavedQueryParam, queryParamAtom } from '../atoms/queryParamAtom';
import { ErrorModal } from './ErrorModal';
import { ProvenanceContext } from './Root';
import { useContext } from 'react';
import { provenanceVisAtom } from '../atoms/provenanceVisAtom';
import React from 'react';
import { elementSidebarAtom } from '../atoms/elementSidebarAtom';

type Props = {
  yOffset: number;
  data: any;
  config?: UpsetConfig;
};

export const Body = ({ yOffset, data, config }: Props) => {
  const { workspace, table } = useRecoilValue(queryParamAtom);
  const provObject = useContext(ProvenanceContext);
  const encodedData = useRecoilValue(encodedDataAtom);
  const [ isProvVisOpen, setIsProvVisOpen ] = useRecoilState(provenanceVisAtom);
  const [ isElementSidebarOpen, setIsElementSidebarOpen ] = useRecoilState(elementSidebarAtom);

  const provVisObj = {
    open: isProvVisOpen,
    close: () => { setIsProvVisOpen(false) }
  }

  const elementSidebarObj = {
    open: isElementSidebarOpen,
    close: () => { setIsElementSidebarOpen(false) }
  }

  if (data === null) return null;

  // if no data has been loaded or if the error/one-hot modal has been closed by the user
  if (((!workspace || !table) && !doesHaveSavedQueryParam()) || (encodedData !== null && data.setColumns.length === 0)) {
    return <div>Please click Load Data button to go to data interface.</div>;
  }

  return (
    <div>
      { data.setColumns.length === 0 ?
        <ErrorModal />:
        <Upset
          data={data}
          loadAttributes={3}
          yOffset={yOffset === -1 ? 0 : yOffset}
          extProvenance={provObject}
          config={config}
          provVis={provVisObj}
          elementSidebar={elementSidebarObj}
        />
      }
    </div>
  );
};

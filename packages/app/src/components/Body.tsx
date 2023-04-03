import { Upset } from '@visdesignlab/upset2-react';
import { useRecoilValue } from 'recoil';
import { encodedDataAtom } from '../atoms/dataAtom';
import { doesHaveSavedQueryParam, queryParamAtom } from '../atoms/queryParamAtom';
import { ErrorModal } from './ErrorModal';
import { UpsetConfig } from '@visdesignlab/upset2-core';
import { ProvenanceContext } from './Root';
import { useContext } from 'react';

type Props = {
  yOffset: number;
  data: any;
  config?: UpsetConfig;
};

export const Body = ({ yOffset, data, config }: Props) => {
  const { workspace, table } = useRecoilValue(queryParamAtom);
  const { provenance, actions } = useContext(ProvenanceContext);

  const encodedData = useRecoilValue(encodedDataAtom);

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
        extProvenance={{provenance, actions}}
        config={config}
        />
      }
    </div>
  );
};

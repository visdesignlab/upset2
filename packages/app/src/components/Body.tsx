import { Upset } from '@visdesignlab/upset2-react';
import { useRecoilValue } from 'recoil';
import { dataSelector, encodedDataAtom } from '../atoms/dataAtom';
import { doesHaveSavedQueryParam, queryParamAtom } from '../atoms/queryParamAtom';
import { ErrorModal } from './ErrorModal';

type Props = {
  yOffset: number;
};

export const Body = ({ yOffset }: Props) => {
  const { workspace, table } = useRecoilValue(queryParamAtom);
  const multinetData = useRecoilValue(dataSelector);
  const encodedData = useRecoilValue(encodedDataAtom);
  const data = (encodedData === null) ? multinetData : encodedData
  
  if (data === null) return null;

  // if no data has been loaded or if the error/one-hot modal has been closed by the user
  if (((!workspace || !table) && !doesHaveSavedQueryParam()) || (encodedData !== null && data.setColumns.length === 0))
    return <div>Please click Load Data button to go to data interface.</div>;

  return (
    <div>
      { data.setColumns.length === 0 ?
        <ErrorModal />:
        <Upset
        data={data}
        loadAttributes={3}
        yOffset={yOffset === -1 ? 0 : yOffset}
        />
      }
    </div>
  );
};

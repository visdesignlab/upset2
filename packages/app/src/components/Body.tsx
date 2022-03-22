import { Upset } from '@visdesignlab/upset2-react';
import { useRecoilValue } from 'recoil';

import { dataAtom } from '../atoms/dataAtom';

type Props = {
  yOffset: number;
};

export const Body = ({ yOffset }: Props) => {
  const data = useRecoilValue(dataAtom);

  if (!data) return <div>Loading Data!</div>;

  return (
    <Upset
      data={data}
      loadAttributes={3}
      yOffset={yOffset === -1 ? 0 : yOffset}
    />
  );
};

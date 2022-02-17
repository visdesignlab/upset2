import { Box } from '@mui/material';
import { CoreUpsetData } from '@visdesignlab/upset2-core';
import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';

import { Root } from './Root';

export type UpsetProps = {
  parentHasHeight?: boolean;
  data: CoreUpsetData;
};

export const Upset: FC<UpsetProps> = ({ data, parentHasHeight = false }) => (
  <Box
    sx={{
      display: 'flex',
      height: parentHasHeight ? '100%' : '100vh',
      width: '100%',
    }}
  >
    <RecoilRoot>
      <Root data={data} />
    </RecoilRoot>
  </Box>
);

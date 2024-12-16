import { UpsetActions, UpsetProvenance } from '@visdesignlab/upset2-react';
import { UpsetConfig } from '@visdesignlab/upset2-core';
import { Box, css } from '@mui/material';
import {
  useMemo,
} from 'react';
import { Body } from './Body';
import Header from './Header';
import Footer from './Footer';
import { Home } from './Home';

type Props = {
    provenance: UpsetProvenance,
    actions: UpsetActions,
    data: any,
    config?: UpsetConfig
}

export const Root = ({
  provenance, actions, data, config,
}: Props) => {
  const AppCss = useMemo(() => css`
        overflow: ${data === null ? 'auto' : 'hidden'};
        height: 100vh;
        display: grid;
        grid-template-rows: min-content auto;
      `, [data]);

  return (
    <div css={AppCss}>
      <Box
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: 'relative',
        }}
      >
        <Header data={data} />
      </Box>
      {data === null && <Home />}
      <Body data={data} config={config} />
      <Footer />
    </div>
  );
};

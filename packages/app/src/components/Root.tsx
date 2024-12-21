import { UpsetActions, UpsetProvenance } from '@visdesignlab/upset2-react';
import { CoreUpsetData, UpsetConfig } from '@visdesignlab/upset2-core';
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
    data: CoreUpsetData | null,
    config?: UpsetConfig
}

/** Height for the footer */
export const FOOTER_HEIGHT = 46.5;

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
        {data && <Header data={data} />}
      </Box>
      {data ? <Body data={data} config={config} /> : <Home />}
      <Footer />
    </div>
  );
};

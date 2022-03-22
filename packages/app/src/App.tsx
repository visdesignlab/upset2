/** @jsxImportSource @emotion/react */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css } from '@emotion/react';
import { Box, CircularProgress } from '@mui/material';
import { Suspense, useEffect, useRef, useState } from 'react';

import { Body } from './components/Body';
import Header from './components/Header';

const AppCss = css`
  overflow: hidden;
  height: 100vh;
  display: grid;
  grid-template-rows: min-content auto;
`;

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(-1);

  useEffect(() => {
    const { current } = ref;
    if (!current) return;

    if (headerHeight > 0) return;

    setHeaderHeight(current.clientHeight);
  }, [headerHeight, ref]);

  return (
    <div css={AppCss}>
      <Box
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        ref={ref}
      >
        <Header />
      </Box>

      <Suspense
        fallback={
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <Body yOffset={headerHeight} />
      </Suspense>
    </div>
  );
}

export default App;

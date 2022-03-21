/** @jsxImportSource @emotion/react */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css } from '@emotion/react';
import { Box } from '@mui/material';
import { Upset } from '@visdesignlab/upset2-react';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { dataAtom } from './atoms/dataAtom';
import Header from './components/Header';

const AppCss = css`
  overflow: hidden;
  height: 100vh;
  display: grid;
  grid-template-rows: min-content auto;
`;

function App() {
  const data = useRecoilValue(dataAtom);
  const ref = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(-1);

  console.table(data);

  useEffect(() => {
    const { current } = ref;
    if (!current) return;

    if (headerHeight > 0) return;

    setHeaderHeight(current.clientHeight);
  }, [headerHeight, ref]);

  if (!data) return <div>No Data</div>;

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
      <Upset
        data={data}
        loadAttributes={3}
        yOffset={headerHeight === -1 ? 0 : headerHeight}
      />
    </div>
  );
}

export default App;

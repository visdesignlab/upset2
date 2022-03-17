/** @jsxImportSource @emotion/react */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css } from '@emotion/react';
import { Upset } from '@visdesignlab/upset2-react';
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

  if (!data) return <div>No Data</div>;

  return (
    <div css={AppCss}>
      <Header />
      <Upset data={data} />
    </div>
  );
}

export default App;

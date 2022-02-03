/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { CoreUpsetData } from '@visdesignlab/upset2-core';
import { FC, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { itemsAtom } from '../atoms/itemsAtoms';
import { renderRowSelector } from '../atoms/renderRowsAtom';
import { setsAtom } from '../atoms/setsAtoms';
import { Body } from './Body';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SvgBase } from './SvgBase';

const baseStyle = css`
  padding: 0.25em;
  border: 1px solid red;
`;

type Props = {
  data: CoreUpsetData;
};

export const Root: FC<Props> = ({ data }) => {
  const setSets = useRecoilState(setsAtom)[1];
  const setItems = useRecoilState(itemsAtom)[1];
  const renderRows = useRecoilValue(renderRowSelector);

  useEffect(() => {
    setSets(data.sets);
    setItems(data.items);
  }, [data, setSets, setItems]);

  const dimensions = useRecoilValue(dimensionsSelector);

  const { height, width, margin } = dimensions;

  console.table(Object.values(renderRows.values));

  return (
    <>
      <div
        css={css`
          flex: 0 0 auto;
          overflow: auto;
          ${baseStyle};
        `}
      >
        <Sidebar />
      </div>
      <div
        css={css`
          flex: 1 1 auto;
          overflow: auto;
          ${baseStyle};
        `}
      >
        <SvgBase defaultSettings={{ height, width, margin }}>
          <Header />
          <Body />
        </SvgBase>
      </div>
    </>
  );
};

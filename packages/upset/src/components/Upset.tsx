/** @jsxImportSource @emotion/react */
import React, { FC, useState } from 'react';
import { CoreUpsetData, getSubsets, Subsets } from '@visdesignlab/upset2-core';
import { Box } from '@mui/system';
import { css } from '@emotion/react';
import { SvgBase } from './SvgBase';
import { Header } from './Header';
import { useUpsetDimensions } from '../dimensions';
import { Body } from './Body';
import { defaultContext, UpsetContext } from '../context/UpsetContext';
import { RecoilRoot } from 'recoil';

export type UpsetProps = {
  parentHasHeight?: boolean;
  data: CoreUpsetData;
};

const baseStyle = css`
  padding: 0.25em;
  border: 1px solid red;
`;

export const Upset: FC<UpsetProps> = ({ data, parentHasHeight = false }) => {
  const { sets, items } = data;
  const [visibleSets, _] = useState<string[]>(Object.keys(sets).slice(0, 6));
  const [subsets, __] = useState<Subsets>(getSubsets(items, sets, visibleSets));

  const dimensions = useUpsetDimensions(
    visibleSets.length,
    Object.values(subsets).length,
  );
  const { height, width, margin } = dimensions;

  return (
    <Box
      sx={{
        display: 'flex',
        height: parentHasHeight ? '100%' : '100vh',
        width: '100%',
      }}
    >
      <UpsetContext.Provider
        value={{
          ...defaultContext,
          sets,
          items,
          subsets,
          visibleSets,
          dimensions,
        }}
      >
        <RecoilRoot>
          <div
            css={css`
              flex: 0 0 auto;
              ${baseStyle};
            `}
          >
            Side Bar
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
        </RecoilRoot>
      </UpsetContext.Provider>
    </Box>
  );
};

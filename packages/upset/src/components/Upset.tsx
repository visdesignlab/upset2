import { Box, ThemeProvider } from '@mui/material';
import { UpsetConfig, DefaultConfig } from '@visdesignlab/upset2-core';
import React, { FC, useMemo } from 'react';
import { RecoilRoot } from 'recoil';

import defaultTheme from '../utils/theme';
import { Root } from './Root';
import { UpsetProps } from '../types';

const defaultVisibleSets = 6;

/**
 * Renders the Upset component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data for the Upset component.
 * @param {boolean} [props.parentHasHeight=false] - Indicates if the parent has a fixed height.
 * @param {number} [props.yOffset=0] - The offset from the top of the viewport.
 * @param {Object} [props.config={}] - The configuration options for the Upset component.
 * @param {number} [props.loadAttributes=0] - The number of attributes to load.
 * @param {Object} [props.extProvenance] - The external provenance data.
 * @param {Object} [props.provVis] - The provenance visualization options.
 * @param {Object} [props.elementSidebar] - The element sidebar options.
 * @param {Object} [props.altTextSidebar] - The alternative text sidebar options.
 * @param {Function} [props.generateAltText] - The function to generate alternative text.
 * @returns {JSX.Element} The rendered Upset component.
 */
export const Upset: FC<UpsetProps> = ({
  data,
  parentHasHeight = false,
  yOffset = 0,
  config = {},
  loadAttributes = 0,
  extProvenance,
  provVis,
  elementSidebar,
  altTextSidebar,
  generateAltText,
}) => {
  // Combine the partial config and add visible sets if empty
  // Also add missing attributes if specified
  const combinedConfig = useMemo(() => {
    const conf: UpsetConfig = { ...DefaultConfig, ...config };

    if (conf.visibleSets.length === 0) {
      const setList = Object.entries(data.sets);
      conf.visibleSets = setList.slice(0, defaultVisibleSets).map((set) => set[0]); // get first 6 set names
      conf.allSets = setList.map((set) => ({ name: set[0], size: set[1].size }));
    }

    conf.visibleAttributes = [...DefaultConfig.visibleAttributes, ...data.attributeColumns.slice(0, loadAttributes)];

    return conf;
  }, [data, config]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          display: 'flex',
          height: parentHasHeight ? '100%' : `calc(100vh - ${yOffset}px)`,
          width: '100%',
          fontFamily: 'Roboto, Arial',
        }}
      >
        <RecoilRoot>
          <Root
            data={data}
            config={combinedConfig}
            extProvenance={extProvenance}
            provVis={provVis}
            elementSidebar={elementSidebar}
            altTextSidebar={altTextSidebar}
            generateAltText={generateAltText}
          />
        </RecoilRoot>
      </Box>
    </ThemeProvider>
  );
};

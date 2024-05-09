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
 * @param {Object} data - The data for the Upset component.
 * @param {boolean} [parentHasHeight=false] - Indicates if the parent has a fixed height.
 * @param {number} [yOffset=0] - The offset from the top of the viewport.
 * @param {Object} [config={}] - The configuration options for the Upset component.
 * @param {string[]} [visualizeAttributes] - The number of attributes to load.
 * @param {boolean} [visualizeUpsetAttributes=false] - Whether or not to visualize Degree and Deviation.
 * @param {boolean} [allowAttributeRemoval=false] - Option for allowing attribute removal.
 * @param {boolean} [hideSettings] - Option for hiding the settings sidebar.
 * @param {Object} [extProvenance] - The external provenance data.
 * @param {Object} [provVis] - The provenance visualization options.
 * @param {Object} [elementSidebar] - The element sidebar options.
 * @param {Object} [altTextSidebar] - The alternative text sidebar options.
 * @param {Function} [generateAltText] - The function to generate alternative text.
 * @returns {JSX.Element} The rendered Upset component.
 */
export const Upset: FC<UpsetProps> = ({
  data,
  parentHasHeight = false,
  yOffset = 0,
  config = {},
  visualizeDatasetAttributes,
  visualizeUpsetAttributes = false,
  allowAttributeRemoval = false,
  hideSettings,
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

    const defaultNumAttributes = 3;

    if (conf.visibleSets.length === 0) {
      const setList = Object.entries(data.sets);
      conf.visibleSets = setList.slice(0, defaultVisibleSets).map((set) => set[0]); // get first 6 set names
      conf.allSets = setList.map((set) => ({ name: set[0], size: set[1].size }));
    }

    const defaultAttributes = (visualizeUpsetAttributes) ? DefaultConfig.visibleAttributes : [];

    /**
     * visualizeAttributes can either be undefined or an array of strings
     * if visualizeAttributes is undefined, load the first 3 attributes by default
     */
    if (visualizeDatasetAttributes) {
      conf.visibleAttributes = [
        ...defaultAttributes,
        ...visualizeDatasetAttributes.filter((attr) => data.attributeColumns.includes(attr)),
      ];
    }

    /**
     * if visualizeAttributes is an array of strings, load the specified attributes
     * if visualizeAttributes is an empty array, load no attributes
     */
    else {
      conf.visibleAttributes = [
        ...defaultAttributes,
        ...data.attributeColumns.slice(0, defaultNumAttributes),
      ];
    }

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
            allowAttributeRemoval={allowAttributeRemoval}
            hideSettings={hideSettings}
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

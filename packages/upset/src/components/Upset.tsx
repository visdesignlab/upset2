import { Box, ThemeProvider } from '@mui/material';
import { CoreUpsetData, UpsetConfig } from '@visdesignlab/upset2-core';
import { FC, useMemo } from 'react';
import { RecoilRoot } from 'recoil';

import { defaultConfig } from '../atoms/config/upsetConfigAtoms';
import { UpsetActions, UpsetProvenance } from '../provenance';
import defaultTheme from '../utils/theme';
import { Root } from './Root';

export type UpsetProps = {
  parentHasHeight?: boolean;
  data: CoreUpsetData;
  config?: Partial<UpsetConfig>;
  loadAttributes?: number;
  extProvenance?: {
    provenance: UpsetProvenance;
    actions: UpsetActions;
  };
  yOffset?: number;
  provVis?: {
    open: boolean;
    close: () => void;
  };
  elementSidebar?: {
    open: boolean;
    close: () => void;
  };
  altTextSidebar?: {
    open: boolean;
    close: () => void;
  };
  generateAltText?: () => Promise<string>;
};

const defaultVisibleSets = 6;

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
    const conf: UpsetConfig = { ...defaultConfig, ...config };

    if (conf.visibleSets.length === 0) {
      const setList = Object.entries(data.sets);
      conf.visibleSets = setList.slice(0, defaultVisibleSets).map((set) => set[0]); // get first 6 set names
      conf.allSets = setList.map((set) => ({ name: set[0], size: set[1].size }));
    }

    conf.visibleAttributes = data.attributeColumns.slice(0, loadAttributes);

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

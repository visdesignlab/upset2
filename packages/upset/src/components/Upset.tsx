import { Box, ThemeProvider } from '@mui/material';
import { CoreUpsetData, UpsetConfig } from '@visdesignlab/upset2-core';
import React, { createContext, FC, useEffect, useMemo } from 'react';
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
};

export const Upset: FC<UpsetProps> = ({
  data,
  parentHasHeight = false,
  config = {},
  loadAttributes = 0,
  extProvenance,
}) => {
  // Combine the partial config and add visible sets if empty
  // Also add missing attributes if specified
  const combinedConfig = useMemo(() => {
    const conf: UpsetConfig = { ...defaultConfig, ...config };

    if (conf.visibleSets.length === 0) {
      const setList = Object.keys(data.sets);
      conf.visibleSets = setList.slice(0, 6);
    }

    conf.visibleAttributes = data.attributeColumns.slice(0, loadAttributes);

    return conf;
  }, [data, config]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          display: 'flex',
          height: parentHasHeight ? '100%' : '100vh',
          width: '100%',
          fontFamily: 'Roboto, Arial',
        }}
      >
        <RecoilRoot>
          <Root
            data={data}
            config={combinedConfig}
            extProvenance={extProvenance}
          />
        </RecoilRoot>
      </Box>
    </ThemeProvider>
  );
};

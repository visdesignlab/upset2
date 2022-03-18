import { Divider, Drawer, Typography } from '@mui/material';

import { ElementQueries } from './ElementQueries';

const drawerWidth = 450;

/** @jsxImportSource @emotion/react */
export const ElementSidebar = () => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          padding: '1em',
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      open
      variant="persistent"
      anchor="right"
    >
      <Typography variant="button" fontSize="1em">
        Element Queries
      </Typography>
      <Divider />
      <ElementQueries />
      <Divider />
    </Drawer>
  );
};

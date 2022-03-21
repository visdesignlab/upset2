import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Divider, Drawer, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { currentIntersectionAtom } from '../../atoms/config/currentIntersectionAtom';
import { ElementQueries } from './ElementQueries';
import { ElementTable } from './ElementTable';
import { ElementVisualization } from './ElementVisualization';

const drawerWidth = 450;

/** @jsxImportSource @emotion/react */
export const ElementSidebar = () => {
  const [expand, setExpand] = useState(false);
  const currentIntersection = useRecoilValue(currentIntersectionAtom);

  return (
    <Drawer
      sx={{
        width: expand ? '100%' : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          padding: '1em',
          width: expand ? '100%' : drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      open
      variant="persistent"
      anchor="right"
    >
      <div>
        <IconButton onClick={() => setExpand(!expand)}>
          {expand ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      <Typography variant="button" fontSize="1em">
        Element Queries
      </Typography>
      <Divider />
      <ElementQueries />
      <Typography variant="button" fontSize="1em">
        Element Visualization
      </Typography>
      <Divider />
      <ElementVisualization />
      <Typography variant="button" fontSize="1em">
        Query Result
      </Typography>
      <Divider />
      {currentIntersection ? (
        <ElementTable id={currentIntersection.id} />
      ) : (
        <Typography color="gray" sx={{ padding: '0.5em' }}>
          Please select an query to view the elements.
        </Typography>
      )}
    </Drawer>
  );
};

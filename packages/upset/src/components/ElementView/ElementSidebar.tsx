import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { Divider, Drawer, Fab, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { currentIntersectionAtom } from '../../atoms/config/currentIntersectionAtom';
import { ElementQueries } from './ElementQueries';
import { ElementTable } from './ElementTable';
import { ElementVisualization } from './ElementVisualization';

/** @jsxImportSource @emotion/react */
export const ElementSidebar = ({
  width,
  yOffset,
}: {
  width: number;
  yOffset: number;
}) => {
  const [fullWidth, setFullWidth] = useState(false);
  const [hide, setHide] = useState(false);
  const currentIntersection = useRecoilValue(currentIntersectionAtom);

  return (
    <>
      <Drawer
        sx={{
          width: hide ? 0 : fullWidth ? '100%' : width,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            padding: '1em',
            paddingTop: `${yOffset}px`,
            width: hide ? 0 : fullWidth ? '100%' : width,
            visibility: hide ? 'hidden' : 'initial',
            boxSizing: 'border-box',
          },
        }}
        open
        variant="persistent"
        anchor="right"
      >
        <div>
          <IconButton
            onClick={() => {
              setFullWidth(true);
            }}
            disabled={fullWidth}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              if (fullWidth) {
                setFullWidth(false);
              } else {
                setHide(true);
              }
            }}
          >
            <ChevronRightIcon />
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
      {hide && (
        <Fab
          sx={{ position: 'absolute', right: 0, opacity: 0.5 }}
          aria-label="add"
          onClick={() => setHide(false)}
        >
          <MenuIcon />
        </Fab>
      )}
    </>
  );
};

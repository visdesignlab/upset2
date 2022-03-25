import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Divider, Drawer, Fab, IconButton, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { currentIntersectionAtom } from '../../atoms/config/currentIntersectionAtom';
import { ElementQueries } from './ElementQueries';
import { ElementTable } from './ElementTable';
import { ElementVisualization } from './ElementVisualization';

const initialDrawerWidth = 450;
const minDrawerWidth = 100;

/** @jsxImportSource @emotion/react */
export const ElementSidebar = ({ yOffset }: { yOffset: number }) => {
  const [fullWidth, setFullWidth] = useState(false);
  const [hide, setHide] = useState(false);
  const currentIntersection = useRecoilValue(currentIntersectionAtom);
  const [drawerWidth, setDrawerWidth] = useState(initialDrawerWidth);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const newWidth = document.body.clientWidth - e.clientX;

    console.log(document.body.clientWidth, document.body.offsetWidth);
    if (newWidth > minDrawerWidth) {
      setDrawerWidth(newWidth);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('mousemove', handleMouseMove, true);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      document.addEventListener('mouseup', handleMouseUp, true);
      document.addEventListener('mousemove', handleMouseMove, true);
    },
    [handleMouseUp, handleMouseMove],
  );

  return (
    <>
      <Drawer
        sx={{
          width: hide ? 0 : fullWidth ? '100%' : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            padding: '1em',
            paddingTop: `${yOffset}px`,
            width: hide ? 0 : fullWidth ? '100%' : drawerWidth,
            visibility: hide ? 'hidden' : 'initial',
            boxSizing: 'border-box',
          },
        }}
        open
        variant="persistent"
        anchor="right"
      >
        <Box
          sx={{
            width: '5px',
            cursor: 'ew-resize',
            padding: '4px 0 0',
            borderTop: '1px solid #ddd',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: 100,
            backgroundColor: '#f4f7f9',
          }}
          onMouseDown={(e) => handleMouseDown(e)}
        />
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

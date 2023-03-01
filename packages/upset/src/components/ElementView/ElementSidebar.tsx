import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreen from '@mui/icons-material/CloseFullscreen';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Divider, Drawer, Fab, IconButton, Tooltip, Typography, css } from '@mui/material';
import { Item } from '@visdesignlab/upset2-core';
import React, { useCallback, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { columnsAtom } from '../../atoms/columnAtom';
import { currentIntersectionAtom } from '../../atoms/config/currentIntersectionAtom';
import { elementSelector, intersectionCountSelector } from '../../atoms/elementsSelectors';
import { ElementQueries } from './ElementQueries';
import { ElementTable } from './ElementTable';
import { ElementVisualization } from './ElementVisualization';
import { elementSidebarAtom } from '../../atoms/elementSidebarAtom';

const initialDrawerWidth = 450;
const minDrawerWidth = 100;

function downloadElementsAsCSV(items: Item[], columns: string[], name: string) {
  if (items.length < 1 || columns.length < 1) return;

  console.group(name);
  console.log(columns);
  console.table(items.filter((_, idx) => idx < 10));

  const saveText: string[] = [];

  saveText.push(columns.map(h => (h.includes(',') ? `"${h}"` : h)).join(','));

  items.forEach(item => {
    const row: string[] = [];

    columns.forEach(col => {
      row.push(item[col]?.toString() || '-');
    });

    saveText.push(row.map(r => (r.includes(',') ? `"${r}"` : r)).join(','));
  });

  console.log(saveText);
  console.groupEnd();

  const blob = new Blob([saveText.join('\n')], { type: 'text/csv' });
  const blobUrl = URL.createObjectURL(blob);

  const anchor: any = document.createElement('a');
  anchor.style = 'display: none';
  document.body.appendChild(anchor);
  anchor.href = blobUrl;
  anchor.download = `${name}_${Date.now()}.csv`;
  anchor.click();
  anchor.remove();
}

/** @jsxImportSource @emotion/react */
export const ElementSidebar = ({ yOffset }: { yOffset: number }) => {
  const [fullWidth, setFullWidth] = useState(false);
  const [ hideElementSidebar, setHideElementSidebar] = useRecoilState(elementSidebarAtom);
  const currentIntersection = useRecoilValue(currentIntersectionAtom);
  const [drawerWidth, setDrawerWidth] = useState(initialDrawerWidth);
  const intersectionCounter = useRecoilValue(
    intersectionCountSelector(currentIntersection?.id),
  );
  const currentIntersectionElements = useRecoilValue(
    elementSelector(currentIntersection?.id),
  );

  const columns = useRecoilValue(columnsAtom);

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
          width: hideElementSidebar ? 0 : fullWidth ? '100%' : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            padding: '1em',
            paddingTop: `${yOffset}px`,
            width: hideElementSidebar ? 0 : fullWidth ? '100%' : drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        open={!hideElementSidebar}
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
          onMouseDown={e => handleMouseDown(e)}
        />
        <div css={css`
          display: flex;
          justify-content: space-between;
        `}>
          { !fullWidth ?
          <IconButton
            onClick={() => {
              setFullWidth(true);
            }}
          >
            <OpenInFullIcon />
          </IconButton>
          : <IconButton
            onClick={() => {
              if (fullWidth) {
                setFullWidth(false);
              } else {
                setHideElementSidebar(true);
              }
            }}
          >
            <CloseFullscreen />
          </IconButton>
          }
          <IconButton
            onClick={() => {
              setHideElementSidebar(true);
            }}
          >
            <CloseIcon />
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
          <Tooltip
            title={
              currentIntersection
                ? `Download ${intersectionCounter} elements`
                : ''
            }
          >
            <IconButton
              disabled={!currentIntersection}
              onClick={() => {
                if (currentIntersection)
                  downloadElementsAsCSV(
                    currentIntersectionElements,
                    columns,
                    currentIntersection.elementName,
                  );
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
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
      {hideElementSidebar && (
        <Fab
          sx={{ position: 'absolute', right: 0, opacity: 0.5 }}
          aria-label="add"
          onClick={() => setHideElementSidebar(false)}
        >
          <MenuIcon />
        </Fab>
      )}
    </>
  );
};

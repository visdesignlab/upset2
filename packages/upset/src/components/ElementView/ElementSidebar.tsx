import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreen from '@mui/icons-material/CloseFullscreen';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box, Divider, Drawer, IconButton, Tooltip, Typography, css,
} from '@mui/material';
import { Item } from '@visdesignlab/upset2-core';
import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { useRecoilValue } from 'recoil';

import { columnsAtom } from '../../atoms/columnAtom';
import {
  selectedElementSelector, selectedItemsCounter,
  selectedItemsSelector,
} from '../../atoms/elementsSelectors';
import { BookmarkChips } from './BookmarkChips';
import { ElementTable } from './ElementTable';
import { ElementVisualization } from './ElementVisualization';
import { UpsetActions } from '../../provenance';
import { ProvenanceContext } from '../Root';
import { QueryInterface } from './QueryInterface';

/**
 * Props for the ElementSidebar component
 */
type Props = {
  /** Whether the sidebar is open */
  open: boolean,
  /** Function to close the sidebar */
  close: () => void
}

const initialDrawerWidth = 450;
const minDrawerWidth = 100;

/**
 * Immediately downloads a csv containing items with the given columns
 * @param items Rows to download
 * @param columns Data attributes to download
 * @param name Name of the file
 */
function downloadElementsAsCSV(items: Item[], columns: string[], name: string) {
  if (items.length < 1 || columns.length < 1) return;

  const saveText: string[] = [];

  saveText.push(columns.map((h) => (h.includes(',') ? `"${h}"` : h)).join(','));

  items.forEach((item) => {
    const row: string[] = [];

    columns.forEach((col) => {
      row.push(item[col]?.toString() || '-');
    });

    saveText.push(row.map((r) => (r.includes(',') ? `"${r}"` : r)).join(','));
  });

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
/**
 * Sidebar component for the Element View
 * @param open Whether the sidebar is open
 * @param close Function to close the sidebar
 */
export const ElementSidebar = ({ open, close }: Props) => {
  const [fullWidth, setFullWidth] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(initialDrawerWidth);
  const currentSelection = useRecoilValue(selectedElementSelector);
  const selectedItems = useRecoilValue(selectedItemsSelector);
  const itemCount = useRecoilValue(selectedItemsCounter);
  const columns = useRecoilValue(columnsAtom);
  const [hideElementSidebar, setHideElementSidebar] = useState(!open);
  const { actions }: {actions: UpsetActions} = useContext(ProvenanceContext);

  /**
   * Effects
   */

  useEffect(() => {
    setHideElementSidebar(!open);
  }, [open]);

  /**
   * Callbacks
   */

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const newWidth = document.body.clientWidth - e.clientX;

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
    <Drawer
      aria-hidden={!open}
      sx={{
        width: hideElementSidebar ? 0 : fullWidth ? '100%' : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          padding: '1em',
          marginTop: '2em',
          width: hideElementSidebar ? 0 : fullWidth ? '100%' : drawerWidth,
          boxSizing: 'border-box',
          zIndex: 0,
        },
      }}
      open={open}
      onClose={close}
      variant="persistent"
      anchor="right"
      aria-label="Element View sidebar"
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
          // I cannot comprehend why this is the value that works. It is.
          // The 'rows per page' controls overflow otherwise (:
          paddingBottom: '1625px',
        }}
        onMouseDown={(e) => handleMouseDown(e)}
      />
      <div css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        { !fullWidth ?
          <IconButton
            onClick={() => {
              setFullWidth(true);
            }}
            aria-label="Expand the sidebar in full screen"
          >
            <OpenInFullIcon />
          </IconButton>
          :
          <IconButton
            onClick={() => {
              if (fullWidth) {
                setFullWidth(false);
              } else {
                setHideElementSidebar(true);
              }
            }}
            aria-label="Reduce the sidebar to normal size"
          >
            <CloseFullscreen />
          </IconButton>}
        <IconButton
          onClick={() => {
            setHideElementSidebar(true);
            actions.setElementSelection(currentSelection);
            close();
          }}
          aria-label="Close the sidebar"
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div style={{ marginBottom: '1em' }}>
        <Typography variant="h2" fontSize="1.2em" fontWeight="inherit" gutterBottom>
          Element View
        </Typography>
        <Divider />
      </div>
      <Typography variant="h3" fontSize="1.2em">
        Bookmarked Queries
      </Typography>
      <Divider />
      <BookmarkChips />
      <Typography variant="h3" fontSize="1.2em">
        Element Visualization
      </Typography>
      <Divider />
      <ElementVisualization />
      <Typography variant="h3" fontSize="1.2em">
        Element Queries
      </Typography>
      <Divider />
      <QueryInterface />
      <Typography variant="h3" fontSize="1.2em">
        Query Result
        <Tooltip title={`Download ${itemCount} elements`}>
          <IconButton
            onClick={() => {
              downloadElementsAsCSV(
                selectedItems,
                columns,
                currentSelection?.label ?? 'upset_elements',
              );
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      <Divider />
      <ElementTable />
    </Drawer>
  );
};

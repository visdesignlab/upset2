import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreen from '@mui/icons-material/CloseFullscreen';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box, Drawer, IconButton, Tooltip,
} from '@mui/material';
import React, {
  FC, PropsWithChildren, useCallback, useState,
} from 'react';
import { useRecoilValue } from 'recoil';
import { footerHeightAtom } from '../../atoms/dimensionsAtom';

type Props= {
  /** Whether the sidebar is open */
  open: boolean;
  /** Function to close the sidebar */
  close: () => void;
  /** Tab index for the close button */
  closeButtonTabIndex?: number;
  /** Aria-label for the sidebar */
  label: string;
  /** Buttons to display at the top of the sidebar, left of the close & expand */
  buttons?: React.ReactNode;
}

/** Dimension for the square button wrappers */
const BUTTON_DIMS = { height: '40px', width: '40px' };

/**
 * A collapsible, right-sidebar for the plot
 */
export const Sidebar: FC<PropsWithChildren<Props>> = ({
  open, close, closeButtonTabIndex, children, label, buttons,
}) => {
  /** Chosen so we don't get a horizontal scrollbar in the element view table */
  const INITIAL_DRAWER_WIDTH = 462;
  /** Chosen so we don't get a new line for the "Apply" button in the element query controls */
  const MIN_DRAWER_WIDTH = 368;

  const [fullWidth, setFullWidth] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(INITIAL_DRAWER_WIDTH);
  const footerHeight = useRecoilValue(footerHeightAtom);

  /**
   * Callbacks
   */

  /**
   * Only fires when the user drags the side of the sidebar; resizes the sidebar
   */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const newWidth = document.body.clientWidth - e.clientX;

    if (newWidth > MIN_DRAWER_WIDTH) {
      setDrawerWidth(newWidth);
    }
  }, [document.body.clientWidth]);

  /**
   * Unattaches itself and handleMouseMove from document when the user stops dragging the sidebar
   */
  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('mousemove', handleMouseMove, true);
  }, [handleMouseMove, document]);

  /**
   * Enables dragging when the user clicks the side of the drawer
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      document.addEventListener('mouseup', handleMouseUp, true);
      document.addEventListener('mousemove', handleMouseMove, true);
    },
    [handleMouseUp, handleMouseMove, document],
  );

  return (
    <Drawer
      aria-hidden={!open}
      sx={{
        width: open ? fullWidth ? '100%' : drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          padding: '1em',
          marginTop: '2em',
          width: open ? fullWidth ? '100%' : drawerWidth : 0,
          boxSizing: 'border-box',
          zIndex: 1,
          paddingTop: '25px',
        },
      }}
      open={open}
      onClose={close}
      variant="persistent"
      anchor="right"
      aria-label={label}
    >
      <Box
        sx={{
          width: '5px',
          cursor: fullWidth ? 'auto' : 'ew-resize',
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
      <div style={{
        display: 'flex', justifyContent: 'end', position: 'absolute', top: '20px', right: 0,
      }}
      >
        {buttons}
        { !fullWidth ?
          <Tooltip title="Expand to full screen">
            <IconButton
              style={BUTTON_DIMS} // Necessary so that the shadow remains square even when we change the font size
              onClick={() => {
                setFullWidth(true);
              }}
              aria-label="Expand the sidebar in full screen"
            >
              {/* CRAZY, I know. 1 font size px changes the icon SVG dimensions (square) by .75px. So this is
            EXACTLY the font size needed to get this icon SVG to be the same dimensions as the close button: 14x14 */}
              <OpenInFullIcon style={{ fontSize: '18.67px' }} />
            </IconButton>
          </Tooltip>
          :
          <Tooltip title="Reduce to normal size">
            <IconButton
              style={BUTTON_DIMS} // Not actually necessary (it's 40*40 by default) but it's here for consistency
              onClick={() => {
                if (fullWidth) {
                  setFullWidth(false);
                }
              }}
              aria-label="Reduce the sidebar to normal size"
            >
              <CloseFullscreen />
            </IconButton>
          </Tooltip>}
        <Tooltip title="Close">
          <IconButton
            onClick={() => {
              close();
            }}
            tabIndex={closeButtonTabIndex}
            aria-label="Close the sidebar"
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      {children}
      <Box minHeight={footerHeight} />
    </Drawer>
  );
};

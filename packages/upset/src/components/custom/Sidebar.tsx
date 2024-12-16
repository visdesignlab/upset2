import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreen from '@mui/icons-material/CloseFullscreen';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Drawer, IconButton } from '@mui/material';
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
}

/**
 * A collapsible, right-sidebar for the plot
 */
export const Sidebar: FC<PropsWithChildren<Props>> = ({
  open, close, closeButtonTabIndex, children,
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
        width: fullWidth ? '100%' : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          padding: '1em',
          marginTop: '2em',
          width: fullWidth ? '100%' : drawerWidth,
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
              }
            }}
            aria-label="Reduce the sidebar to normal size"
          >
            <CloseFullscreen />
          </IconButton>}
        <IconButton
          onClick={() => {
            close();
          }}
          tabIndex={closeButtonTabIndex}
          aria-label="Close the sidebar"
        >
          <CloseIcon />
        </IconButton>
      </div>
      {children}
      <Box minHeight={footerHeight} />
    </Drawer>
  );
};

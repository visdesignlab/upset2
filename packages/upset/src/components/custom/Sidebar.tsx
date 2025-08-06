import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreen from '@mui/icons-material/CloseFullscreen';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Divider, Drawer, IconButton, Tooltip } from '@mui/material';
import React, { FC, PropsWithChildren, useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { footerHeightAtom } from '../../atoms/dimensionsAtom';
import { UpsetHeading } from './theme/heading';

type Props = {
  /** Whether the sidebar is open */
  open: boolean;
  /** Function to close the sidebar */
  close: () => void;
  /** Tab index for the close button */
  closeButtonTabIndex?: number;
  /** Aria-label for the sidebar */
  label: string;
  /** Title for the sidebar, to be displayed at the top */
  title: string;
  /** Buttons to display at the top of the sidebar, left of the close & expand */
  buttons?: React.ReactNode;
  /** Whether the app is embedded, which disables closing and removes top margin */
  embedded?: boolean;
};

/** Dimension for the square button wrappers */
const BUTTON_DIMS = { height: '40px', width: '40px' };

/**
 * A collapsible, right-sidebar for the plot
 */
export const Sidebar: FC<PropsWithChildren<Props>> = ({
  open,
  close,
  closeButtonTabIndex,
  children,
  label,
  title,
  buttons,
  embedded = false, // Default to false for non-embed mode
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
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const newWidth = document.body.clientWidth - e.clientX;

      if (newWidth > MIN_DRAWER_WIDTH) {
        setDrawerWidth(newWidth);
      }
    },
    [setDrawerWidth],
  );

  /**
   * Unattaches itself and handleMouseMove from document when the user stops dragging the sidebar
   */
  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('mousemove', handleMouseMove, true);
  }, [handleMouseMove]);

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
    [handleMouseUp, handleMouseMove],
  );

  return (
    <Drawer
      aria-hidden={!open}
      sx={{
        width: open ? (fullWidth ? '100%' : drawerWidth) : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          padding: '1em',
          marginTop: embedded ? 0 : '2em',
          width: open ? (fullWidth ? '100%' : drawerWidth) : 0,
          boxSizing: 'border-box',
          zIndex: 1,
          // Allow the inner div to handle scroll and right padding (so scrollbar isn't padded out from the edge)
          overflow: 'hidden',
          paddingRight: 0,
        },
      }}
      open={open}
      onClose={close}
      variant="persistent"
      anchor="right"
      aria-label={label}
      // This disables the slide in-out animation
      // If you want all sidebars to have the slide animation, remove this; but you also will
      // need to change the rendering of ElementSidebar so that it's always rendered, not just
      // when elementSidebar.open (in Root.tsx 190)
      transitionDuration={0}
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
      <div
        style={{
          // Padding necessary to match the rest of the drawer
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '1em',
        }}
      >
        <Box display="flex" flexWrap="nowrap" flexDirection="row">
          <div
            style={{
              minWidth: 0,
              alignSelf: 'center',
              flexGrow: 1,
              flexShrink: 1,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <UpsetHeading
              level="h1"
              hideDivider
              divStyle={{ marginBottom: 0, width: '100%' }}
              headingStyle={{
                marginBottom: 0,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                width: '100%',
              }}
            >
              {title}
            </UpsetHeading>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              flexGrow: 0,
              flexShrink: 0,
              alignSelf: 'end',
            }}
          >
            {buttons}
            {!fullWidth ? (
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
            ) : (
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
              </Tooltip>
            )}
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
        </Box>
        <Divider
          style={{ width: '100%', margin: '0 auto', marginBottom: '1em' }}
          aria-hidden
        />
        {children}
        <Box minHeight={footerHeight} />
      </div>
    </Drawer>
  );
};

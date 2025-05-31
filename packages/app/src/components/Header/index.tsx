import { exportState, downloadSVG } from '@visdesignlab/upset2-react';
import { Column, CoreUpsetData } from '@visdesignlab/upset2-core';
import { UserSpec } from 'multinet';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import { AccountCircle, ErrorOutline } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRecoilValue, useRecoilState } from 'recoil';
import React, { useContext, useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { queryParamAtom, restoreQueryParam } from '../../atoms/queryParamAtom';
import { provenanceVisAtom } from '../../atoms/provenanceVisAtom';
import { elementSidebarAtom } from '../../atoms/elementSidebarAtom';
import { ProvenanceContext } from '../../provenance';
import { ImportModal } from '../ImportModal';
import { importErrorAtom } from '../../atoms/importErrorAtom';
import { altTextSidebarAtom } from '../../atoms/altTextSidebarAtom';
import { getMultinetDataUrl } from '../../api/getMultinetDataUrl';
import { getUserInfo } from '../../api/getUserInfo';
import { oAuth } from '../../api/auth';
import { rowsSelector } from '../../atoms/selectors';
import { DataTableLink } from '../../utils/DataTableLink';
// @ts-expect-error ts doesn't know about SVG imports
import vdlFlask from '../../assets/vdl_flask.svg';

/**
 * Header component; displays above the plot
 */
const Header = ({ data }: { data: CoreUpsetData }) => {
  const { workspace } = useRecoilValue(queryParamAtom);
  const [isProvVisOpen, setIsProvVisOpen] = useRecoilState(provenanceVisAtom);
  const [isElementSidebarOpen, setIsElementSidebarOpen] =
    useRecoilState(elementSidebarAtom);
  const [isAltTextSidebarOpen, setIsAltTextSidebarOpen] =
    useRecoilState(altTextSidebarAtom);
  const importError = useRecoilValue(importErrorAtom);

  const { provenance } = useContext(ProvenanceContext);
  const rows = useRecoilValue(rowsSelector);

  const [showImportModal, setShowImportModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();

  const { visibleSets } = provenance.getState();
  const hiddenSets = provenance
    .getState()
    .allSets.filter((set: Column) => !visibleSets.includes(set.name));

  /**
   * Number of keyboard tab indices in the alttext sidebar; used to calculate the tab index of the other buttons
   * because alttext sidebar should get priority when open. This should be updated if more tab indices are added.
   * "Tab indicies" refers to the number of tabIndex properties on elements in the sidebar
   * @see AltTextSidebar to count the number of tab indices used
   */
  const ALTTEXT_SIDEBAR_TABS = isAltTextSidebarOpen ? 18 : 0;

  const handleImportModalClose = () => {
    setShowImportModal(false);
  };

  const handleMenuOpen = (target: EventTarget) => {
    setAnchorEl(target as HTMLElement);
    setIsMenuOpen(true);
  };

  const handleMenuClick = (target: EventTarget) => {
    handleMenuOpen(target);
  };

  const handleMenuKeypress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleMenuOpen(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleLoginOpen = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
    setLoginMenuOpen(true);
  };

  const handleLoginClose = () => {
    setAnchorEl(null);
    setLoginMenuOpen(false);
  };

  const closeAnySidebar = () => {
    if (isProvVisOpen) {
      setIsProvVisOpen(false);
    }
    if (isElementSidebarOpen) {
      setIsElementSidebarOpen(false);
    }
    if (isAltTextSidebarOpen) {
      setIsAltTextSidebarOpen(false);
    }
  };

  const [userInfo, setUserInfo] = useState<UserSpec | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const retrievedInfo = await getUserInfo();
      setUserInfo(retrievedInfo);
    };

    fetchInfo();
  }, []);

  const [trrackPosition, setTrrackPosition] = useState({
    isAtLatest: true,
    isAtRoot: true,
  });

  useEffect(() => {
    provenance.currentChange(() => {
      setTrrackPosition({
        isAtLatest: provenance.current.children.length === 0,
        isAtRoot: provenance.current.id === provenance.root.id,
      });
    });
  }, []);

  return (
    <AppBar sx={{ position: 'static', boxShadow: 'none', height: '48px' }}>
      <Toolbar
        variant="dense"
        sx={{
          width: '98vw',
          backgroundColor: '#e0e0e0',
          color: 'rgba(0, 0, 0, 0.87)',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexGrow: '1',
            justifyContent: 'start',
            alignItems: 'center',
            margin: 0,
            padding: 0,
          }}
        >
          <img
            className="logo"
            id="multinet-logo"
            src={vdlFlask}
            alt="Multinet Logo"
            // Puts the flask a bit more in line with the text
            style={{ paddingBottom: '4px' }}
          />
          <Typography
            id="upset-title"
            variant="h1"
            noWrap
            component="div"
            sx={{
              marginRight: '5px',
              lineHeight: '1.5',
              fontWeight: 'normal',
              fontSize: '1.3em',
            }}
          >
            Upset — Visualizing Intersecting Sets
          </Typography>
          <ButtonGroup>
            <Tooltip title="Undo">
              <IconButton
                color="inherit"
                onClick={() => provenance.undo()}
                disabled={trrackPosition.isAtRoot}
                aria-label="Undo"
              >
                <UndoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
              <IconButton
                color="inherit"
                onClick={() => provenance.redo()}
                disabled={trrackPosition.isAtLatest}
                aria-label="Redo"
              >
                <RedoIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            margin: 0,
            padding: 0,
          }}
        >
          {data !== null && (
            <>
              <Button
                color="inherit"
                onClick={() => {
                  closeAnySidebar();

                  if (isAltTextSidebarOpen) {
                    setIsAltTextSidebarOpen(false);
                  } else {
                    setIsAltTextSidebarOpen(true);
                  }
                }}
                aria-label="Text Descriptions (Alt Text) Sidebar"
                tabIndex={2}
              >
                Text Descriptions
              </Button>
              <Button
                onClick={() => {
                  closeAnySidebar();

                  if (!isElementSidebarOpen) {
                    setIsElementSidebarOpen(true);
                  }

                  handleMenuClose();
                }}
                aria-label="Element View Sidebar Toggle"
                tabIndex={5 + ALTTEXT_SIDEBAR_TABS}
              >
                Element View
              </Button>
            </>
          )}
          {importError && (
            <Tooltip
              title="The imported state is missing fields. Default values have been used."
              arrow
            >
              <ErrorOutline color="error" sx={{ mr: '10px' }} />
            </Tooltip>
          )}
          <Button
            sx={{ minWidth: '24px' }}
            onKeyDown={(e) => handleMenuKeypress(e)}
            aria-label="Additional options menu"
            aria-haspopup="menu"
            tabIndex={7 + ALTTEXT_SIDEBAR_TABS}
          >
            <SettingsIcon onClick={(e) => handleMenuClick(e.currentTarget)} />
          </Button>
          <Menu open={isMenuOpen} onClose={handleMenuClose} anchorEl={anchorEl}>
            <MenuItem
              onClick={() => {
                if (window) {
                  window.location.href = getMultinetDataUrl(workspace);
                }
              }}
            >
              Load Data
            </MenuItem>
            <DataTableLink
              data={data}
              rows={rows}
              visibleSets={visibleSets}
              hiddenSets={hiddenSets}
              tabIndex={3 + ALTTEXT_SIDEBAR_TABS}
            >
              <MenuItem>Data Table</MenuItem>
            </DataTableLink>
            <MenuItem
              onClick={() => {
                closeAnySidebar();

                setIsProvVisOpen(true);
                handleMenuClose();
              }}
              aria-label="History tree sidebar"
            >
              Show History
            </MenuItem>
            <MenuItem
              onClick={() => downloadSVG()}
              aria-label="SVG Download of this upset plot"
            >
              Download SVG
            </MenuItem>
            <MenuItem
              onClick={() => setShowImportModal(true)}
              color="inherit"
              aria-label="Import UpSet JSON state file"
            >
              Import State
            </MenuItem>
            <MenuItem
              onClick={() => exportState(provenance)}
              color="inherit"
              aria-label="UpSet JSON state file download"
            >
              Export State
            </MenuItem>
            <MenuItem
              onClick={() => exportState(provenance, data, rows)}
              aria-label="Download UpSet JSON state file with table data included"
            >
              Export State + Data
            </MenuItem>
          </Menu>
          <IconButton
            color="inherit"
            sx={{ width: '32px', height: '32px', margin: '0 8px' }}
            onClick={(e) => {
              handleLoginOpen(e);
            }}
            aria-label="Login menu"
            aria-haspopup="menu"
          >
            <Avatar
              sx={{ width: '32px', height: '32px' }}
              alt="User login status icon"
              variant="circular"
            >
              {userInfo !== null ? (
                `${userInfo.first_name.charAt(0)}${userInfo.last_name.charAt(0)}`
              ) : (
                <AccountCircle sx={{ height: '90%', width: '90%' }} color="inherit" />
              )}
            </Avatar>
          </IconButton>
          <Menu open={loginMenuOpen} onClose={handleLoginClose} anchorEl={anchorEl}>
            {userInfo === null ? (
              <MenuItem
                onClick={() => {
                  restoreQueryParam();
                  oAuth.redirectToLogin();
                }}
              >
                Login
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  oAuth.logout();
                  window.location.reload();
                }}
              >
                Log out
              </MenuItem>
            )}
          </Menu>
        </Box>
        <ImportModal open={showImportModal} close={handleImportModalClose} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;

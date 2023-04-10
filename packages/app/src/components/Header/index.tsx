import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AccountCircle } from '@mui/icons-material';
import { AppBar, Box, Button, ButtonGroup, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useRecoilValue, useRecoilState } from 'recoil';
import React, { useContext, useState } from 'react';

import { getMultinetDataUrl, oAuth } from '../../atoms/authAtoms';
import { queryParamAtom } from '../../atoms/queryParamAtom';
import { provenanceVisAtom } from '../../atoms/provenanceVisAtom';
import { elementSidebarAtom } from '../../atoms/elementSidebarAtom';
import { ProvenanceContext } from '../Root';
import { ImportModal, exportStateGrammar } from '../ImportModal';

const Header = () => {
  const { workspace } = useRecoilValue(queryParamAtom);
  const [ isProvVisOpen, setIsProvVisOpen ] = useRecoilState(provenanceVisAtom);
  const [ isElementSidebarOpen, setIsElementSidebarOpen ] = useRecoilState(elementSidebarAtom);
  const { provenance, isAtRoot, isAtLatest } = useContext(ProvenanceContext);

  const [ showImportModal, setShowImportModal ] = useState(false);
  const [ isMenuOpen, setIsMenuOpen ] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();

  const handleImportModalClose = () => {
    setShowImportModal(false);
  }

  const handleMenuClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  return (
    <AppBar sx={{position:"static", boxShadow:"none"}}>
      <Toolbar variant="dense" sx={{ 
        width: '98vw',                     
        backgroundColor: "#e0e0e0",
        color: "rgba(0, 0, 0, 0.87)",
        justifyContent: "space-between",
      }}>
        <Box sx={{display: 'flex', flexGrow: '1', justifyContent: 'start', alignItems: 'center', margin: 0, padding: 0}}>
          <img className="logo" id="multinet-logo" src="https://raw.githubusercontent.com/multinet-app/multinet-components/main/src/assets/multinet_logo.svg" alt="Multinet Logo"/>
          <Typography variant="h6" noWrap component="div" sx={{ marginRight: '5px', lineHeight: '1.5', fontWeight: 'normal' }}>
            Upset - Visualizing Intersecting Sets
          </Typography>
          <ButtonGroup>
            <IconButton color="inherit" onClick={() => provenance.undo()} disabled={isAtRoot}>
              <UndoIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => provenance.redo()} disabled={isAtLatest}>
              <RedoIcon />
            </IconButton>
          </ButtonGroup>
        </Box>
        <Box sx={{display:'flex', alignItems: 'center', margin: 0, padding: 0}}>
          <Button
            color="inherit"
            onClick={() => {
              if (window) window.location.href = getMultinetDataUrl(workspace);
            }}
          >
            Load Data
          </Button>
          <MoreVertIcon onClick={(e) => handleMenuClick(e)}></MoreVertIcon>
          <Menu open={isMenuOpen} onClose={handleMenuClose} anchorEl={anchorEl}>
            <MenuItem onClick={() => setShowImportModal(true) } color="inherit">
                Import State
            </MenuItem>
            <MenuItem onClick={() => exportStateGrammar(provenance)} color="inherit">
                Export
            </MenuItem>
            <MenuItem onClick={() => {
                if (isElementSidebarOpen) setIsElementSidebarOpen(false);
                setIsProvVisOpen(true); 
                handleMenuClose();
              }}>
                Show History
            </MenuItem>
            <MenuItem onClick={() => {
                if (isProvVisOpen) setIsProvVisOpen(false);
                setIsElementSidebarOpen(true); 
                handleMenuClose();
              }}>
                Show Element View
            </MenuItem>
          </Menu>
          <Button
            color="inherit"
            onClick={() => {
              oAuth.logout();
              if (window) window.location.href = getMultinetDataUrl(workspace);
            }}
          >
            <AccountCircle color="inherit"></AccountCircle>
          </Button>
        </Box>
        <ImportModal open={showImportModal} close={handleImportModalClose} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;

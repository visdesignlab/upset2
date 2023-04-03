import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import { AppBar, Button, ButtonGroup, IconButton, Toolbar, Typography } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { useContext } from 'react';

import { getMultinetDataUrl, oAuth } from '../../atoms/authAtoms';
import { queryParamAtom } from '../../atoms/queryParamAtom';
import { ProvenanceContext } from '../Root';

const Header = () => {
  const { workspace } = useRecoilValue(queryParamAtom);
  const { provenance, isAtRoot, isAtLatest } = useContext(ProvenanceContext);

  console.log("Root", isAtRoot, "LATEST", isAtLatest);
  console.log(provenance.getState().firstAggregateBy);


  return (
    <AppBar position="static">
      <Toolbar variant="dense" sx={{ width: '98vw' }}>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Upset - Visualizing Intersecting Sets
        </Typography>
        <ButtonGroup>
          <IconButton color="inherit" onClick={() => provenance.undo()} disabled={provenance.current.children.length === 0}>
            <UndoIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => provenance.redo()} disabled={provenance.current.id === provenance.root.id}>
            <RedoIcon />
          </IconButton>
        </ButtonGroup>
        <Button
          color="inherit"
          onClick={() => {
            if (window) window.location.href = getMultinetDataUrl(workspace);
          }}
        >
          Load Data
        </Button>
        <Button
          color="inherit"
          onClick={() => {
            oAuth.logout();
            if (window) window.location.href = getMultinetDataUrl(workspace);
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

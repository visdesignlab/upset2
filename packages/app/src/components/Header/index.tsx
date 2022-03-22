import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { useRecoilValue } from 'recoil';

import { getMultinetDataUrl, oAuth } from '../../atoms/authAtoms';
import { queryParamAtom } from '../../atoms/queryParamAtom';

const Header = () => {
  const { workspace } = useRecoilValue(queryParamAtom);

  return (
    <AppBar position="static">
      <Toolbar variant="dense" sx={{ width: '98vw' }}>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Upset - Visualizing Intersecting Sets
        </Typography>
        <IconButton color="inherit">
          <UndoIcon />
        </IconButton>
        <IconButton color="inherit">
          <RedoIcon />
        </IconButton>
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

import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" noWrap component="div">
          Upset - Visualizing Intersecting Sets
        </Typography>
        <IconButton color="inherit">
          <UndoIcon />
        </IconButton>
        <IconButton color="inherit">
          <RedoIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

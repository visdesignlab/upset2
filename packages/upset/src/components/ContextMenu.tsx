import { useRecoilState } from 'recoil';
import { Menu, MenuItem, css } from '@mui/material';
import { contextMenuAtom } from '../atoms/contextMenuAtom';

export const ContextMenu = () => {
  const [contextMenu, setContextMenu] = useRecoilState(contextMenuAtom);

  const handleClose = () => {
    setContextMenu(null);
  };

  if (contextMenu !== null) {
    return (
      <Menu
        id={contextMenu.id}
        anchorReference="anchorPosition"
        anchorPosition={
                contextMenu !== null
                  ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                  : undefined
                }
        open={contextMenu !== null && contextMenu.items !== null}
        onClose={handleClose}
        css={css`
                width: 100%;
                `}
      >
        {contextMenu.items.map((item) => <MenuItem key={item.label} onClick={item.onClick} disabled={!!item.disabled}>{item.label}</MenuItem>)}
      </Menu>
    );
  }
  return null;
};

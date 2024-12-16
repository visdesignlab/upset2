import { useRecoilState } from 'recoil';
import { Menu, MenuItem, css } from '@mui/material';
import { contextMenuAtom } from '../atoms/contextMenuAtom';

/**
 * Renders a context menu based on the provided context menu state.
 * @returns The rendered context menu component.
 */
export const ContextMenu = () => {
  const [contextMenu, setContextMenu] = useRecoilState(contextMenuAtom);

  /**
   * Closes the context menu.
   */
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
        {contextMenu.items.map((item) => (
          <MenuItem
            key={item.label}
            onClick={item.onClick}
            disabled={!!item.disabled}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    );
  }
  return null;
};

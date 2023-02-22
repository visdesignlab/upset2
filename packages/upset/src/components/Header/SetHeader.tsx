import { ScaleLinear } from 'd3';
import { FC, useContext, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { css, Menu, MenuItem } from '@mui/material';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { setsAtom } from '../../atoms/setsAtoms';
import Group from '../custom/Group';
import { SetLabel } from '../custom/SetLabel';
import { SetSizeBar } from '../custom/SetSizeBar';
import { ProvenanceContext } from '../Root';

type Props = {
  visibleSets: string[];
  scale: ScaleLinear<number, number>;
};

export const SetHeader: FC<Props> = ({ visibleSets, scale }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const sets = useRecoilValue(setsAtom);
  const { actions } = useContext(
    ProvenanceContext,
  );

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    set: string;
  } | null>(null);

  const handleContextMenuClose = () => {
    setContextMenu(null);
  }

  const handleContextMenuOpen = (e: React.MouseEvent, setName: string) => {
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: e.clientX,
            mouseY: e.clientY,
            set: setName,
          }
        : null,
    );
  }

  return (
    <g>
      {visibleSets.map((setName, idx) => (
        <Group 
          key={setName} 
          tx={idx * dimensions.set.width}
          ty={0}
          onContextMenu={(e) => {
            e.preventDefault();
            handleContextMenuOpen(e, setName);
          }}
          css={css`cursor: context-menu;`}
        >
          <Menu
            id="set-context-menu"
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
            open={contextMenu !== null && contextMenu.set === setName}
            onClose={handleContextMenuClose}
          >
            <MenuItem onClick={() => {
              actions.removeVisibleSet(setName);
              handleContextMenuClose();
            }}>
              Remove {setName.replace('_', ': ')}
            </MenuItem>
          </Menu>
          <SetSizeBar
            scale={scale}
            size={sets[setName].size}
            setId={setName}
            label={sets[setName].elementName}
          />
          <SetLabel setId={setName} name={sets[setName].elementName} />
        </Group>
      ))}
    </g>
  );
};

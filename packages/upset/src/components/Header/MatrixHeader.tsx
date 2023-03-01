/** @jsxImportSource @emotion/react */
import { useContext } from 'react';
import { a, useTransition } from 'react-spring';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { hiddenSetSelector, visibleSetSelector } from '../../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { maxSetSizeSelector } from '../../atoms/maxSetSizeSelector';
import { setsAtom } from '../../atoms/setsAtoms';
import { useScale } from '../../hooks/useScale';
import translate from '../../utils/transform';
import Group from '../custom/Group';
import { SetSizeBar } from '../custom/SetSizeBar';
import { ProvenanceContext } from '../Root';
import { SetHeader } from './SetHeader';
import { SetManagement } from './SetManagement';
import { css } from '@mui/material';
import { contextMenuAtom } from '../../atoms/contextMenuAtom';

export const MatrixHeader = () => {
  const { actions } = useContext(ProvenanceContext);
  const sets = useRecoilValue(setsAtom);
  const visibleSets = useRecoilValue(visibleSetSelector);
  const dimensions = useRecoilValue(dimensionsSelector);
  const maxCarinality = useRecoilValue(maxSetSizeSelector);
  const { set } = dimensions;

  const hiddenSets = useRecoilValue(hiddenSetSelector);

  const hiddenSetsTransition = useTransition(
    hiddenSets.map((setId, idx) => ({ id: setId, x: idx * (set.width + 1) })),
    {
      keys: (d) => d.id,
      enter: ({ x }) => ({ transform: translate(x, 0) }),
      update: ({ x }) => ({ transform: translate(x, 0) }),
    },
  );

  const scale = useScale([0, maxCarinality], [0, set.cardinality.height]);

  const setContextMenu = useSetRecoilState(contextMenuAtom);

  const handleContextMenuClose = () => {
    setContextMenu(null);
  }

  const openContextMenu = (e: React.MouseEvent, setName: string) => {
    setContextMenu({
        mouseX: e.clientX,
        mouseY: e.clientY,
        id: `${setName}-menu`,
        items: [{
          label: `Add ${setName.replace('_', ': ')}`,
          onClick: () => {
            actions.addVisibleSet(setName);
            handleContextMenuClose();
          }
        }]
      }
    );
  }

  return (
    <>
      <SetHeader visibleSets={visibleSets} scale={scale} />
      <SetManagement />
      <Group
        tx={
          dimensions.matrixColumn.visibleSetsWidth +
          dimensions.gap +
          dimensions.matrixColumn.setManagementWidth +
          dimensions.gap
        }
        ty={0}
      >
        {hiddenSetsTransition(({ transform }, item) => {
          return (
            <a.g
              transform={transform}
              onContextMenu={(e) => {
                e.preventDefault();
                openContextMenu(e, item.id);
              }}
              css={css`cursor: context-menu;`}
            >
              {/* <Menu
                id="hidden-set-context-menu"
                anchorReference="anchorPosition"
                anchorPosition={
                  contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
                }
                open={contextMenu !== null && contextMenu.set === item.id}
                onClose={handleContextMenuClose}
              >
                <MenuItem onClick={() => {
                  actions.addVisibleSet(item.id);
                  handleContextMenuClose();
                }}>
                  Add {item.id.replace('_', ': ')}
                </MenuItem>
              </Menu> */}
              <SetSizeBar
                scale={scale}
                setId={item.id}
                size={sets[item.id].size}
                foregroundOpacity={0.4}
                label={sets[item.id].elementName}
                showLabel
              />
            </a.g>
          );
        })}
      </Group>
    </>
  );
};

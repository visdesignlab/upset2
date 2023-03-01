import { ScaleLinear } from 'd3';
import { FC, useContext } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { css } from '@mui/material';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { setsAtom } from '../../atoms/setsAtoms';
import Group from '../custom/Group';
import { SetLabel } from '../custom/SetLabel';
import { SetSizeBar } from '../custom/SetSizeBar';
import { ProvenanceContext } from '../Root';
import { contextMenuAtom } from '../../atoms/contextMenuAtom';

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
              label: `Remove ${setName.replace('_', ': ')}`,
              onClick: () => {
                actions.removeVisibleSet(setName);
                handleContextMenuClose();
              }
            }],
          }
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
            openContextMenu(e, setName);
          }}
          css={css`cursor: context-menu;`}
        >
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

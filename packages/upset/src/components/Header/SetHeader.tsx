import { ScaleLinear } from 'd3';
import { FC, useContext } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { a, useTransition } from 'react-spring';
import { css } from '@mui/material';

import { SortVisibleBy } from '@visdesignlab/upset2-core';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { setsAtom } from '../../atoms/setsAtoms';
import { SetLabel } from '../custom/SetLabel';
import { SetSizeBar } from '../custom/SetSizeBar';
import { ProvenanceContext } from '../Root';
import { contextMenuAtom } from '../../atoms/contextMenuAtom';
import { visibleSortSelector } from '../../atoms/config/visibleSetsAtoms';
import translate from '../../utils/transform';
import { columnHoverAtom } from '../../atoms/highlightAtom';

type Props = {
  visibleSets: string[];
  scale: ScaleLinear<number, number>;
};

export const SetHeader: FC<Props> = ({ visibleSets, scale }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const sets = useRecoilValue(setsAtom);
  const sortVisibleBy = useRecoilValue(visibleSortSelector);

  const setColumnHover = useSetRecoilState(columnHoverAtom);

  const { actions } = useContext(
    ProvenanceContext,
  );

  const setContextMenu = useSetRecoilState(contextMenuAtom);

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const openContextMenu = (e: MouseEvent, setName: string) => {
    setContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
      id: `${setName}-menu`,
      items: [
        {
          label: `Remove ${setName.replace('_', ': ')}`,
          onClick: () => {
            actions.removeVisibleSet(setName);
            handleContextMenuClose();
          },
        },
        {
          label: 'Sort by Alphabetical',
          onClick: () => {
            actions.sortVisibleBy('Alphabetical' as SortVisibleBy);
            handleContextMenuClose();
          },
          disabled: sortVisibleBy === 'Alphabetical',
        },
        {
          label: 'Sort by Size - Ascending',
          onClick: () => {
            actions.sortVisibleBy('Ascending' as SortVisibleBy);
            handleContextMenuClose();
          },
          disabled: sortVisibleBy === 'Ascending',
        },
        {
          label: 'Sort by Size - Descending',
          onClick: () => {
            actions.sortVisibleBy('Descending' as SortVisibleBy);
            handleContextMenuClose();
          },
          disabled: sortVisibleBy === 'Descending',
        },
      ],
    });
  };

  const columnTransitions = useTransition(
    visibleSets.map((setName, idx) => ({
      setName,
      x: dimensions.xOffset + idx * dimensions.set.width,
    })),
    {
      keys: (d) => d.setName,
      enter: ({ x }) => ({ transform: translate(x, 0) }),
      update: ({ x }) => ({ transform: translate(x, 0) }),
    },
  );

  return (
    <g>
      {columnTransitions(({ transform }, set) => (
        <a.g
          key={set.setName}
          transform={transform}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openContextMenu(e, set.setName);
          }}
          css={css`cursor: context-menu;`}
          onMouseEnter={() => setColumnHover([set.setName])}
          onMouseLeave={() => setColumnHover([])}
        >
          <SetSizeBar
            scale={scale}
            size={sets[set.setName].size}
            setId={set.setName}
            label={sets[set.setName].elementName}
          />
          <SetLabel setId={sets[set.setName].id} name={sets[set.setName].elementName} />
        </a.g>
      ))}
    </g>
  );
};

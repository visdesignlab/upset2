import { css } from '@emotion/react';
import { a, useTransition } from 'react-spring';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { FC, useContext } from 'react';
import { ScaleLinear } from 'd3-scale';
import { SetSizeBar } from '../custom/SetSizeBar';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { contextMenuAtom } from '../../atoms/contextMenuAtom';
import { ProvenanceContext } from '../Root';
import translate from '../../utils/transform';
import { setsAtom } from '../../atoms/setsAtoms';
import { hiddenSetSortAtom } from '../../atoms/config/visibleSetsAtoms';

type Props = {
    hiddenSets: string[];
    scale: ScaleLinear<number, number>;
  };

export const HiddenSets: FC<Props> = ({ hiddenSets, scale }) => {
  const { actions } = useContext(ProvenanceContext);
  const dimensions = useRecoilValue(dimensionsSelector);
  const sets = useRecoilValue(setsAtom);
  const setContextMenu = useSetRecoilState(contextMenuAtom);
  const { set } = dimensions;

  const [hiddenSortBy, setHiddenSortBy] = useRecoilState(hiddenSetSortAtom);

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
          label: `Add ${setName.replace('_', ': ')}`,
          onClick: () => {
            actions.addVisibleSet(setName);
            handleContextMenuClose();
          },
        },
        {
          label: 'Sort by Alphabetical',
          onClick: () => {
            setHiddenSortBy('Name');
            handleContextMenuClose();
          },
          disabled: hiddenSortBy === 'Name',
        },
        {
          label: 'Sort by Size - Ascending',
          onClick: () => {
            setHiddenSortBy('Size - Asc');
            handleContextMenuClose();
          },
          disabled: hiddenSortBy === 'Size - Asc',
        },
        {
          label: 'Sort by Size - Descending',
          onClick: () => {
            setHiddenSortBy('Size - Desc');
            handleContextMenuClose();
          },
          disabled: hiddenSortBy === 'Size - Desc',
        },
      ],
    });
  };

  const hiddenSetsTransition = useTransition(
    hiddenSets.map((setId, idx) => ({ id: setId, x: idx * (set.width + 1) })),
    {
      keys: (d) => d.id,
      enter: ({ x }) => ({ transform: translate(x, 0) }),
      update: ({ x }) => ({ transform: translate(x, 0) }),
    },
  );

  return (
    <g>
      {hiddenSetsTransition(({ transform }, item) => (
        <a.g
          transform={transform}
          onContextMenu={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            openContextMenu(e, item.id);
          }}
          css={css`cursor: context-menu;`}
        >
          <SetSizeBar
            scale={scale}
            setId={item.id}
            size={sets[item.id].size}
            foregroundOpacity={0.4}
            label={sets[item.id].elementName}
            showLabel
          />
        </a.g>
      ))}
    </g>
  );
};

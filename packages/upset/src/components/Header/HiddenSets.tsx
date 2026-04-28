import { useTransition } from 'react-spring';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { MouseEvent, useContext } from 'react';
import { ScaleLinear } from 'd3-scale';
import { SetSizeBar } from '../custom/SetSizeBar';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { contextMenuAtom } from '../../atoms/contextMenuAtom';
import { ProvenanceContext } from '../../provenance/context';
import translate from '../../utils/transform';
import { setsAtom } from '../../atoms/setsAtoms';
import { hiddenSetSortAtom } from '../../atoms/config/visibleSetsAtoms';
import { UpsetActions } from '../../provenance';
import { AnimatedGroup } from '../custom/AnimatedGroup';

type Props = {
  hiddenSets: string[];
  scale: ScaleLinear<number, number>;
};

export function HiddenSets({ hiddenSets, scale }: Props) {
  const { actions }: { actions: UpsetActions } = useContext(ProvenanceContext);
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
        <AnimatedGroup
          transform={transform}
          onContextMenu={(e: MouseEvent<SVGGElement>) => {
            e.preventDefault();
            e.stopPropagation();
            openContextMenu(e, item.id);
          }}
          style={{ cursor: 'context-menu' }}
        >
          <SetSizeBar
            scale={scale}
            setId={item.id}
            size={sets[item.id].size}
            foregroundOpacity={0.4}
            label={sets[item.id].elementName}
            showLabel
            hideSizeText
          />
        </AnimatedGroup>
      ))}
    </g>
  );
}

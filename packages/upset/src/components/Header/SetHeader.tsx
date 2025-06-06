import { ScaleLinear } from 'd3-scale';
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
import { sortBySelector } from '../../atoms/config/sortByAtom';
import { UpsetActions } from '../../provenance';

/**
 * Props for the SetHeader component.
 */
type Props = {
  /**
   * List of all visible set names
   */
  visibleSets: string[];
  /**
   * D3 linear scale
   */
  scale: ScaleLinear<number, number>;
};

/**
 * Renders a header for the set matrix column, showing each set and its size.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string[]} props.visibleSets - The array of visible set names.
 * @param {ScaleLinear<number, number>} props.scale - The scale value.
 * @returns {JSX.Element} The rendered component.
 */
export const SetHeader: FC<Props> = ({ visibleSets, scale }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const sets = useRecoilValue(setsAtom);
  const sortBy = useRecoilValue(sortBySelector);
  const sortVisibleBy = useRecoilValue(visibleSortSelector);

  const setColumnHover = useSetRecoilState(columnHoverAtom);

  const { actions }: { actions: UpsetActions } = useContext(ProvenanceContext);

  const setContextMenu = useSetRecoilState(contextMenuAtom);

  /**
   * Closes the context menu.
   */
  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  /**
   * Returns an array of menu items for a given set name.
   * @param setName - The name of the set.
   * @returns An array of menu items.
   */
  const getMenuItems = (setName: string) => [
    {
      // Label should look like "Remove Set: Drama" rather than "Remove Set_Drama"
      label: `Remove ${setName.replace('Set_', 'Set: ')}`,
      onClick: () => {
        actions.removeVisibleSet(setName);
        handleContextMenuClose();
      },
    },
    {
      label: `Bring ${setName.replace('Set_', 'Set: ')} to top`,
      onClick: () => {
        actions.sortBy(setName, 'Descending');
        handleContextMenuClose();
      },
    },
    {
      label: 'Sort Sets by Alphabetical',
      onClick: () => {
        actions.sortVisibleBy('Alphabetical' as SortVisibleBy);
        handleContextMenuClose();
      },
      disabled: sortVisibleBy === 'Alphabetical',
    },
    {
      label: 'Sort Sets by Size - Ascending',
      onClick: () => {
        actions.sortVisibleBy('Ascending' as SortVisibleBy);
        handleContextMenuClose();
      },
      disabled: sortVisibleBy === 'Ascending',
    },
    {
      label: 'Sort Sets by Size - Descending',
      onClick: () => {
        actions.sortVisibleBy('Descending' as SortVisibleBy);
        handleContextMenuClose();
      },
      disabled: sortVisibleBy === 'Descending',
    },
  ];

  /**
   * Opens the context menu for a given setName.
   *
   * @param e - The mouse event that triggered the context menu.
   * @param setName - The name of the set.
   */
  const openContextMenu = (e: MouseEvent, setName: string) => {
    setContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
      id: `${setName}-menu`,
      items: getMenuItems(setName),
    });
  };

  /**
   * Animates the transitions of the visible sets in the header column.
   * Creates keyframes for animated g elements
   *
   * @returns {Array<{ set: { setName: string, x: number }, props: { transform: SpringValue<string> } }>} - The array of transitions for the visible sets.
   */
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
          onContextMenu={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            openContextMenu(e, set.setName);
          }}
          css={css`
            cursor: context-menu;
          `}
          onMouseEnter={() => setColumnHover([set.setName])}
          onMouseLeave={() => setColumnHover([])}
          onClick={(e) => {
            e.stopPropagation();
            if (sortBy !== set.setName) {
              actions.sortBy(set.setName, 'Descending');
            }
          }}
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

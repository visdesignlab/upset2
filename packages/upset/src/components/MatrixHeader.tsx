/** @jsxImportSource @emotion/react */
import { useContext, useState } from 'react';
import { a, useSpring, useTransition } from 'react-spring';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { hiddenSetSelector, hiddenSetSortAtom, visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { columnHoverAtom } from '../atoms/hoverAtom';
import { maxSetSizeSelector } from '../atoms/maxSetSizeSelector';
import { setsAtom } from '../atoms/setsAtoms';
import { useScale } from '../hooks/useScale';
import translate from '../utils/transform';
import { AttributeDialog } from './custom/AttributeDialog';
import Group from './custom/Group';
import { SetLabel } from './custom/SetLabel';
import { SetSizeBar } from './custom/SetSizeBar';
import { SvgRectButton } from './custom/SvgRectButton';
import { ProvenanceContext } from './Root';

export const MatrixHeader = () => {
  const { actions } = useContext(ProvenanceContext);
  const setHiddenSortBy = useSetRecoilState(hiddenSetSortAtom);
  const sets = useRecoilValue(setsAtom);
  const visibleSets = useRecoilValue(visibleSetSelector);
  const dimensions = useRecoilValue(dimensionsSelector);
  const [hoveredColumn, setHoveredColumn] = useRecoilState(columnHoverAtom);
  const maxCarinality = useRecoilValue(maxSetSizeSelector);
  const [openAttributeSelector, setOpenAttributeSelector] = useState(false);
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

  const [sortMode, setSortMode] = useState(false);
  const sortGroupTransition = useSpring({
    opacity: sortMode ? 1 : 0,
  });

  const scale = useScale([0, maxCarinality], [0, set.cardinality.height]);

  return (
    <>
      <Group>
        {visibleSets.map((setName, idx) => (
          <Group
            key={setName}
            tx={idx * set.width}
            ty={0}
            onMouseEnter={() => {
              setHoveredColumn(setName);
            }}
            onMouseOut={() => {
              setHoveredColumn(null);
            }}
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
      </Group>
      <Group
        ty={0}
        tx={dimensions.matrixColumn.visibleSetsWidth + dimensions.gap}
      >
        {/* <text
          transform={translate(dimensions.matrixColumn.buttonsWidth / 2, 10)}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          Set Selection
        </text> */}
        <SvgRectButton
          tx={dimensions.matrixColumn.buttonsWidth / 2}
          ty={0}
          label="Sort Sets"
          height={20}
          width={100}
          rx="5"
          onClick={() => setSortMode(!sortMode)}
        />
        <SvgRectButton
          tx={dimensions.matrixColumn.buttonsWidth / 2}
          ty={35}
          label="Attributes"
          height={20}
          width={100}
          rx="5"
          onClick={() => setOpenAttributeSelector(true)}
        />
        <a.g
          pointerEvents={sortMode ? 'all' : 'none'}
          transform={translate(dimensions.matrixColumn.buttonsWidth / 2, 30)}
          style={sortGroupTransition}
        >
          <text dominantBaseline="middle" textAnchor="middle">
            Sort By
          </text>
          <SvgRectButton
            tx={0}
            ty={10}
            label="Name"
            height={18}
            width={70}
            rx="5"
            onClick={() => setHiddenSortBy('Name')}
          />
          <SvgRectButton
            tx={0}
            ty={30}
            label="Size - Ascending"
            height={18}
            width={150}
            rx="5"
            onClick={() => setHiddenSortBy('Size - Asc')}
          />
          <SvgRectButton
            tx={0}
            ty={50}
            label="Size - Descending"
            height={18}
            width={150}
            rx="5"
            onClick={() => setHiddenSortBy('Size - Desc')}
          />
        </a.g>
      </Group>
      <Group
        tx={
          dimensions.matrixColumn.visibleSetsWidth +
          dimensions.gap +
          dimensions.matrixColumn.buttonsWidth +
          dimensions.gap
        }
        ty={0}
      >
        {hiddenSetsTransition(({ transform }, item) => {
          return (
            <a.g
              transform={transform}
              onClick={() => actions.addVisibleSet(item.id)}
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
          );
        })}
      </Group>
      {openAttributeSelector && (
        <AttributeDialog
          open={openAttributeSelector}
          onClose={() => setOpenAttributeSelector(false)}
        />
      )}
    </>
  );
};

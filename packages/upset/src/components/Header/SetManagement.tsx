import { FC, useState } from 'react';
import { a, useSpring } from 'react-spring';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { hiddenSetSortAtom } from '../../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
// import { AttributeDialog } from '../custom/AttributeDialog';
import Group from '../custom/Group';
import { SvgRectButton } from '../custom/SvgRectButton';

type Props = {};

export const SetManagement: FC<Props> = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const setHiddenSortBy = useSetRecoilState(hiddenSetSortAtom);

  // const [openAttributeSelector, setOpenAttributeSelector] = useState(false);

  const [sortMode, setSortMode] = useState(false);
  const sortGroupTransition = useSpring({
    opacity: sortMode ? 1 : 0,
  });

  return (
    <>
      <Group
        ty={10}
        tx={dimensions.matrixColumn.visibleSetsWidth + dimensions.gap}
      >
        <SvgRectButton
          tx={50}
          ty={0}
          label="Sort Sets"
          height={20}
          width={100}
          rx="5"
          onClick={() => setSortMode(!sortMode)}
        />
        {/* <SvgRectButton
          tx={170}
          ty={0}
          label="Attributes"
          height={20}
          width={100}
          rx="5"
          onClick={() => setOpenAttributeSelector(true)}
        /> */}
        <a.g
          pointerEvents={sortMode ? 'all' : 'none'}
          transform={translate(
            dimensions.matrixColumn.setManagementWidth / 2,
            30,
          )}
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
      {/* {openAttributeSelector && (
        <AttributeDialog
          open={openAttributeSelector}
          onClose={() => setOpenAttributeSelector(false)}
        />
      )} */}
    </>
  );
};

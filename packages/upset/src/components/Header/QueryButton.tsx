import { SvgIcon, Tooltip } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useRecoilState, useRecoilValue } from 'recoil';
import React, { useCallback, useMemo } from 'react';
import Group from '../custom/Group';
import { mousePointer } from '../../utils/styles';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { queryBySetsInterfaceAtom } from '../../atoms/config/queryBySetsAtoms';
/**
 * The size of the icon in pixels.
 */
const iconSize = 16;

/**
 * Query By Sets button to open the query by sets interface.
 */
export const QueryButton = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const [queryBySetsInterface, setQueryBySetsInterface] = useRecoilState(queryBySetsInterfaceAtom);

  /**
   * Toggles the query by set interface.
   */
  const toggleQueryBySetsInterface = useCallback((e: React.MouseEvent<SVGElement, MouseEvent>) => {
    // Stop SvgBase handler from clearing current intersection
    e.stopPropagation();
    setQueryBySetsInterface((prev) => !prev);
  }, [setQueryBySetsInterface]);

  // for whatever reason this needed to be memoized for the icon to update...
  // some weird recoil thing I expect
  const QueryIcon = useMemo(() => {
    if (queryBySetsInterface) {
      return <Remove />;
    }
    return <Add />;
  }, [queryBySetsInterface]);

  return (
    <Group tx={dimensions.header.buttonXOffset} ty={dimensions.header.totalHeight - iconSize}>
      <Tooltip title="Query By Sets">
        <g>
          {/* OnClick needs to be in both places here to avoid some missed clicks */}
          <rect height={iconSize} width={iconSize} css={mousePointer} onClick={toggleQueryBySetsInterface} opacity={0} />
          <g css={mousePointer} onClick={toggleQueryBySetsInterface}>
            <SvgIcon
              height={iconSize}
              width={iconSize}
            >
              {QueryIcon}
            </SvgIcon>
          </g>
        </g>
      </Tooltip>
    </Group>
  );
};

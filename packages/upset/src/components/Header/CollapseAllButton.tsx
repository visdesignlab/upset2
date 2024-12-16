import { css, SvgIcon, Tooltip } from '@mui/material';
import { DoubleArrow } from '@mui/icons-material';
import { isRowAggregate } from '@visdesignlab/upset2-core';
import { useRecoilValue } from 'recoil';
import { useCallback, useContext, useState } from 'react';
import Group from '../custom/Group';
import { mousePointer } from '../../utils/styles';
import { ProvenanceContext } from '../Root';
import { firstAggregateSelector } from '../../atoms/config/aggregateAtoms';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { rowsSelector } from '../../atoms/renderRowsAtom';

/** @jsxImportSource @emotion/react */

const iconSize = 16;

const hidden = 'none';

const collapseAllStyle = css`
    cursor: pointer;
    transform: translate(-${iconSize}px, 0)
`;

export const CollapseAllButton = () => {
  /*
   * State
   */

  const firstAggregateBy = useRecoilValue(firstAggregateSelector);
  const { actions } = useContext(ProvenanceContext);
  const dimensions = useRecoilValue(dimensionsSelector);
  const rows = useRecoilValue(rowsSelector);
  const [allCollapsed, setAllCollapsed] = useState(false);

  /*
   * Callbacks
   */

  /**
   * Toggles the collapse state of all rows.
   */
  const toggleCollapseAll = useCallback(() => {
    const ids: string[] = [];

    if (allCollapsed === true) {
      actions.expandAll();
      setAllCollapsed(false);
    } else {
      Object.entries(rows.values).forEach((entry) => {
        const row = entry[1];
        if (isRowAggregate(row)) {
          ids.push(row.id);
        }
      });

      setAllCollapsed(true);
      actions.collapseAll(ids);
    }
  }, [allCollapsed, actions, rows]);

  /**
   * Get the transform for the icon.
   */
  const getTransform = useCallback(() => {
    if (!allCollapsed) {
      return `rotate(-90) translate(-${iconSize}, -${iconSize})`;
    }
    return 'rotate(90)';
  }, [allCollapsed, iconSize]);

  return (
    <Group tx={iconSize + 5} ty={dimensions.header.totalHeight - iconSize} style={{ display: (firstAggregateBy === 'None') ? hidden : 'inherit' }}>
      <Tooltip title={`${allCollapsed ? 'Expand All' : 'Collapse All'}`}>
        <g>
          <rect height={iconSize} width={iconSize} css={collapseAllStyle} onClick={toggleCollapseAll} opacity={0} />
          <g
            transform={getTransform()}
            css={mousePointer}
            onClick={toggleCollapseAll}
          >
            <SvgIcon
              height={iconSize}
              width={iconSize}
            >
              <DoubleArrow />
            </SvgIcon>
          </g>
        </g>
      </Tooltip>
    </Group>
  );
};

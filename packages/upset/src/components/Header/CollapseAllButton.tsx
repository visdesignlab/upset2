import { css, SvgIcon, Tooltip } from '@mui/material';
import { DoubleArrow } from '@mui/icons-material';
import { getRows, isRowAggregate } from '@visdesignlab/upset2-core';
import { useRecoilValue } from 'recoil';
import { useContext, useState } from 'react';
import Group from '../custom/Group';
import { mousePointer } from '../../utils/styles';
import { ProvenanceContext } from '../Root';
import { firstAggregateSelector } from '../../atoms/config/aggregateAtoms';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { dataAtom } from '../../atoms/dataAtom';

const iconSize = 16;

const hidden = css`
    display: none;
`;

const collapseAllStyle = css`
    cursor: pointer;
    transform: translate(-${iconSize}px, 0)
`;

export const CollapseAllButton = () => {
  const firstAggregateBy = useRecoilValue(firstAggregateSelector);
  const { provenance, actions } = useContext(ProvenanceContext);
  const data = useRecoilValue(dataAtom);
  const dimensions = useRecoilValue(dimensionsSelector);
  const rows = getRows(data, provenance.getState());
  const [allCollapsed, setAllCollapsed] = useState(false);

  const toggleCollapseAll = () => {
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
  };

  const getTransform = () => {
    if (!allCollapsed) {
      return `rotate(-90) translate(-${iconSize}, -${iconSize})`;
    }
    return 'rotate(90)';
  };

  return (
    <Group tx={iconSize + 5} ty={dimensions.header.totalHeight - iconSize} css={firstAggregateBy === 'None' && hidden}>
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

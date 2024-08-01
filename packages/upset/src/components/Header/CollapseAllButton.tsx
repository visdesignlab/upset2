import { css, SvgIcon, Tooltip } from '@mui/material';
import { DoubleArrow } from '@mui/icons-material';
import { getRows, isRowAggregate } from '@visdesignlab/upset2-core';
import { useRecoilValue } from 'recoil';
import { useContext, useMemo, useState } from 'react';
import Group from '../custom/Group';
import { mousePointer } from '../../utils/styles';
import { ProvenanceContext } from '../Root';
import { firstAggregateSelector } from '../../atoms/config/aggregateAtoms';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { dataAtom } from '../../atoms/dataAtom';

const iconSize = 16;

const xOffset = 5;

const hidden = 'none';

const collapseAllStyle = css`
    cursor: pointer;
    transform: translate(-${iconSize}px, 0)
`;

export const CollapseAllButton = () => {
  const firstAggregateBy = useRecoilValue(firstAggregateSelector);
  const { provenance, actions } = useContext(ProvenanceContext);
  const data = useRecoilValue(dataAtom);
  const dimensions = useRecoilValue(dimensionsSelector);
  const [allCollapsed, setAllCollapsed] = useState(false);

  const rows = useMemo(() => getRows(data, provenance.getState()), [data, provenance.getState()]);

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
    <Group tx={iconSize + xOffset} ty={dimensions.header.totalHeight - (iconSize * 2)} style={{ display: (firstAggregateBy === 'None') ? hidden : 'inherit' }}>
      <Tooltip placement="top" title={`${allCollapsed ? 'Expand All' : 'Collapse All'}`}>
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

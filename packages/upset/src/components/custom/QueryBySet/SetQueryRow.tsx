import { FC, useCallback, useContext } from 'react';
import { useRecoilValue } from 'recoil';

import { SetMembershipStatus } from '@visdesignlab/upset2-core';
import { css } from '@emotion/react';
import { SvgIcon, Tooltip } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import { dimensionsSelector } from '../../../atoms/dimensionsAtom';
import translate from '../../../utils/transform';
import { visibleSetSelector } from '../../../atoms/config/visibleSetsAtoms';
import MemberShipCircle from '../../Columns/Matrix/MembershipCircle';
import { setQueryAtom } from '../../../atoms/queryBySetsAtoms';
import { ProvenanceContext } from '../../Root';
import { SizeBar } from '../../Columns/SizeBar';
import { flattenedRowsSelector } from '../../../atoms/renderRowsAtom';

const REMOVE_ICON_SIZE = 16;

export const SetQueryRow: FC = () => {
  const { actions } = useContext(ProvenanceContext);
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleSets = useRecoilValue(visibleSetSelector);
  const setQuery = useRecoilValue(setQueryAtom);
  const rows = useRecoilValue(flattenedRowsSelector);

  /**
   * Retrieves the membership status for a given set.
   * @param set - The name of the set.
   * @returns The membership status for the set.
   */
  function getMembershipStatus(set: string): SetMembershipStatus {
    return setQuery?.query?.[set] ?? 'No';
  }

  /**
   * Removes the current set query from the list of set queries.
   *
   * This function calls the `removeSetQuery` action from the `actions` object,
   * passing the current `setQuery` as an argument to remove it from the list.
   *
   * @returns {void} This function does not return a value.
   */
  function removeSetQuery(): void {
    actions.removeSetQuery(setQuery);
  }

  const totalQuerySize = useCallback(() => {
    let total = 0;
    rows.forEach((rr) => {
      total += rr.row.size;
    });
    return total;
  }, [rows]);

  return (
    <g transform={translate(0, 0)}>
      <g>
        <rect
          transform={translate(0, 2)}
          height={dimensions.body.rowHeight * 2 - 4}
          width={dimensions.body.rowWidth}
          rx={5}
          ry={10}
          fill="#cccccc"
          opacity="0.3"
          stroke="#555555"
          strokeWidth="1px"
        />
        <g transform={translate(0, 0)}>
          {/* Remove query button */}
          <Tooltip title="Remove query">
            <g
              transform={translate(REMOVE_ICON_SIZE / 4, dimensions.body.rowHeight / 2 - (REMOVE_ICON_SIZE / 2))}
              css={css`
                cursor: pointer;
              `}
              onClick={() => removeSetQuery()}
            >
              <rect
                width={REMOVE_ICON_SIZE}
                height={REMOVE_ICON_SIZE}
                fill="transparent"
                rx={5}
                ry={5}
              />
              <SvgIcon height={REMOVE_ICON_SIZE} width={REMOVE_ICON_SIZE}>
                <DeleteOutline />
              </SvgIcon>
            </g>
          </Tooltip>
          <text
            css={css`
              font-size: 14px;
              font-weight: 450;
            `}
            transform={translate(25, dimensions.body.rowHeight / 2)}
            dominantBaseline="middle"
          >
            <title>{setQuery?.name}</title>
            {setQuery?.name}
          </text>
          <g transform={translate(dimensions.xOffset + dimensions.set.width / 2, dimensions.body.rowHeight + (dimensions.set.width - 10))}>
            {visibleSets.map((set, index) => (
              <MemberShipCircle
                transform={translate(((dimensions.set.width / 2) + dimensions.gap / 2) * index, 0)}
                membershipStatus={getMembershipStatus(set)}
                showoutline
              />
            ))}
          </g>
          <g transform={translate(0, dimensions.body.rowHeight - 2)}>
            <SizeBar size={totalQuerySize()} color="rgb(161, 217, 155)" />
          </g>
        </g>
      </g>
    </g>
  );
};

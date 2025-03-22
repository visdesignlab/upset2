import React, { FC, useContext } from 'react';
import { useRecoilValue } from 'recoil';

import { SetMembershipStatus } from '@visdesignlab/upset2-core';
import { css } from '@emotion/react';
import { SvgIcon, Tooltip } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import { dimensionsSelector } from '../../../atoms/dimensionsAtom';
import translate from '../../../utils/transform';
import { visibleSetSelector } from '../../../atoms/config/visibleSetsAtoms';
import MemberShipCircle from '../../Columns/Matrix/MembershipCircle';
import { setQuerySelector } from '../../../atoms/config/queryBySetsAtoms';
import { ProvenanceContext } from '../../Root';
import { SizeBar } from '../../Columns/SizeBar';
import {
  DEFAULT_ROW_BACKGROUND_COLOR, DEFAULT_ROW_BACKGROUND_OPACITY, ROW_BORDER_STROKE_COLOR, ROW_BORDER_STROKE_WIDTH,
} from '../../../utils/styles';
import { setQuerySizeSelector } from '../../../atoms/setQuerySizeSelector';
import { UpsetActions } from '../../../provenance';

const REMOVE_ICON_SIZE = 16;

/**
 * Component representing a row in the set query.
 *
 * This component displays a row with information about a set query, including
 * the set query name, membership status circles for visible sets, and a size bar
 * indicating the total size of the query. It also includes a button to remove the set query.
 *
 * @component
 * @returns {JSX.Element} The rendered SetQueryRow component.
 */
export const SetQueryRow: FC = () => {
  const { actions }: {actions: UpsetActions} = useContext(ProvenanceContext);
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleSets = useRecoilValue(visibleSetSelector);
  const setQuery = useRecoilValue(setQuerySelector);
  const setQuerySize = useRecoilValue(setQuerySizeSelector);

  /**
   * Retrieves the membership status for a given set from the set query sets.
   * @param set - The name of the set.
   * @returns The membership status for the set.
   */
  function getMembershipStatusFromQuery(set: string): SetMembershipStatus {
    return setQuery?.query?.[set] ?? 'No';
  }

  /**
   * Remove the current (and only) set query.
   *
   * @returns {void} This function does not return a value.
   */
  function removeSetQuery(e: React.MouseEvent): void {
    // Prevent the SvgBase onclick handler from clearing the current intersection
    e.stopPropagation();
    actions.removeSetQuery();
  }

  return (
    <g transform={translate(0, 0)}>
      <g>
        <rect
          transform={translate(0, 2)}
          height={dimensions.body.rowHeight * 2 - 4}
          width={dimensions.body.rowWidth}
          rx={5}
          ry={10}
          fill={DEFAULT_ROW_BACKGROUND_COLOR}
          opacity={DEFAULT_ROW_BACKGROUND_OPACITY}
          stroke={ROW_BORDER_STROKE_COLOR}
          strokeWidth={ROW_BORDER_STROKE_WIDTH}
        />
        <g transform={translate(0, 0)}>
          {/* Remove query button */}
          <Tooltip title="Remove query">
            <g
              transform={translate(REMOVE_ICON_SIZE / 4, dimensions.body.rowHeight / 2 - (REMOVE_ICON_SIZE / 2))}
              css={css`
                cursor: pointer;
              `}
              onClick={removeSetQuery}
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
                membershipStatus={getMembershipStatusFromQuery(set)}
                showoutline
              />
            ))}
          </g>
          <g transform={translate(0, dimensions.body.rowHeight - 2)}>
            <SizeBar size={setQuerySize} vegaSelected={0} querySelected={0} />
          </g>
        </g>
      </g>
    </g>
  );
};

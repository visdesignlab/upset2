import { useRecoilValue } from 'recoil';

import { css } from '@emotion/react';
import { Check, Edit } from '@mui/icons-material';
import { SvgIcon, Tooltip } from '@mui/material';
import {
  useContext, useEffect, useMemo, useState,
} from 'react';
import {
  getBelongingSetsFromSetMembership,
  getRows, isRowAggregate, Row, Rows, SetMembershipStatus,
} from '@visdesignlab/upset2-core';
import { dimensionsSelector } from '../../../atoms/dimensionsAtom';
import translate from '../../../utils/transform';
import { mousePointer } from '../../../utils/styles';
import { SetMembershipRow } from './SetMembershipRow';
import { visibleSetSelector } from '../../../atoms/config/visibleSetsAtoms';
import { SizeBar } from '../../Columns/SizeBar';
import { dataAtom } from '../../../atoms/dataAtom';
import { ProvenanceContext } from '../../Root';

// edit icon size
const EDIT_ICON_SIZE = 14;
const CHECK_ICON_SIZE = 16;

export type Membership = {
  [key: string]: SetMembershipStatus;
}

function flattenRows(r: Rows): Row[] {
  const flattenedRows: Row[] = [];
  Object.values(r.values).forEach((row) => {
    if (isRowAggregate(row)) {
      flattenedRows.push(...flattenRows(row.items));
    } else {
      flattenedRows.push(row);
    }
  });

  return flattenedRows;
}

function getQueryResult(r: Rows, membership: Membership): Row[] {
  // for each row in flattened rows, check if it's set membership matches the query. If membership[set] is 'May', then it is by default a match for that set.
  const queryResults: Row[] = [];
  flattenRows(r).forEach((row) => {
    let match = true;
    Object.entries(membership).forEach(([set, status]) => {
      if (status === 'Yes' && !getBelongingSetsFromSetMembership(row.setMembership).includes(set)) {
        match = false;
      }
      if (status === 'No' && getBelongingSetsFromSetMembership(row.setMembership).includes(set)) {
        match = false;
      }
    });

    if (match) {
      queryResults.push(row);
    }
  });

  return queryResults;
}

/**
 * Query by Set interface component.
 *
 * @component
 * @returns {JSX.Element} The rendered QueryBySets component.
 */
export const QueryBySet = () => {
  const { provenance } = useContext(ProvenanceContext);
  const data = useRecoilValue(dataAtom);
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleSets = useRecoilValue(visibleSetSelector);
  const [queryName, setQueryName] = useState('Query');
  const [membership, setMembership] = useState<Membership>({});
  const rows = useMemo(() => getRows(data, provenance.getState()), [data, provenance.getState()]);

  const queryResult = useMemo(() => getQueryResult(rows, membership), [rows, membership]);

  // initialize membership with all visible sets set to 'May'
  useEffect(() => {
    const initialMembership: Membership = {};
    visibleSets.forEach((set) => {
      initialMembership[set] = 'May';
    });

    setMembership(initialMembership);
  }, []);

  // update membership when visible sets change
  useEffect(() => {
    const newMembership: Membership = {};
    visibleSets.forEach((set) => {
      newMembership[set] = membership[set] || 'May';
    });

    setMembership(newMembership);
  }, [visibleSets]);

  function handleEditQueryTitle() {
    // TODO: Address better handling of editing query title
    // eslint-disable-next-line no-alert
    setQueryName(prompt('Edit Query Title', queryName) || 'Query');
  }

  function addQuery(): void {
    // provenance action? should there be a config state for this?
  }

  /**
   * Calculates and returns the total size of the query results.
   * @returns The total size of the query results.
   */
  function getQuerySize() {
    let size = 0;

    const queryResults = queryResult;
    queryResults.forEach((result) => {
      size += result.size;
    });

    return size;
  }

  /**
   * Generates and returns the query string.
   * Ex: intersections of sets [Evil] and [Power Plant] but excluding sets [School] and[Blue Hair] and [Duff Fan] and [Male]
   * This is done in chunks based on the order of the string above
   * @returns The query string.
   */
  function getQueryResultString() {
    const membershipValues = Object.values(membership);

    // Edge cases for all columns the same
    if (membershipValues.every((status) => status === 'No')) {
      return 'the intersection that does not intersect with any selected set';
    }
    if (membershipValues.every((status) => status === 'Yes')) {
      return 'the intersection of all selected sets';
    }
    if (membershipValues.every((status) => status === 'May')) {
      return 'all intersections of all selected sets';
    }

    // base string. All results must begin with this
    let queryResultString = 'intersections of ';

    // 'May' sets have no string representation and so are ignored
    const yesSets = Object.entries(membership).filter(([_, status]) => status === 'Yes');
    const noSets = Object.entries(membership).filter(([_, status]) => status === 'No');

    /**
     * YES SETS
     */
    if (yesSets.length > 0) {
      if (yesSets.length === 1) {
        queryResultString += 'set ';
      } else {
        queryResultString += 'sets ';
      }
    }

    yesSets.forEach(([set], index) => {
      queryResultString += `[${set.replace('Set_', '')}]`;
      if (index < yesSets.length - 1) {
        queryResultString += ' and ';
      }
    });

    /**
     * NO SETS
     */
    if (noSets.length > 0) {
      if (yesSets.length > 0) {
        queryResultString += ' but excluding set';
      } else {
        queryResultString += 'excluding set';
      }
      if (noSets.length > 1) {
        queryResultString += 's';
      }
    }

    noSets.forEach(([set], index) => {
      queryResultString += ` [${set.replace('Set_', '')}]`;
      if (index < noSets.length - 1) {
        queryResultString += ' and ';
      }
    });

    return queryResultString;
  }

  return (
    <g
      transform={translate(0, 0)}
      height={dimensions.setQuery.height}
      width={dimensions.setQuery.width}
    >
      <rect
        transform={translate(0, 0)}
        height={dimensions.setQuery.height}
        width={dimensions.setQuery.width}
        opacity="0.2"
        fill="transparent"
        stroke="#555555"
        strokeWidth="1px"
      />
      {/* Query Header */}
      <g>
        <rect
          transform={translate(0, 0)}
          height={dimensions.body.rowHeight}
          width={dimensions.setQuery.width}
          fill="#cccccc"
          opacity="0.3"
          stroke="#555555"
          strokeWidth="1px"
        />
        <g
          transform={translate(20, 0)}
        >
          <text
            css={css`
                font-size: 14px;
                font-weight: 450;
              `}
            dominantBaseline="middle"
            transform={translate(5, dimensions.body.rowHeight / 2)}
          >
            <title>{queryName}</title>
            {queryName}
          </text>
          <g
            css={mousePointer}
            transform={translate(-EDIT_ICON_SIZE, EDIT_ICON_SIZE / 4)}
            onClick={handleEditQueryTitle}
          >
            <SvgIcon
              height={EDIT_ICON_SIZE}
              width={EDIT_ICON_SIZE}
            >
              <Edit />
            </SvgIcon>
          </g>
        </g>
      </g>
      {/* Query matrix */}
      <g transform={translate(dimensions.set.width / 2, 0)}>
        <g
          transform={translate(dimensions.xOffset, dimensions.body.rowHeight - 10)}
        >
          <g transform={translate(0, dimensions.body.rowHeight - 3)}>
            <SetMembershipRow combined members={membership} setMembers={setMembership} />
            <line
              transform={translate(0)}
              x1={-10}
              y1={dimensions.body.rowHeight / 2}
              x2={dimensions.matrixColumn.visibleSetsWidth - 10}
              y2={dimensions.body.rowHeight / 2}
              stroke="#555555"
              opacity="0.4"
              strokeWidth="1px"
            />
          </g>
          <g transform={translate(0, dimensions.body.rowHeight * 2)}>
            <SetMembershipRow membershipType="No" members={membership} setMembers={setMembership} />
          </g>
          <g transform={translate(0, dimensions.body.rowHeight * 3)}>
            <SetMembershipRow membershipType="May" members={membership} setMembers={setMembership} />
          </g>
          <g transform={translate(0, dimensions.body.rowHeight * 4)}>
            <SetMembershipRow membershipType="Yes" members={membership} setMembers={setMembership} />
          </g>
        </g>
      </g>
      {/* Add query button */}
      <g
        transform={translate(dimensions.matrixColumn.width +
          dimensions.bookmarkStar.gap, dimensions.body.rowHeight + CHECK_ICON_SIZE / 4)}
      >
        <Tooltip title="Add Query">
          <g>
            <rect
              height={CHECK_ICON_SIZE}
              width={CHECK_ICON_SIZE}
              fill="transparent"
              onClick={() => addQuery()}
            />
            <SvgIcon height={CHECK_ICON_SIZE} width={CHECK_ICON_SIZE}>
              <Check />
            </SvgIcon>
          </g>
        </Tooltip>
      </g>
      {/* Query size bar */}
      <g transform={translate(0, dimensions.body.rowHeight)}>
        <SizeBar size={getQuerySize()} color="rgb(161, 217, 155)" />
      </g>
      {/* Query result text */}
      <g
        transform={translate(
          dimensions.matrixColumn.width +
          dimensions.bookmarkStar.gap +
          dimensions.bookmarkStar.width +
          dimensions.bookmarkStar.gap,
          dimensions.body.rowHeight * 2.5,
        )}
      >
        <foreignObject
          width={
            dimensions.setQuery.width -
            (dimensions.matrixColumn.width + // gap from side to sizebar
            dimensions.bookmarkStar.gap +
            dimensions.bookmarkStar.width +
            dimensions.bookmarkStar.gap)
          }
          height={dimensions.setQuery.height - dimensions.body.rowHeight * 2.5}
        >
          <p
            css={css`text-wrap: normal; margin: 0; padding: 0;`}
          >
            {getQueryResultString()}
          </p>
        </foreignObject>
      </g>
    </g>
  );
};

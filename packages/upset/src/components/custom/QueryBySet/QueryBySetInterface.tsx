import { useRecoilValue, useSetRecoilState } from 'recoil';
import { css } from '@emotion/react';
import { Check, Edit } from '@mui/icons-material';
import { SvgIcon, Tooltip } from '@mui/material';
import {
  useCallback,
  useContext, useEffect, useMemo, useState,
} from 'react';
import {
  getRows, getQueryResult,
  SetQueryMembership,
  isRowAggregate,
} from '@visdesignlab/upset2-core';
import { dimensionsSelector } from '../../../atoms/dimensionsAtom';
import translate from '../../../utils/transform';
import {
  mousePointer, DEFAULT_ROW_BACKGROUND_COLOR, ROW_BORDER_STROKE_COLOR, ROW_BORDER_STROKE_WIDTH, DEFAULT_ROW_BACKGROUND_OPACITY,
} from '../../../utils/styles';
import { SetMembershipRow } from './SetMembershipRow';
import { visibleSetSelector } from '../../../atoms/config/visibleSetsAtoms';
import { SizeBar } from '../../Columns/SizeBar';
import { dataAtom } from '../../../atoms/dataAtom';
import { ProvenanceContext } from '../../Root';
import { queryBySetsInterfaceAtom } from '../../../atoms/config/queryBySetsAtoms';
import { UpsetActions, UpsetProvenance } from '../../../provenance';
import { columnSelectAtom } from '../../../atoms/highlightAtom';
import { currentSelectionType, currentIntersectionSelector } from '../../../atoms/config/selectionAtoms';

// edit icon size
const EDIT_ICON_SIZE = 14;
const CHECK_ICON_SIZE = 16;

/**
 * Query by Set interface component.
 *
 * @component
 * @returns {JSX.Element} The rendered QueryBySets component.
 */
export const QueryBySetInterface = () => {
  const { provenance, actions }: {provenance: UpsetProvenance, actions: UpsetActions} = useContext(ProvenanceContext);
  const data = useRecoilValue(dataAtom);
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleSets = useRecoilValue(visibleSetSelector);
  const setQueryInterface = useSetRecoilState(queryBySetsInterfaceAtom);
  const [queryName, setQueryName] = useState('Query');
  const [membership, setMembership] = useState<SetQueryMembership>({});
  const rows = useMemo(() => getRows(data, provenance.getState(), true), [data, provenance.getState()]);
  const setColumnSelect = useSetRecoilState(columnSelectAtom);
  const currentIntersection = useRecoilValue(currentIntersectionSelector);
  const selectionType = useRecoilValue(currentSelectionType);

  const queryResult = useMemo(() => getQueryResult(rows, membership), [rows, membership]);

  // update membership when visible sets change
  useEffect(() => {
    const newMembership: SetQueryMembership = {};
    visibleSets.forEach((set) => {
      newMembership[set] = membership[set] || 'May';
    });

    setMembership(newMembership);
  }, [visibleSets]);

  function handleEditQueryTitle() {
    // There is likely a better way to do this, but for now alert works fine.
    // eslint-disable-next-line no-alert
    setQueryName(prompt('Edit Query Title', queryName) || 'Query');
  }

  /**
   * Calculates and returns the total size of the query results.
   * @returns The total size of the query results.
   */
  const querySize = useMemo(() => {
    let size = 0;

    const queryResults = Object.values(queryResult.values);
    queryResults.forEach((row) => {
      if (!isRowAggregate(row)) {
        size += row.size;
      }
    });

    return size;
  }, [queryResult]);

  /**
   * Generates and returns the query string.
   * Ex: intersections of sets [Evil] and [Power Plant] but excluding sets [School] and[Blue Hair] and [Duff Fan] and [Male]
   * This is done in chunks based on the order of the string above
   * @returns The query string.
   */
  const queryResultString = useMemo(() => {
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
    let queryString = 'intersections of ';

    // 'May' sets have no string representation and so are ignored
    const yesSets = Object.entries(membership).filter(([_, status]) => status === 'Yes');
    const noSets = Object.entries(membership).filter(([_, status]) => status === 'No');

    /**
     * YES SETS
     */
    if (yesSets.length > 0) {
      if (yesSets.length === 1) {
        queryString += 'set ';
      } else {
        queryString += 'sets ';
      }
    }

    yesSets.forEach(([set], index) => {
      queryString += `[${set.replace('Set_', '')}]`;
      if (index < yesSets.length - 1) {
        queryString += ' and ';
      }
    });

    /**
     * NO SETS
     */
    if (noSets.length > 0) {
      if (yesSets.length > 0) {
        queryString += ' but excluding set';
      } else {
        queryString += 'excluding set';
      }
      if (noSets.length > 1) {
        queryString += 's';
      }
    }

    noSets.forEach(([set], index) => {
      queryString += ` [${set.replace('Set_', '')}]`;
      if (index < noSets.length - 1) {
        queryString += ' and ';
      }
    });

    return queryString;
  }, [membership, queryResult]);

  /**
   * Adds a new query to the set of queries.
   *
   * This function creates a query object with the current query name and membership,
   * then calls the `addSetQuery` action with the query object and the query result string.
   * Finally, it sets the query interface to false.
   *
   * @callback addQuery
   * @param {string} queryName - The name of the query.
   * @param {string} membership - The membership information for the query.
   * @param {string} queryResultString - The result string of the query.
   * @returns {void}
   */
  const addQuery = useCallback(() => {
    const query = {
      name: queryName,
      query: membership,
    };

    // We need to clear the current selection in case the selected row disappears after query
    if (currentIntersection !== null) actions.setRowSelection(null);
    if (selectionType === 'row') actions.setSelectionType(null);
    actions.addSetQuery(query, queryResultString);
    setColumnSelect([]); // Column select doesn't clear itself for some reason
    setQueryInterface(false);
  }, [queryName, membership, queryResultString]);

  return (
    <g
      transform={translate(0, 0)}
      height={dimensions.setQuery.height}
      width={dimensions.setQuery.width}
      // Prevent the SvgBase onClick from clearing the current intersection
      onClick={(e) => e.stopPropagation()}
    >
      <rect
        transform={translate(0, 0)}
        height={dimensions.setQuery.height}
        width={dimensions.setQuery.width}
        opacity="0.2"
        fill="transparent"
        stroke={ROW_BORDER_STROKE_COLOR}
        strokeWidth={ROW_BORDER_STROKE_WIDTH}
      />
      {/* Query Header */}
      <g>
        <rect
          transform={translate(0, 0)}
          height={dimensions.body.rowHeight}
          width={dimensions.setQuery.width}
          fill={DEFAULT_ROW_BACKGROUND_COLOR}
          opacity={DEFAULT_ROW_BACKGROUND_OPACITY}
          stroke={ROW_BORDER_STROKE_COLOR}
          strokeWidth={ROW_BORDER_STROKE_WIDTH}
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
            <rect
              height={EDIT_ICON_SIZE}
              width={EDIT_ICON_SIZE}
              fill="transparent"
            />
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
              opacity="0.4"
              stroke={ROW_BORDER_STROKE_COLOR}
              strokeWidth={ROW_BORDER_STROKE_WIDTH}
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
              onClick={addQuery}
            />
            <SvgIcon height={CHECK_ICON_SIZE} width={CHECK_ICON_SIZE}>
              <Check />
            </SvgIcon>
          </g>
        </Tooltip>
      </g>
      {/* Query size bar */}
      <g transform={translate(0, dimensions.body.rowHeight)}>
        <SizeBar size={querySize} vegaSelected={0} querySelected={0} />
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
            {queryResultString}
          </p>
        </foreignObject>
      </g>
    </g>
  );
};

import { css } from '@emotion/react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import React, { useContext } from 'react';
import { Tooltip } from '@mui/material';
import { SortByOrder } from '@visdesignlab/upset2-core';
import { sortByOrderSelector, sortBySelector } from '../../atoms/config/sortByAtom';
import translate from '../../utils/transform';
import { HeaderSortArrow } from '../custom/HeaderSortArrow';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { contextMenuAtom } from '../../atoms/contextMenuAtom';
import { ProvenanceContext } from '../Root';
import { allowAttributeRemovalAtom } from '../../atoms/config/allowAttributeRemovalAtom';
import { UpsetActions } from '../../provenance';

export const DegreeHeader = () => {
  const { actions }: {actions: UpsetActions} = useContext(ProvenanceContext);
  const sortBy = useRecoilValue(sortBySelector);
  const sortByOrder = useRecoilValue(sortByOrderSelector);
  const dimensions = useRecoilValue(dimensionsSelector);
  const allowAttributeRemoval = useRecoilValue(allowAttributeRemovalAtom);

  const setContextMenu = useSetRecoilState(contextMenuAtom);

  const sortByDegree = (order: SortByOrder) => {
    actions.sortBy('Degree', order);
  };

  const handleOnClick = (e: React.MouseEvent<SVGElement>) => {
    if (sortBy !== 'Degree') {
      sortByDegree('Ascending');
    } else {
      sortByDegree(sortByOrder === 'Ascending' ? 'Descending' : 'Ascending');
    }
    // To prevent the handler on SvgBase that deselects the current intersection
    e.stopPropagation();
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const getMenuItems = () => {
    const items = [
      {
        label: 'Sort by Degree - Ascending',
        onClick: () => {
          sortByDegree('Ascending');
          handleContextMenuClose();
        },
        disabled: sortBy === 'Degree' && sortByOrder === 'Ascending',
      },
      {
        label: 'Sort by Degree - Descending',
        onClick: () => {
          sortByDegree('Descending');
          handleContextMenuClose();
        },
        disabled: sortBy === 'Degree' && sortByOrder === 'Descending',
      },
    ];

    // Add remove attribute option if allowed
    if (allowAttributeRemoval) {
      items.push({
        label: 'Remove Degree',
        onClick: () => {
          actions.removeAttribute('Degree');
          handleContextMenuClose();
        },
        disabled: false,
      });
    }

    return items;
  };

  const openContextMenu = (e: MouseEvent) => {
    setContextMenu(
      {
        mouseX: e.clientX,
        mouseY: e.clientY,
        id: 'header-menu-degree',
        items: getMenuItems(),
      },
    );
  };

  return (
    <g
      transform={translate(
        0,
        dimensions.attribute.gap + 1, // not really sure why, but this needs a 1px increase for degree
      )}

    >
      <Tooltip title="Number of intersecting sets" arrow placement="top">
        <g
          className="degree-button"
          css={css`
            cursor: context-menu;
            &:hover {
            opacity: 0.7;
            transition: opacity 0s;
            }
          `}
          onContextMenu={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            openContextMenu(e);
          }}
          onClick={handleOnClick}
        >
          <rect
            fill="#ccc"
            stroke="#000"
            opacity="0.5"
            strokeWidth="0.3px"
            height={dimensions.size.buttonHeight}
            width={dimensions.degreeColumn.width}
          />
          <g
            transform={translate(
              dimensions.degreeColumn.width / 2,
              dimensions.size.buttonHeight / 2,
            )}
          >
            <text
              id="header-text"
              transform={
                translate(0, 2)
              }
              css={css`
                  pointer-event: none;
                `}
              dominantBaseline="middle"
              textAnchor="middle"
            >
              #
            </text>
            { sortBy === 'Degree' &&
            <HeaderSortArrow translateX={(dimensions.degreeColumn.width / 2) - 16} />}
          </g>
        </g>
      </Tooltip>
    </g>
  );
};

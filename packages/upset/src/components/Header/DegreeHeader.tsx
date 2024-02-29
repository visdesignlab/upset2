import { css } from '@emotion/react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useContext } from 'react';
import { Tooltip } from '@mui/material';
import { sortByOrderSelector, sortBySelector } from '../../atoms/config/sortByAtom';
import translate from '../../utils/transform';
import { HeaderSortArrow } from '../custom/HeaderSortArrow';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { contextMenuAtom } from '../../atoms/contextMenuAtom';
import { ProvenanceContext } from '../Root';

export const DegreeHeader = () => {
  const { actions } = useContext(ProvenanceContext);
  const sortBy = useRecoilValue(sortBySelector);
  const sortByOrder = useRecoilValue(sortByOrderSelector);
  const dimensions = useRecoilValue(dimensionsSelector);

  const setContextMenu = useSetRecoilState(contextMenuAtom);

  const sortByDegree = (order: string) => {
    actions.sortBy('Degree', order);
  };

  const handleOnClick = () => {
    if (sortBy !== 'Degree') {
      sortByDegree('Ascending');
    } else {
      sortByDegree(sortByOrder === 'Ascending' ? 'Descending' : 'Ascending');
    }
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const getMenuItems = () => [
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
        dimensions.matrixColumn.width +
        dimensions.bookmarkStar.gap +
        dimensions.bookmarkStar.width +
        dimensions.bookmarkStar.gap,
        dimensions.header.totalHeight - dimensions.attribute.buttonHeight - dimensions.attribute.scaleHeight + 1,
      )}

    >
      <Tooltip title="Degree" arrow placement="top">
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

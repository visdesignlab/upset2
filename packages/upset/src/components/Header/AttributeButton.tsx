import { FC, useContext } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { SortBy, SortByOrder } from '@visdesignlab/upset2-core';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { ProvenanceContext } from '../Root';
import { sortByOrderSelector, sortBySelector } from '../../atoms/config/sortByAtom';
import { contextMenuAtom } from '../../atoms/contextMenuAtom';
import { HeaderSortArrow } from '../custom/HeaderSortArrow';

/** @jsxImportSource @emotion/react */
type Props = {
  label: string;
  sortable?: boolean;
};

export const AttributeButton: FC<Props> = ({ label, sortable = false }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const { actions } = useContext(
    ProvenanceContext,
  );
  const sortBy = useRecoilValue(sortBySelector);
  const sortByOrder = useRecoilValue(sortByOrderSelector);
  const setContextMenu = useSetRecoilState(contextMenuAtom);

  const sortByHeader = (order: SortByOrder) => {
    actions.sortBy(label as SortBy, order);
  };

  const handleOnClick = () => {
    if (sortable) {
      if (sortBy !== label) {
        sortByHeader('Ascending');
      } else {
        sortByHeader(sortByOrder === 'Ascending' ? 'Descending' : 'Ascending');
      }
    }
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const getMenuItems = () => {
    const items = [];
    if (sortable) {
      items.push(
        {
          label: `Sort by ${label} - Ascending`,
          onClick: () => {
            sortByHeader('Ascending');
            handleContextMenuClose();
          },
          disabled: sortBy === label && sortByOrder === 'Ascending',
        },
        {
          label: `Sort by ${label} - Descending`,
          onClick: () => {
            sortByHeader('Descending');
            handleContextMenuClose();
          },
          disabled: sortBy === label && sortByOrder === 'Descending',
        },
      );
    }
    items.push({
      label: `Remove ${label}`,
      onClick: () => {
        actions.removeAttribute(label);
        handleContextMenuClose();
      },
    });

    return items;
  };

  const openContextMenu = (e: MouseEvent) => {
    setContextMenu(
      {
        mouseX: e.clientX,
        mouseY: e.clientY,
        id: `header-menu-${label}`,
        items: getMenuItems(),
      },
    );
  };

  return (
    <g
      css={{
        '&:hover': {
          opacity: 0.7,
        },
        cursor: 'context-menu',
      }}
      onContextMenu={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        openContextMenu(e);
      }}
      transform={translate(0, 6)}
      onClick={handleOnClick}
    >
      <rect
        height={dimensions.attribute.buttonHeight}
        width={dimensions.attribute.width}
        fill="#ccc"
        stroke="#000"
        opacity="0.5"
        strokeWidth="0.3px"
      />
      <g
        transform={translate(
          dimensions.attribute.width / 2,
          dimensions.attribute.buttonHeight / 2,
        )}
      >
        <text
          id={`header-text-${label}`}
          pointerEvents={sortable ? 'default' : 'none'}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {label}
        </text>
        {(sortable && sortBy === label) &&
          <HeaderSortArrow />}
      </g>
    </g>
  );
};

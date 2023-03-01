import { FC, useContext } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { SortBy } from '@visdesignlab/upset2-core';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { ProvenanceContext } from '../Root';
import { sortBySelector } from '../../atoms/config/sortByAtom';
import { contextMenuAtom } from '../../atoms/contextMenuAtom';

/** @jsxImportSource @emotion/react */
type Props = {
  label: string;
  sort?: boolean;
};

export const AttributeButton: FC<Props> = ({ label, sort = false }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const { actions } = useContext(
    ProvenanceContext,
  );
  const sortBy = useRecoilValue(sortBySelector);
  const setContextMenu = useSetRecoilState(contextMenuAtom);

  const handleContextMenuClose = () => {
    setContextMenu(null);
  }

  const openContextMenu = (e: React.MouseEvent) => {
    setContextMenu(
      {
        mouseX: e.clientX,
        mouseY: e.clientY,
        id: `header-menu-${label}`,
        items: getMenuItems()
      }
    );
  }

  const sortByHeader = () => {
    actions.sortBy(label as SortBy);
  }

  const getMenuItems = () => {
    const items = [];
    if (sort) {
      items.push({
        label: `Sort by ${label}`,
        onClick: () => {
          sortByHeader();
          handleContextMenuClose();
        },
        disabled: sortBy === label,
      })
    }
    items.push({
      label: `Remove ${label}`,
      onClick: () => {
        actions.removeAttribute(label);
        handleContextMenuClose();
      },
    })

    return items;
  }

  return (
    <g
      css={{
        '&:hover': {
          opacity: 0.7,
        },
        cursor: (sort ? 'context-menu' : 'default'),
      }}
      onContextMenu={(e) => {
          e.preventDefault();
          openContextMenu(e);
      }}
    >
      <rect
        height={dimensions.attribute.buttonHeight}
        width={dimensions.attribute.width}
        css={{
          fill: '#ccc',
          stroke: 'black',
          opacity: 0.5,
          'stroke-width': ' 0.3px',
        }}
      />
      <text
        pointerEvents={sort ? 'default' : 'none'}
        dominantBaseline="middle"
        transform={translate(
          dimensions.attribute.width / 2,
          dimensions.attribute.buttonHeight / 2,
        )}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
};

import { FC, useContext, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { SortBy } from '@visdesignlab/upset2-core';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { ProvenanceContext } from '../Root';
import { sortBySelector } from '../../atoms/config/sortByAtom';
import { Menu, MenuItem, css } from '@mui/material';
import { attributeAtom } from '../../atoms/attributeAtom';

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
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const attributes = useRecoilValue(attributeAtom);

  const handleContextMenuClose = () => {
    setContextMenu(null);
  }

  const handleContextMenuOpen = (event: React.MouseEvent) => {
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX,
            mouseY: event.clientY,
          }
        : null,
    );
  }

  const sortByHeader = () => {
    actions.sortBy(label as SortBy);
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
          handleContextMenuOpen(e);
      }}
    >
      <Menu
        id="header-context-menu"
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        css={css`
          width: 100%;
        `}
      >
        { sort &&
        <MenuItem onClick={() => {
            sortByHeader();
            handleContextMenuClose();
          }} 
          disabled={sortBy === label}>
            Sort by {label}
        </MenuItem>
        }
        <MenuItem onClick={() => {
            actions.removeAttribute(label);
          }}>
            Remove {label}
        </MenuItem>
      </Menu>
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

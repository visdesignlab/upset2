import React, { FC, useContext } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { SortByOrder, AttributePlotType } from '@visdesignlab/upset2-core';

import { Tooltip } from '@mui/material';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { ProvenanceContext } from '../Root';
import { sortByOrderSelector, sortBySelector } from '../../atoms/config/sortByAtom';
import { contextMenuAtom } from '../../atoms/contextMenuAtom';
import { HeaderSortArrow } from '../custom/HeaderSortArrow';
import { ContextMenuItem } from '../../types';
import { allowAttributeRemovalAtom } from '../../atoms/config/allowAttributeRemovalAtom';
import { attributePlotsSelector } from '../../atoms/config/plotAtoms';

/** @jsxImportSource @emotion/react */
type Props = {
  /**
   * Text to display on the attribute button
   */
  label: string;
  /**
   * Text to display on the attribute button tooltip.
   * Optional, defaults to label
   * HTML will be rendered in the tooltip
   */
  tooltip?: string;
};

/**
 * Represents a button component for sorting and removing attributes in the header.
 *
 * @component
 * @example
 * return (
 *   <AttributeButton label="Name" />
 * )
 */
export const AttributeButton: FC<Props> = ({ label, tooltip }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const { actions } = useContext(
    ProvenanceContext,
  );
  const sortBy = useRecoilValue(sortBySelector);
  const sortByOrder = useRecoilValue(sortByOrderSelector);
  const setContextMenu = useSetRecoilState(contextMenuAtom);

  const attributePlots = useRecoilValue(attributePlotsSelector);

  const allowAttributeRemoval = useRecoilValue(allowAttributeRemovalAtom);

  /**
   * Sorts the attribute in the specified order.
   *
   * @param order - The sort order ('Ascending' or 'Descending').
   */
  const sortByHeader = (order: SortByOrder) => {
    actions.sortBy(label, order);
  };

  /**
   * Handles the click event of the button.
   * If the attribute is not currently sorted, it sorts it in ascending order.
   * If the attribute is already sorted, it toggles between ascending and descending order.
   */
  const handleOnClick = (e: React.MouseEvent<SVGElement>) => {
    if (sortBy !== label) {
      sortByHeader('Ascending');
    } else {
      sortByHeader(sortByOrder === 'Ascending' ? 'Descending' : 'Ascending');
    }
    // To prevent the handler on SvgBase that deselects the current intersection
    e.stopPropagation();
  };

  /**
   * Closes the context menu.
   */
  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  /**
   * Returns an array of menu items for the context menu.
   *
   * @returns An array of menu items.
   */
  function getMenuItems(): ContextMenuItem[] {
    const items = [
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
    ];

    if (!['Degree', 'Deviation'].includes(label)) {
    // for every possible value of the type AttributePlotType (from core), add a menu item
      Object.values(AttributePlotType).forEach((plot) => {
        items.push(
          {
            label: `Change plot type to ${plot}`,
            onClick: () => {
              actions.updateAttributePlotType(label, plot);
              handleContextMenuClose();
            },
            disabled: attributePlots[label] === plot,
          },
        );
      });
    }

    // Add remove attribute option if allowed
    if (allowAttributeRemoval) {
      items.push(
        {
          label: `Remove ${label}`,
          onClick: () => {
            actions.removeAttribute(label);
            handleContextMenuClose();
          },
          disabled: false,
        },
      );
    }

    return items;
  }

  /**
   * Opens the context menu at the specified coordinates.
   *
   * @param e - The mouse event.
   */
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
    <Tooltip title={<div dangerouslySetInnerHTML={{ __html: tooltip ?? label }} />} arrow placement="top">
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
            pointerEvents="default"
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {label}
          </text>
          {(sortBy === label) &&
            <HeaderSortArrow />}
        </g>
      </g>
    </Tooltip>
  );
};

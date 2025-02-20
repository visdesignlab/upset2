import { Row } from '@visdesignlab/upset2-core';
import StarIcon from '@mui/icons-material/Star';
import { FC, MouseEvent, useContext, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { ProvenanceContext } from '../Root';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import {
  bookmarkedColorSelector,
  isRowBookmarkedSelector,
} from '../../atoms/config/currentIntersectionAtom';

type Props = {
  row: Row;
};

const BASE_OPACITY = 0.0;
const HOVERED_OPACITY = 0.5;
const BOOKMARKED_OPACITY = 1.0;

/**
 * BookmarkStar component renders a star icon that can be bookmarked.
 * It changes its color and opacity based on the bookmark and hover states.
 *
 * @component
 * @param {Props} props - The properties object.
 * @param {Object} props.row - The row data for the current item.
 * @returns {JSX.Element} The rendered BookmarkStar component.
 *
 * @example
 * <BookmarkStar row={row} />
 */
export const BookmarkStar: FC<Props> = ({ row }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const bookmarked = useRecoilValue(isRowBookmarkedSelector(row));
  const color = useRecoilValue(bookmarkedColorSelector(row));
  const { actions } = useContext(ProvenanceContext);

  const rowDisplayName = row.elementName.replaceAll('~&~', ' & ') || '';

  const [hovered, setHovered] = useState(false);

  /**
   * Calculates the opacity value based on the bookmark and hover states.
   *
   * @returns {number} The opacity value which can be one of the following:
   * - `BOOKMARKED_OPACITY` if the item is bookmarked.
   * - `HOVERED_OPACITY` if the item is hovered.
   * - `BASE_OPACITY` if neither condition is met.
   *
   * @param {boolean} bookmarked - Indicates if the item is bookmarked.
   * @param {boolean} hovered - Indicates if the item is hovered.
   */
  const opacity = useMemo(() => {
    if (bookmarked) {
      return BOOKMARKED_OPACITY;
    }

    if (hovered) {
      return HOVERED_OPACITY;
    }

    return BASE_OPACITY;
  }, [bookmarked, hovered]);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  /**
   * Handles the click event on the bookmark star icon.
   * Stops the event from propagating and adds a bookmark with the specified details.
   *
   * @param event - The mouse event triggered by clicking the bookmark star icon.
   */
  const handleClick = (event: MouseEvent<SVGGElement, MouseEvent>) => {
    event.stopPropagation();
    if (bookmarked) {
      actions.removeBookmark({
        id: row.id,
        label: rowDisplayName,
        type: 'intersection',
      });
    } else {
      actions.addBookmark({
        id: row.id,
        label: rowDisplayName,
        size: row.size,
        type: 'intersection',
      });
    }
  };

  return (
    <g
      transform={translate(
        dimensions.matrixColumn.width + dimensions.bookmarkStar.gap,
        0,
      )}
      height={dimensions.body.rowHeight}
      width={dimensions.set.width}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e: any) => handleClick(e)}
    >
      <rect
        height={dimensions.body.rowHeight}
        width={dimensions.set.width}
        fill="transparent"
      />
      <StarIcon
        height={dimensions.body.rowHeight}
        width={dimensions.set.width}
        fontSize={'1em' as any}
        sx={{
          color,
          fillOpacity: opacity,
        }}
      />
    </g>
  );
};

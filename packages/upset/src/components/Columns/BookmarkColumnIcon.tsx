import { Row } from '@visdesignlab/upset2-core';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import {
  FC, MouseEvent, useContext, useMemo,
} from 'react';
import { useRecoilValue } from 'recoil';
import { ProvenanceContext } from '../Root';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import {
  bookmarkColorSelector, currentIntersectionSelector, currentSelectionType, isRowBookmarkedSelector,
} from '../../atoms/config/selectionAtoms';
import { UpsetActions } from '../../provenance';
import { rowHoverAtom } from '../../atoms/highlightAtom';

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
export const BookmarkColumnIcon: FC<Props> = ({ row }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const bookmarked = useRecoilValue(isRowBookmarkedSelector(row));
  const color = useRecoilValue(bookmarkColorSelector(row.id));
  const hovered = useRecoilValue(rowHoverAtom) === row.id;
  const selected = useRecoilValue(currentIntersectionSelector)?.id === row.id;
  const selectionType = useRecoilValue(currentSelectionType);
  const { actions }: {actions: UpsetActions} = useContext(ProvenanceContext);

  const rowDisplayName = row.elementName.replaceAll('~&~', ' & ') || '';

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
    if (bookmarked || (selected && selectionType === 'row')) {
      return BOOKMARKED_OPACITY;
    }

    if (hovered) {
      return HOVERED_OPACITY;
    }

    return BASE_OPACITY;
  }, [bookmarked, selected, hovered, selectionType]);

  /**
   * Handles the click event on the bookmark star icon.
   * Stops the event from propagating and adds a bookmark with the specified details.
   *
   * @param event - The mouse event triggered by clicking the bookmark star icon.
   */
  const handleClick = (event: MouseEvent<SVGGElement, MouseEvent>) => {
    event.stopPropagation();
    const bookmark = {
      id: row.id,
      label: rowDisplayName,
      size: row.size,
    };
    if (bookmarked) {
      actions.removeBookmark(bookmark);
    } else {
      actions.addBookmark(bookmark);
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
      onClick={(e: any) => handleClick(e)}
    >
      <rect
        height={dimensions.body.rowHeight}
        width={dimensions.set.width}
        fill="transparent"
      />
      {bookmarked ?
        <BookmarkIcon
          height={dimensions.body.rowHeight}
          width={dimensions.set.width}
          fontSize={'1em' as any}
          sx={{
            color,
            fillOpacity: opacity,
          }}
        />
        :
        <BookmarkBorderIcon
          height={dimensions.body.rowHeight}
          width={dimensions.set.width}
          fontSize={'1em' as any}
          sx={{
            color,
            fillOpacity: opacity,
          }}
        />}
    </g>
  );
};

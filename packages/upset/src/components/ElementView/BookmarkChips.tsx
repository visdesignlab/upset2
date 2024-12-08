import SquareIcon from '@mui/icons-material/Square';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Chip, Stack } from '@mui/material';
import { useContext } from 'react';
import { useRecoilValue } from 'recoil';

import {
  Bookmark, BookmarkedIntersection, flattenedOnlyRows, isBookmarkedIntersection,
  isElementSelection,
} from '@visdesignlab/upset2-core';
import {
  bookmarkedColorPalette,
  bookmarkSelector,
  currentIntersectionSelector,
  elementColorSelector,
  nextColorSelector,
} from '../../atoms/config/currentIntersectionAtom';
import { ProvenanceContext } from '../Root';
import { dataAtom } from '../../atoms/dataAtom';
import { UpsetActions, UpsetProvenance } from '../../provenance';
import { selectedElementSelector } from '../../atoms/elementsSelectors';

/**
 * Shows a stack of chips representing bookmarks and the current intersection/element selection,
 * with options to add and remove bookmarks
 */
export const BookmarkChips = () => {
  const { provenance, actions }: {provenance: UpsetProvenance, actions: UpsetActions} = useContext(ProvenanceContext);
  const currentIntersection = useRecoilValue(currentIntersectionSelector);
  const colorPallete = useRecoilValue(bookmarkedColorPalette);
  const nextColor = useRecoilValue(nextColorSelector);
  const data = useRecoilValue(dataAtom);
  const rows = flattenedOnlyRows(data, provenance.getState());
  const bookmarked = useRecoilValue(bookmarkSelector);
  const currentIntersectionDisplayName = currentIntersection?.elementName.replaceAll('~&~', ' & ') || '';
  const currentSelection = useRecoilValue(selectedElementSelector);
  const elementSelectionColor = useRecoilValue(elementColorSelector);

  /**
   * Handles when a chip in the bookmark stack is clicked
   * @param bookmark Clicked bookmark
   */
  function chipClicked(bookmark: Bookmark) {
    if (isBookmarkedIntersection(bookmark)) {
      if (currentIntersection?.id === bookmark.id) actions.setSelected(null);
      else actions.setSelected(rows[bookmark.id]);
    } else if (isElementSelection(bookmark)) {
      // Need to update both the saved trrack state & the selection atom when a chip is clicked
      if (currentSelection?.id === bookmark.id) actions.setElementSelection(null);
      else actions.setElementSelection(bookmark);
    }
  }

  return (
    <Stack direction="row" sx={{ flexFlow: 'row wrap' }}>
      {/* All chips from bookmarks */}
      {bookmarked.map((bookmark) => (
        <Chip
          disabled={bookmark.type === 'intersection' && rows[bookmark.id] === undefined}
          sx={(theme) => ({
            margin: theme.spacing(0.5),
            '.MuiChip-icon': {
              color: colorPallete[bookmark.id],
            },
            backgroundColor:
                bookmark.id === currentIntersection?.id || bookmark.id === currentSelection?.id
                  ? 'rgba(0,0,0,0.2)'
                  : 'default',
          })}
          key={bookmark.id}
          aria-label={`Bookmarked intersection ${bookmark.label}${
            isBookmarkedIntersection(bookmark) ? `, size ${bookmark.size}` : ''}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              chipClicked(bookmark);
            }
          }}
          label={isBookmarkedIntersection(bookmark)
            ? `${bookmark.label} - ${bookmark.size}` : `${bookmark.label}`}
          icon={<SquareIcon fontSize={'1em' as any} />}
          deleteIcon={<StarIcon />}
          onClick={() => {
            chipClicked(bookmark);
          }}
          onDelete={() => {
            if (currentIntersection?.id === bookmark.id) {
              actions.setSelected(null);
            } else if (currentSelection?.id === bookmark.id) {
              actions.setElementSelection(null);
            }
            actions.removeBookmark(bookmark);
          }}
        />
      ))}
      {/* Chip for the currently selected intersection */}
      {currentIntersection && !bookmarked.find((b) => b.id === currentIntersection.id) && (
      <Chip
        sx={(theme) => ({
          margin: theme.spacing(0.5),
          '.MuiChip-icon': {
            color: nextColor,
          },
          backgroundColor: 'rgba(0,0,0,0.2)',
        })}
        icon={<SquareIcon fontSize={'1em' as any} />}
        aria-label={`Selected intersection ${currentIntersectionDisplayName}, size ${currentIntersection.size}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            actions.addBookmark<BookmarkedIntersection>({
              id: currentIntersection.id,
              label: currentIntersectionDisplayName,
              size: currentIntersection.size,
              type: 'intersection',
            });
          }
        }}
        onClick={() => actions.setSelected(null)}
        label={`${currentIntersectionDisplayName} - ${currentIntersection.size}`}
        onDelete={() => {
          actions.addBookmark<BookmarkedIntersection>({
            id: currentIntersection.id,
            label: currentIntersectionDisplayName,
            size: currentIntersection.size,
            type: 'intersection',
          });
        }}
        deleteIcon={<StarBorderIcon />}
      />
      )}
      {/* Chip for the current element selection */}
      {currentSelection && !bookmarked.find((b) => b.id === currentSelection.id) && (
      <Chip
        sx={(theme) => ({
          margin: theme.spacing(0.5),
          '.MuiChip-icon': {
            color: elementSelectionColor,
          },
          backgroundColor: 'rgba(0,0,0,0.2)',
        })}
        icon={<SquareIcon fontSize={'1em' as any} />}
        aria-label={`Selected elements ${currentSelection.label}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            actions.addBookmark(structuredClone(currentSelection));
          }
        }}
        onClick={() => actions.setElementSelection(null)}
        label={`${currentSelection.label}`}
        onDelete={() => {
          actions.addBookmark(structuredClone(currentSelection));
        }}
        deleteIcon={<StarBorderIcon />}
      />
      )}
    </Stack>
  );
};

import SquareIcon from '@mui/icons-material/Square';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import { Chip, Stack } from '@mui/material';
import { useContext, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import {
  Bookmark, elementSelectionToString, flattenedOnlyRows,
} from '@visdesignlab/upset2-core';
import {
  bookmarkedColorPalette,
  bookmarkSelector,
  currentIntersectionSelector,
  nextColorSelector,
} from '../../atoms/config/currentIntersectionAtom';
import { ProvenanceContext } from '../Root';
import { dataAtom } from '../../atoms/dataAtom';
import { UpsetActions, UpsetProvenance } from '../../provenance';
import { selectedElementSelector } from '../../atoms/elementsSelectors';
import { elementSelectionColor } from '../../utils/styles';

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

  /**
   * Handles when a chip in the bookmark stack is clicked
   * @param bookmark Clicked bookmark
   */
  function chipClicked(bookmark: Bookmark) {
    if (currentIntersection?.id === bookmark.id) actions.setSelected(null);
    else actions.setSelected(rows[bookmark.id]);
  }

  /** Whether there is at least 1 chip */
  const hasChip = useMemo(
    () => currentIntersection || currentSelection || bookmarked.length > 0,
    [currentIntersection, currentSelection, bookmarked],
  );

  return (
    // Silly goofy stack treats minHeight as maxHeight when we have chips... why??? idk
    <Stack direction="row" sx={{ flexFlow: 'row wrap', minHeight: hasChip ? undefined : '40px' }}>
      {/* All chips from bookmarks */}
      {bookmarked.map((bookmark) => (
        <Chip
          disabled={rows[bookmark.id] === undefined}
          sx={(theme) => ({
            margin: theme.spacing(0.5),
            '.MuiChip-icon': {
              color: colorPallete[bookmark.id],
            },
            backgroundColor: bookmark.id === currentIntersection?.id ? 'rgba(0,0,0,0.2)' : 'default',
          })}
          key={bookmark.id}
          aria-label={`Bookmarked intersection ${bookmark.label}, size ${bookmark.size}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              chipClicked(bookmark);
            }
          }}
          label={`${bookmark.label} - ${bookmark.size}`}
          icon={<SquareIcon fontSize={'1em' as any} />}
          deleteIcon={<StarIcon />}
          onClick={() => {
            chipClicked(bookmark);
          }}
          onDelete={() => {
            if (currentIntersection?.id === bookmark.id) {
              actions.setSelected(null);
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
            actions.addBookmark({
              id: currentIntersection.id,
              label: currentIntersectionDisplayName,
              size: currentIntersection.size,
            });
          }
        }}
        onClick={() => actions.setSelected(null)}
        label={`${currentIntersectionDisplayName} - ${currentIntersection.size}`}
        onDelete={() => {
          actions.addBookmark({
            id: currentIntersection.id,
            label: currentIntersectionDisplayName,
            size: currentIntersection.size,
          });
        }}
        deleteIcon={<StarBorderIcon />}
      />
      )}
      {/* Chip for the current element selection */}
      {currentSelection && (
      <Chip
        sx={(theme) => ({
          margin: theme.spacing(0.5),
          '.MuiChip-icon': {
            color: elementSelectionColor,
          },
          backgroundColor: currentSelection.active ? 'rgba(0,0,0,0.2)' : 'default',
        })}
        icon={<WorkspacesIcon fontSize={'1em' as any} />}
        aria-label={`Selected elements ${elementSelectionToString(currentSelection)}`}
        onClick={() => {
          const newSelection = { ...currentSelection };
          newSelection.active = !newSelection.active;
          actions.setElementSelection(newSelection);
        }}
        label={elementSelectionToString(currentSelection)}
      />
      )}
    </Stack>
  );
};

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import { Chip, Stack } from '@mui/material';
import { useContext } from 'react';
import { useRecoilValue } from 'recoil';

import {
  Bookmark, flattenedOnlyRows,
  querySelectionToString,
  vegaSelectionToString,
} from '@visdesignlab/upset2-core';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CodeIcon from '@mui/icons-material/Code';
import {
  activeSelectionSelector,
  bookmarkedColorPalette,
  bookmarkSelector,
  currentIntersectionSelector,
  currentQuerySelection,
  currentVegaSelection,
  nextColorSelector,
} from '../../atoms/config/selectionAtoms';
import { ProvenanceContext } from '../Root';
import { dataAtom } from '../../atoms/dataAtom';
import { UpsetActions, UpsetProvenance } from '../../provenance';
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
  const vegaSelection = useRecoilValue(currentVegaSelection);
  const querySelection = useRecoilValue(currentQuerySelection);
  const activeSelection = useRecoilValue(activeSelectionSelector);

  /**
   * Handles when a chip in the bookmark stack is clicked
   * @param bookmark Clicked bookmark
   */
  function chipClicked(bookmark: Bookmark) {
    if (currentIntersection?.id === bookmark.id && activeSelection === 'row') {
      actions.setSelected(null);
      actions.setActiveSelection(null);
    } else {
      actions.setSelected(rows[bookmark.id]);
      actions.setActiveSelection('row');
    }
  }

  return (
    <Stack direction="row" sx={{ flexFlow: 'row wrap' }}>
      {/* All chips from bookmarks */}
      {bookmarked.map((bookmark) => (
        <Chip
          disabled={rows[bookmark.id] === undefined}
          sx={(theme) => ({
            margin: theme.spacing(0.5),
            '.MuiChip-icon': {
              color: colorPallete[bookmark.id],
            },
            backgroundColor: bookmark.id === currentIntersection?.id && activeSelection === 'row' ? 'rgba(0,0,0,0.2)' : 'default',
          })}
          key={bookmark.id}
          aria-label={`Bookmarked intersection ${bookmark.label}, size ${bookmark.size}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              chipClicked(bookmark);
            }
          }}
          label={`${bookmark.label} - ${bookmark.size}`}
          icon={<BookmarkIcon fontSize={'1em' as any} />}
          deleteIcon={<StarIcon />}
          onClick={() => {
            chipClicked(bookmark);
          }}
          onDelete={() => {
            if (currentIntersection?.id === bookmark.id) {
              actions.setSelected(null);
              if (activeSelection === 'row') actions.setActiveSelection(null);
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
        icon={<BookmarkBorderIcon fontSize={'1em' as any} />}
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
        onClick={() => {
          actions.setSelected(null);
          if (activeSelection === 'row') actions.setActiveSelection(null);
        }}
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
      {/* Chip for the current vega selection */}
      {vegaSelection && (
      <Chip
        sx={(theme) => ({
          margin: theme.spacing(0.5),
          '.MuiChip-icon': {
            color: elementSelectionColor,
          },
          backgroundColor: activeSelection === 'vega' ? 'rgba(0,0,0,0.2)' : 'default',
        })}
        icon={<WorkspacesIcon fontSize={'1em' as any} />}
        aria-label={`Selected elements ${vegaSelectionToString(vegaSelection)}`}
        onClick={() => {
          if (activeSelection === 'vega') actions.setActiveSelection(null);
          else actions.setActiveSelection('vega');
        }}
        label={vegaSelectionToString(vegaSelection)}
      />
      )}
      {/* Chip for the current query selection */}
      {querySelection && (
      <Chip
        sx={(theme) => ({
          margin: theme.spacing(0.5),
          '.MuiChip-icon': {
            color: elementSelectionColor,
          },
          backgroundColor: activeSelection === 'query' ? 'rgba(0,0,0,0.2)' : 'default',
        })}
        icon={<CodeIcon fontSize={'1em' as any} />}
        aria-label={`Selected elements ${querySelectionToString(querySelection)}`}
        onClick={() => {
          if (activeSelection === 'query') actions.setActiveSelection(null);
          else actions.setActiveSelection('query');
        }}
        label={querySelectionToString(querySelection)}
      />
      )}
    </Stack>
  );
};

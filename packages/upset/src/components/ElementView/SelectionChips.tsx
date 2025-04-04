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
  currentSelectionType, bookmarkSelector, currentIntersectionSelector, currentQuerySelection, currentVegaSelection, nextColorSelector,
  nextColorIndexSelector,
} from '../../atoms/config/selectionAtoms';
import { ProvenanceContext } from '../Root';
import { dataAtom } from '../../atoms/dataAtom';
import { UpsetActions, UpsetProvenance } from '../../provenance';
import {
  extraQueryColor, queryColorPalette, querySelectionColor, vegaSelectionColor,
} from '../../utils/styles';

const CHIP_ICON_FONT_SIZE = 'small';

/**
 * Shows a stack of chips representing bookmarks and the current intersection/element selection,
 * with options to add and remove bookmarks
 */
export const BookmarkChips = () => {
  const { provenance, actions }: {provenance: UpsetProvenance, actions: UpsetActions} = useContext(ProvenanceContext);
  const currentIntersection = useRecoilValue(currentIntersectionSelector);
  const nextColor = useRecoilValue(nextColorSelector);
  const data = useRecoilValue(dataAtom);
  const rows = flattenedOnlyRows(data, provenance.getState());
  const bookmarked = useRecoilValue(bookmarkSelector);
  const nextColorIndex = useRecoilValue(nextColorIndexSelector);
  const currentIntersectionDisplayName = currentIntersection?.elementName.replaceAll('~&~', ' & ') || '';
  const vegaSelection = useRecoilValue(currentVegaSelection);
  const querySelection = useRecoilValue(currentQuerySelection);
  const selectionType = useRecoilValue(currentSelectionType);

  /**
   * Handles when a chip in the bookmark stack is clicked
   * @param bookmark Clicked bookmark
   */
  function chipClicked(bookmark: Bookmark) {
    if (currentIntersection?.id === bookmark.id && selectionType === 'row') {
      actions.setRowSelection(null);
      actions.setSelectionType(null);
    } else {
      if (currentIntersection?.id !== bookmark.id) actions.setRowSelection(rows[bookmark.id]);
      if (selectionType !== 'row') actions.setSelectionType('row');
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
              color: queryColorPalette[bookmark.colorIndex] ?? extraQueryColor,
            },
            backgroundColor: bookmark.id === currentIntersection?.id && selectionType === 'row' ? 'rgba(0,0,0,0.2)' : 'default',
          })}
          key={bookmark.id}
          aria-label={`Bookmarked intersection ${bookmark.label}, size ${bookmark.size}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              chipClicked(bookmark);
            }
          }}
          label={`${bookmark.label} - ${bookmark.size}`}
          icon={<BookmarkIcon fontSize={CHIP_ICON_FONT_SIZE} />}
          deleteIcon={<StarIcon />}
          onClick={() => {
            chipClicked(bookmark);
          }}
          onDelete={() => {
            if (currentIntersection?.id === bookmark.id) {
              actions.setRowSelection(null);
              if (selectionType === 'row') actions.setSelectionType(null);
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
          backgroundColor: selectionType === 'row' ? 'rgba(0,0,0,0.2)' : 'default',
        })}
        icon={<BookmarkBorderIcon fontSize={CHIP_ICON_FONT_SIZE} />}
        aria-label={`Selected intersection ${currentIntersectionDisplayName}, size ${currentIntersection.size}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            actions.addBookmark({
              id: currentIntersection.id,
              label: currentIntersectionDisplayName,
              size: currentIntersection.size,
              colorIndex: nextColorIndex,
            });
          }
        }}
        onClick={() => {
          if (selectionType === 'row') actions.setSelectionType(null);
          else actions.setSelectionType('row');
        }}
        label={`${currentIntersectionDisplayName} - ${currentIntersection.size}`}
        onDelete={() => {
          actions.addBookmark({
            id: currentIntersection.id,
            label: currentIntersectionDisplayName,
            size: currentIntersection.size,
            colorIndex: nextColorIndex,
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
            color: vegaSelectionColor,
          },
          backgroundColor: selectionType === 'vega' ? 'rgba(0,0,0,0.2)' : 'default',
        })}
        icon={<WorkspacesIcon fontSize={CHIP_ICON_FONT_SIZE} />}
        aria-label={`Selected elements ${vegaSelectionToString(vegaSelection)}`}
        onClick={() => {
          if (selectionType === 'vega') actions.setSelectionType(null);
          else actions.setSelectionType('vega');
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
            color: querySelectionColor,
          },
          backgroundColor: selectionType === 'query' ? 'rgba(0,0,0,0.2)' : 'default',
        })}
        icon={<CodeIcon fontSize={CHIP_ICON_FONT_SIZE} />}
        aria-label={`Selected elements ${querySelectionToString(querySelection)}`}
        onClick={() => {
          if (selectionType === 'query') actions.setSelectionType(null);
          else actions.setSelectionType('query');
        }}
        label={querySelectionToString(querySelection)}
      />
      )}
    </Stack>
  );
};

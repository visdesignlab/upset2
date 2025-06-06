import WorkspacesIcon from '@mui/icons-material/Workspaces';
import { Chip, Stack } from '@mui/material';
import { useContext } from 'react';
import { useRecoilValue } from 'recoil';

import {
  Bookmark,
  querySelectionToString,
  vegaSelectionToString,
} from '@visdesignlab/upset2-core';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CodeIcon from '@mui/icons-material/Code';
import {
  currentSelectionType,
  bookmarkSelector,
  currentIntersectionSelector,
  currentQuerySelection,
  currentVegaSelection,
  nextColorSelector,
  nextColorIndexSelector,
} from '../../atoms/config/selectionAtoms';
import { ProvenanceContext } from '../Root';
import { UpsetActions, UpsetProvenance } from '../../provenance';
import {
  extraQueryColor,
  queryColorPalette,
  querySelectionColor,
  vegaSelectionColor,
} from '../../utils/styles';
import { rowsSelector } from '../../atoms/renderRowsAtom';

const CHIP_ICON_FONT_SIZE = 'small';

const SELECTED_BACKGROUND = 'rgba(0,0,0,0.2)';

/**
 * Shows a stack of chips representing bookmarks and the current intersection/element selection,
 * with options to add and remove bookmarks
 */
export const SelectionChips = () => {
  const { actions }: { provenance: UpsetProvenance; actions: UpsetActions } =
    useContext(ProvenanceContext);
  const currentIntersection = useRecoilValue(currentIntersectionSelector);
  const nextColor = useRecoilValue(nextColorSelector);
  const rows = useRecoilValue(rowsSelector);
  const bookmarked = useRecoilValue(bookmarkSelector);
  const nextColorIndex = useRecoilValue(nextColorIndexSelector);
  const currentIntersectionDisplayName =
    currentIntersection?.elementName.replaceAll('~&~', ' & ') || '';
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
    } else if (currentIntersection?.id !== bookmark.id)
      actions.setRowSelection(rows[bookmark.id]);
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
            backgroundColor:
              bookmark.id === currentIntersection?.id && selectionType === 'row'
                ? 'rgba(0,0,0,0.2)'
                : 'default',
          })}
          key={bookmark.id}
          aria-label={`Bookmarked intersection ${bookmark.label}, size ${bookmark.size}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              chipClicked(bookmark);
            }
          }}
          label={`${bookmark.label} - ${bookmark.size}`}
          icon={
            <BookmarkIcon
              fontSize={CHIP_ICON_FONT_SIZE}
              onClick={(e) => {
                if (currentIntersection?.id === bookmark.id) {
                  if (selectionType !== 'row') actions.setRowSelection(null);
                }
                actions.removeBookmark(bookmark);
                e.stopPropagation(); // Prevents the onclick on the chip from firing
              }}
            />
          }
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            actions.removeBookmark(bookmark);
            if (currentIntersection?.id === bookmark.id) actions.setRowSelection(null);
          }}
          onClick={() => {
            chipClicked(bookmark);
          }}
        />
      ))}
      {/* Chip for the currently selected intersection */}
      {currentIntersection &&
        !bookmarked.find((b) => b.id === currentIntersection.id) && (
          <Chip
            sx={(theme) => ({
              margin: theme.spacing(0.5),
              '.MuiChip-icon': {
                color: nextColor,
              },
              backgroundColor: selectionType === 'row' ? SELECTED_BACKGROUND : 'default',
            })}
            icon={
              <BookmarkBorderIcon
                fontSize={CHIP_ICON_FONT_SIZE}
                onClick={(e) => {
                  actions.addBookmark({
                    id: currentIntersection.id,
                    label: currentIntersectionDisplayName,
                    size: currentIntersection.size,
                    colorIndex: nextColorIndex,
                  });
                  e.stopPropagation(); // Prevents the onclick on the chip from firing
                }}
              />
            }
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
              if (selectionType === 'row') actions.setRowSelection(null);
            }}
            label={`${currentIntersectionDisplayName} - ${currentIntersection.size}`}
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
            backgroundColor: selectionType === 'vega' ? SELECTED_BACKGROUND : 'default',
          })}
          icon={<WorkspacesIcon fontSize={CHIP_ICON_FONT_SIZE} />}
          aria-label={`Selected elements ${vegaSelectionToString(vegaSelection)}`}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            actions.setVegaSelection(null);
          }}
          onClick={() => {
            if (selectionType === 'vega') actions.activateSelectionType(null);
            else actions.activateSelectionType('vega');
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
            backgroundColor: selectionType === 'query' ? SELECTED_BACKGROUND : 'default',
          })}
          icon={<CodeIcon fontSize={CHIP_ICON_FONT_SIZE} />}
          aria-label={`Selected elements ${querySelectionToString(querySelection)}`}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            actions.setQuerySelection(null);
          }}
          onClick={() => {
            if (selectionType === 'query') actions.activateSelectionType(null);
            else actions.activateSelectionType('query');
          }}
          label={querySelectionToString(querySelection)}
        />
      )}
    </Stack>
  );
};

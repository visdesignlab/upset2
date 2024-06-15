import SquareIcon from '@mui/icons-material/Square';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Alert, Chip, Stack } from '@mui/material';
import { useContext } from 'react';
import { useRecoilValue } from 'recoil';

import { flattenedOnlyRows } from '@visdesignlab/upset2-core';
import {
  bookmarkedColorPalette,
  bookmarkSelector,
  currentSelectionSelector,
  nextColorSelector,
} from '../../atoms/config/currentIntersectionAtom';
import { ProvenanceContext } from '../Root';
import { dataAtom } from '../../atoms/dataAtom';
import { UpsetActions, UpsetProvenance } from '../../provenance';

export const ElementQueries = () => {
  const { provenance, actions }: {provenance: UpsetProvenance, actions: UpsetActions} = useContext(ProvenanceContext);
  const selection = useRecoilValue(currentSelectionSelector);
  const colorPallete = useRecoilValue(bookmarkedColorPalette);
  const nextColor = useRecoilValue(nextColorSelector);
  const data = useRecoilValue(dataAtom);
  const rows = flattenedOnlyRows(data, provenance.getState());
  const bookmarked = useRecoilValue(bookmarkSelector);
  const selectionLabel = selection?.label || "";

  return (
    <>
      {!selection && bookmarked.length === 0 && (
        <Alert
          severity="info"
          variant="outlined"
          role="generic"
          sx={{
            alignItems: 'center', margin: '0.5em 0', border: 'none', color: '#777777',
          }}
        >
          Please click on intersections to select an intersection.
        </Alert>
      )}
      <Stack direction="row" sx={{ flexFlow: 'row wrap' }}>
        {bookmarked.map((bookmark) => (
          <Chip
            disabled={rows[bookmark.id] === undefined}
            sx={(theme) => ({
              margin: theme.spacing(0.5),
              '.MuiChip-icon': {
                color: colorPallete[bookmark.id],
              },
              backgroundColor:
                bookmark.id === selection?.id
                  ? 'rgba(0,0,0,0.2)'
                  : 'default',
            })}
            key={bookmark.id}
            aria-label={
              `Bookmark ${bookmark.label}`
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (selection?.id === bookmark.id) actions.setSelected(null);
                else actions.setSelected(bookmark);
              }
            }}
            label={`${bookmark.label}`}
            icon={<SquareIcon fontSize={'1em' as any} />}
            deleteIcon={<StarIcon />}
            onClick={() => {
              if (selection?.id === bookmark.id) actions.setSelected(null);
              else actions.setSelected(bookmark);
            }}
            onDelete={() => {
              if (selection?.id === bookmark.id) {
                actions.setSelected(null);
              }
              actions.unBookmark(bookmark);
            }}
          />
        ))}
        {selection && !bookmarked.find((b) => b.id === selection.id) && (
        <Chip
          sx={(theme) => ({
            margin: theme.spacing(0.5),
            '.MuiChip-icon': {
              color: nextColor,
            },
            backgroundColor: 'rgba(0,0,0,0.2)',
          })}
          icon={<SquareIcon fontSize={'1em' as any} />}
          aria-label={`Selection ${selectionLabel}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              actions.bookmark(selection);
            }
          }}
          label={`${selectionLabel}`}
          onDelete={() => {
            actions.bookmark(selection);
          }}
          deleteIcon={<StarBorderIcon />}
        />
        )}
      </Stack>
    </>
  );
};

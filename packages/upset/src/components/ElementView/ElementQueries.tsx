import SquareIcon from '@mui/icons-material/Square';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Alert, Chip, Stack } from '@mui/material';
import { useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { flattenedOnlyRows } from '@visdesignlab/upset2-core';
import {
  bookmarkedColorPalette,
  bookmarkedIntersectionSelector,
  currentIntersectionSelector,
  nextColorSelector,
} from '../../atoms/config/currentIntersectionAtom';
import { ProvenanceContext } from '../Root';
import { dataAtom } from '../../atoms/dataAtom';

export const ElementQueries = () => {
  const { provenance, actions } = useContext(ProvenanceContext);
  const [currentIntersection, setCurrentIntersection] = useRecoilState(
    currentIntersectionSelector,
  );
  const colorPallete = useRecoilValue(bookmarkedColorPalette);
  const nextColor = useRecoilValue(nextColorSelector);
  const data = useRecoilValue(dataAtom);
  const rows = flattenedOnlyRows(data, provenance.getState());
  const bookmarked = useRecoilValue(bookmarkedIntersectionSelector);
  const currentIntersectionDisplayName = currentIntersection?.elementName.replaceAll("~&~", " & ") || "";

  return (
    <>
      {!currentIntersection && bookmarked.length === 0 && (
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
                bookmark.id === currentIntersection?.id
                  ? 'rgba(0,0,0,0.2)'
                  : 'default',
            })}
            key={bookmark.id}
            aria-label={`Bookmarked intersection ${bookmark.label}, size ${bookmark.size}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (currentIntersection?.id === bookmark.id) setCurrentIntersection(null);
                else setCurrentIntersection(rows[bookmark.id]);
              }
            }}
            label={`${bookmark.label} - ${bookmark.size}`}
            icon={<SquareIcon fontSize={'1em' as any} />}
            deleteIcon={<StarIcon />}
            onClick={() => {
              if (currentIntersection?.id === bookmark.id) setCurrentIntersection(null);
              else setCurrentIntersection(rows[bookmark.id]);
            }}
            onDelete={() => {
              if (currentIntersection?.id === bookmark.id) {
                setCurrentIntersection(null);
              }
              actions.unBookmarkIntersection(bookmark.id, bookmark.label, bookmark.size);
            }}
          />
        ))}
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
              actions.bookmarkIntersection(
                currentIntersection.id,
                currentIntersectionDisplayName,
                currentIntersection.size,
              );
            }
          }}
          label={`${currentIntersectionDisplayName} - ${currentIntersection.size}`}
          onDelete={() => {
            actions.bookmarkIntersection(
              currentIntersection.id,
              currentIntersectionDisplayName,
              currentIntersection.size,
            );
          }}
          deleteIcon={<StarBorderIcon />}
        />
        )}
      </Stack>
    </>
  );
};

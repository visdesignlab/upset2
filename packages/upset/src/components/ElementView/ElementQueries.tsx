import SquareIcon from '@mui/icons-material/Square';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Alert, Chip, Stack } from '@mui/material';
import { useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  bookmarkedColorPalette,
  bookmarkedIntersectionSelector,
  currentIntersectionAtom,
  nextColorSelector,
} from '../../atoms/config/currentIntersectionAtom';
import { ProvenanceContext } from '../Root';
import { dataAtom } from '../../atoms/dataAtom';
import { flattenedOnlyRows } from '@visdesignlab/upset2-core';

export const ElementQueries = () => {
  const { provenance, actions } = useContext(ProvenanceContext);
  const [currentIntersection, setCurrentIntersection] = useRecoilState(
    currentIntersectionAtom,
  );
  const colorPallete = useRecoilValue(bookmarkedColorPalette);
  const nextColor = useRecoilValue(nextColorSelector);
  const data = useRecoilValue(dataAtom);
  const rows = flattenedOnlyRows(data, provenance.getState());
  const bookmarked = useRecoilValue(bookmarkedIntersectionSelector);
  
  return (
    <>
      {!currentIntersection && bookmarked.length === 0 && (
        <Alert severity="info" variant="outlined" sx={{ alignItems: 'center', margin: '0.5em 0' }}>
          Please click on intersections to select an intersection.
        </Alert>
      )}
      <Stack direction="row" sx={{ flexFlow: 'row wrap' }}>
        {bookmarked.map((bookmark) => {
          return (
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
              label={`${bookmark.label} - ${bookmark.size}`}
              icon={<SquareIcon fontSize={'1em' as any} />}
              deleteIcon={<StarIcon />}
              onClick={() => {
                if (currentIntersection?.id === bookmark.id)
                setCurrentIntersection(null);
                else setCurrentIntersection(rows[bookmark.id]);
              }}
              onDelete={() => {
                if (currentIntersection?.id === bookmark.id) {
                  setCurrentIntersection(null);
                }
                actions.unBookmarkIntersection(bookmark.id, bookmark.label, bookmark.size);
              }}
              />
              );
            })}
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
                label={`${currentIntersection.elementName} - ${currentIntersection.size}`}
                onDelete={() => {
                  actions.bookmarkIntersection(
                    currentIntersection.id,
                    currentIntersection.elementName,
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

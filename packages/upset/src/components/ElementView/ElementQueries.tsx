import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Chip, Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { bookmarkedIntersectionSelector, currentIntersectionAtom } from '../../atoms/currentIntersectionAtom';
import { flattenedOnlyRows } from '../../atoms/renderRowsAtom';
import { ProvenanceContext } from '../Root';

export const ElementQueries = () => {
  const { actions } = useContext(ProvenanceContext);
  const [currentIntersection, setCurrentIntersection] = useRecoilState(
    currentIntersectionAtom,
  );
  const bookmarked = useRecoilValue(bookmarkedIntersectionSelector);
  const rows = useRecoilValue(flattenedOnlyRows);

  return (
    <>
      {!currentIntersection && bookmarked.length === 0 && (
        <Typography color="gray" sx={{ padding: '0.5em' }}>
          Please click on intersections to select an intersection.
        </Typography>
      )}
      <Stack direction="row" sx={{ flexFlow: 'row wrap' }}>
        {currentIntersection && !bookmarked.includes(currentIntersection.id) && (
          <Chip
            sx={(theme) => ({
              margin: theme.spacing(0.5),
            })}
            color="success"
            label={`${currentIntersection.elementName} - ${currentIntersection.size}`}
            onDelete={() => {
              actions.bookmarkIntersection(
                currentIntersection.id,
                currentIntersection.elementName,
              );
            }}
            deleteIcon={<StarBorderIcon />}
          />
        )}
        {bookmarked.map((id) => {
          return (
            <Chip
              sx={(theme) => ({
                margin: theme.spacing(0.5),
              })}
              color={id === currentIntersection?.id ? 'success' : 'default'}
              key={id}
              label={`${rows[id].elementName} - ${rows[id].size}`}
              deleteIcon={<StarIcon />}
              onClick={() => setCurrentIntersection(rows[id])}
              onDelete={() =>
                actions.unBookmarkIntersection(id, rows[id].elementName)
              }
            />
          );
        })}
      </Stack>
    </>
  );
};

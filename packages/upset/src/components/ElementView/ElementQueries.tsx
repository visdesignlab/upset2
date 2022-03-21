import SquareIcon from '@mui/icons-material/Square';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Chip, Stack, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  bookmarkedColorPalette,
  bookmarkedIntersectionSelector,
  currentIntersectionAtom,
  nextColorSelector,
} from '../../atoms/config/currentIntersectionAtom';
import { flattenedOnlyRows } from '../../atoms/renderRowsAtom';
import { ProvenanceContext } from '../Root';

export const ElementQueries = () => {
  const { actions } = useContext(ProvenanceContext);
  const [currentIntersection, setCurrentIntersection] = useRecoilState(
    currentIntersectionAtom,
  );
  const bookmarked = useRecoilValue(bookmarkedIntersectionSelector);
  const colorPallete = useRecoilValue(bookmarkedColorPalette);
  const nextColor = useRecoilValue(nextColorSelector);
  const rows = useRecoilValue(flattenedOnlyRows);

  const [count, setCount] = useState(0);

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
                '.MuiChip-icon': {
                  color: colorPallete[id],
                },
                backgroundColor:
                  id === currentIntersection?.id
                    ? 'rgba(0,0,0,0.2)'
                    : 'default',
              })}
              key={id}
              label={`${rows[id].elementName} - ${rows[id].size}`}
              icon={<SquareIcon fontSize={'1em' as any} />}
              deleteIcon={<StarIcon />}
              onClick={() => {
                if (currentIntersection?.id === id)
                  setCurrentIntersection(null);
                else setCurrentIntersection(rows[id]);
              }}
              onDelete={() => {
                if (currentIntersection?.id === id) {
                  setCurrentIntersection(null);
                }
                actions.unBookmarkIntersection(id, rows[id].elementName);
              }}
            />
          );
        })}
      </Stack>
    </>
  );
};

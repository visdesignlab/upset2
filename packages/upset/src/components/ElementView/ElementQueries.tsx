import SquareIcon from '@mui/icons-material/Square';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Alert, Chip, Stack } from '@mui/material';
import { useContext } from 'react';
import { useRecoilValue } from 'recoil';

import { BookmarkedIntersection, Row, flattenedOnlyRows, isBookmarkedIntersection } from '@visdesignlab/upset2-core';
import {
  bookmarkedColorPalette,
  bookmarkedIntersectionSelector,
  currentIntersectionSelector,
  nextColorSelector,
} from '../../atoms/config/currentIntersectionAtom';
import { ProvenanceContext } from '../Root';
import { dataAtom } from '../../atoms/dataAtom';
import { UpsetActions, UpsetProvenance } from '../../provenance';

export const ElementQueries = () => {
  const { provenance, actions }: {provenance: UpsetProvenance, actions: UpsetActions} = useContext(ProvenanceContext);
  const currentIntersection = useRecoilValue(currentIntersectionSelector);
  const colorPallete = useRecoilValue(bookmarkedColorPalette);
  const nextColor = useRecoilValue(nextColorSelector);
  const data = useRecoilValue(dataAtom);
  const rows = flattenedOnlyRows(data, provenance.getState());
  const bookmarked = useRecoilValue(bookmarkedIntersectionSelector);
  const currentIntersectionDisplayName = currentIntersection?.elementName.replaceAll("~&~", " & ") || "";

  /**
   * Sets the currently selected intersection and fires
   * a Trrack action to update the provenance graph.
   * @param inter intersection to select
   */
  function setCurrentIntersection(inter: Row | null) {
    actions.setSelected(inter);
  }

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
            aria-label={`Bookmarked intersection ${bookmark.label}` + 
              (isBookmarkedIntersection(bookmark) ? `, size ${bookmark.size}` : '')
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (currentIntersection?.id === bookmark.id) setCurrentIntersection(null);
                else setCurrentIntersection(rows[bookmark.id]);
              }
            }}
            label={isBookmarkedIntersection(bookmark)
              ? `${bookmark.label} - ${bookmark.size}` : `${bookmark.label}`
            }
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
              actions.unBookmarkIntersection({id: bookmark.id, label: bookmark.label, type: bookmark.type});
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
              actions.bookmarkIntersection<BookmarkedIntersection>({
                id: currentIntersection.id,
                label: currentIntersectionDisplayName,
                size: currentIntersection.size,
                type: 'intersection'
            });
            }
          }}
          label={`${currentIntersectionDisplayName} - ${currentIntersection.size}`}
          onDelete={() => {
            actions.bookmarkIntersection<BookmarkedIntersection>({
              id: currentIntersection.id,
              label: currentIntersectionDisplayName,
              size: currentIntersection.size,
              type: 'intersection',
          });
          }}
          deleteIcon={<StarBorderIcon />}
        />
        )}
      </Stack>
    </>
  );
};

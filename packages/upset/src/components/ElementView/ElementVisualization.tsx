import { Box } from '@mui/system';
import {
  useCallback,
  useContext, useMemo, useRef, useState,
} from 'react';
import { SignalListener, VegaLite } from 'react-vega';
import { useRecoilValue } from 'recoil';

import {
  numericalQueryToBookmark, numericalQueriesEqual, isNumericalQuery,
  Plot,
  plotToString,
} from '@visdesignlab/upset2-core';
import {
  Alert, Button, FormControl, IconButton, InputLabel, MenuItem, Select,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { bookmarkSelector, currentIntersectionSelector, elementColorSelector } from '../../atoms/config/currentIntersectionAtom';
import { histogramSelector, scatterplotsSelector } from '../../atoms/config/plotAtoms';
import { currentNumericalQuery, elementsInBookmarkSelector } from '../../atoms/elementsSelectors';
import { AddPlotDialog } from './AddPlotDialog';
import { generateVega } from './generatePlotSpec';
import { ProvenanceContext } from '../Root';
import { UpsetActions } from '../../provenance';

/**
 * The current interaction phase of the user removing a plot.
 * Determines what to display in the remove plot button's area.
 * false corresponds to no selection; displays the remove plot button
 * true corresponds to selecting & confirming a plot; displays a select & confirm/cancel buttons
 */
type RemovePhase = boolean;

/**
 * Displays a matrix of plots representing the elements in the current intersection selection & bookmarks.
 * @returns
 */
export const ElementVisualization = () => {
  /**
   * External state
   */

  const [openAddPlot, setOpenAddPlot] = useState(false);
  const [removeState, setRemoveState] = useState<RemovePhase>(false);

  const scatterplots = useRecoilValue(scatterplotsSelector);
  const histograms = useRecoilValue(histogramSelector);
  const bookmarked = useRecoilValue(bookmarkSelector);
  const items = useRecoilValue(elementsInBookmarkSelector);
  const numericalQuery = useRecoilValue(currentNumericalQuery);
  const selectColor = useRecoilValue(elementColorSelector);
  const currentIntersection = useRecoilValue(currentIntersectionSelector);
  const { actions }: {actions: UpsetActions} = useContext(ProvenanceContext);

  /**
   * Internal State
   */

  const draftSelection = useRef(numericalQuery);
  const vegaSpec = useMemo(
    () => generateVega(scatterplots, histograms, selectColor, numericalQuery),
    [scatterplots, histograms, selectColor, numericalQuery],
  );
  const data = useMemo(() => ({
    elements: Object.values(structuredClone(items)),
  }), [items]);

  /**
   * Functions
   */

  /**
   * Closes the AddPlotDialog
   */
  const onClose = () => setOpenAddPlot(false);

  /**
   * Saves brush bounds to state when the interactive brush is used.
   * @param {string}  _     Name of the signal: "brush" (defined in the vega spec & signalListeners of VegaLite element)
   * @param {unknown} value Should be an object mapping the names of the attributes being brushed over
   *  to an array of the bounds of the brush, but Vega's output format can change if the spec changes.
   */
  const brushHandler: SignalListener = useCallback((_: string, value: unknown) => {
    if (!isNumericalQuery(value)) return;
    draftSelection.current = value;
  }, [draftSelection]);

  const signalListeners = useMemo(() => ({
    brush: brushHandler,
  }), [brushHandler]);

  return (
    <Box
      onClick={() => {
        // Since onClick fires onMouseUp, this is a great time to save (onMouseUp doesn't bubble from vegaLite)
        if (
          draftSelection.current
          && Object.keys(draftSelection.current).length > 0
          && !numericalQueriesEqual(draftSelection.current, numericalQuery)
        ) {
          actions.setElementSelection(numericalQueryToBookmark(draftSelection.current));
        } else {
          actions.setElementSelection(null);
        }
        draftSelection.current = undefined;
      }}
    >
      <div style={{
        marginTop: '0.5em', display: 'flex', minHeight: '40px', alignItems: 'center',
      }}
      >
        <Button style={{ height: '100%' }} onClick={() => setOpenAddPlot(true)}>Add Plot</Button>
        {!removeState &&
          (<Button style={{ height: '100%' }} color="error" onClick={() => setRemoveState(true)}>Remove Plot</Button>)}

        {removeState && (
          <>
            <FormControl style={{ width: 'auto', flexGrow: '1' }} size="small">
              <InputLabel id="remove-plot-select-label">Select Plot to Remove</InputLabel>
              <Select
                label="Select Plot to Remove"
                labelId="remove-plot-select-label"
                onChange={(v) => console.log(v)}
              >
                {(scatterplots as Plot[]).concat(histograms).map((plot) => (
                  <MenuItem key={plot.id} value={plot.id}>{plotToString(plot)}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton color="success" onClick={() => console.log('remove')}>
              <CheckIcon />
            </IconButton>
            <IconButton color="error" onClick={() => console.log('remove')}>
              <CloseIcon />
            </IconButton>
          </>
        )}
      </div>

      {!currentIntersection && bookmarked.length === 0 && (
        <Alert
          severity="info"
          variant="outlined"
          role="generic"
          sx={{
            alignItems: 'center', marginBottom: '0.5em', border: 'none', color: '#777777',
          }}
        >
          Currently visualizing all elements. Clicking on an intersection will visualize only its elements.
        </Alert>
      )}

      <AddPlotDialog open={openAddPlot} onClose={onClose} />
      <Box sx={{ overflowX: 'auto' }}>
        {(scatterplots.length > 0 || histograms.length > 0) && (
          <VegaLite
            spec={vegaSpec}
            data={data}
            actions={false}
            signalListeners={signalListeners}
          />
        )}
      </Box>
    </Box>
  );
};

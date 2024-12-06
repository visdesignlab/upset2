import { Box } from '@mui/system';
import {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { VegaLite, View } from 'react-vega';
import { useRecoilValue } from 'recoil';

import {
  numericalQueryToBookmark, numericalQueriesEqual, isNumericalQuery, Plot,
  NumericalQuery,
  isScatterplot,
  isHistogram,
} from '@visdesignlab/upset2-core';
import { Alert, Button } from '@mui/material';
import { bookmarkSelector, currentIntersectionSelector, elementColorSelector } from '../../atoms/config/currentIntersectionAtom';
import { histogramSelector, scatterplotsSelector } from '../../atoms/config/plotAtoms';
import { currentNumericalQuery, elementsInBookmarkSelector } from '../../atoms/elementsSelectors';
import { AddPlotDialog } from './AddPlotDialog';
import { generateVegaSpec } from './generatePlotSpec';
import { ProvenanceContext } from '../Root';
import { UpsetActions } from '../../provenance';

const BRUSH_NAME = 'brush';

/**
 * Updates Vega visualization signals based on numerical queries for either scatterplots or histograms
 * and re-runs the view asynchronously.
 *
 * @param plot - The plot configuration (scatterplot or histogram)
 * @param view - The Vega view instance to update
 * @param val - Object containing numerical range queries
 * @param sync - Whether to wait for the view to finish updating before returning;
 *               setting to true means that the returned promise can be awaited to indicate the end of plot updates
 * @returns A promise that is meaningless if sync = false, and completes upon full view reevaluation if sync = true
 */
async function signalView(plot: Plot, view: View, val: NumericalQuery, sync = false): Promise<void> {
  // Clear view of any previous selection
  if (isScatterplot(plot)) {
    view.signal(`${BRUSH_NAME}_x`, []);
    view.signal(`${BRUSH_NAME}_y`, []);
  } else if (isHistogram(plot)) {
    view.signal(`${BRUSH_NAME}_x`, []);
  }

  if (sync) await view.runAsync();
  else view.run();

  if (isScatterplot(plot)) {
    const inclX = Object.keys(val).includes(plot.x);
    const inclY = Object.keys(val).includes(plot.y);
    if ((!inclX && !inclY)) {
      view.signal(`${BRUSH_NAME}_${plot.x}`, undefined);
      view.signal(`${BRUSH_NAME}_${plot.y}`, undefined);
      if (sync) await view.runAsync();
      else view.run();
      return;
    }

    if (inclX) {
      view.signal(`${BRUSH_NAME}_${plot.x}`, val[plot.x]);
    } else {
      view.signal(`${BRUSH_NAME}_${plot.x}`, [-Number.MAX_SAFE_INTEGER + 1, Number.MAX_SAFE_INTEGER - 1]);
    }

    if (inclY) {
      view.signal(`${BRUSH_NAME}_${plot.y}`, val[plot.y]);
    } else {
      view.signal(`${BRUSH_NAME}_${plot.y}`, [-Number.MAX_SAFE_INTEGER + 1, Number.MAX_SAFE_INTEGER - 1]);
    }
  } else if (isHistogram(plot)) {
    if (Object.keys(val).includes(plot.attribute)) view.signal(`${BRUSH_NAME}_${plot.attribute}`, val[plot.attribute]);
    else view.signal(`${BRUSH_NAME}_${plot.attribute}`, undefined);
  }

  if (sync) await view.runAsync();
  else view.run();
}

/**
 * Displays a matrix of plots representing the elements in the current intersection selection & bookmarks.
 * @returns
 */
export const ElementVisualization = () => {
  /**
   * External state
   */

  const [openAddPlot, setOpenAddPlot] = useState(false);
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
  const preventSignal = useRef(false);
  const views = useRef<{view: View, plot: Plot}[]>([]);
  const currentClick = useRef<Plot |null>(null);
  const data = useMemo(() => ({
    elements: Object.values(structuredClone(items)),
  }), [items]);
  const plots = useMemo(() => (scatterplots as Plot[]).concat(histograms), [scatterplots, histograms]);
  const specs = useMemo(() => plots.map((plot) => (
    { plot, spec: generateVegaSpec(plot, selectColor) }
  )), [plots, selectColor]);

  /**
   * Functions
   */

  /**
   * Closes the AddPlotDialog
   */
  const onClose = () => setOpenAddPlot(false);

  /**
   * Saves brush bounds to state when the interactive brush is used.
   * @param {Plot}    signaled  The plot that this signal fired on
   * @param {unknown} value Should be an object mapping the names of the attributes being brushed over
   *  to an array of the bounds of the brush, but Vega's output format can change if the spec changes.
   */
  const brushHandler = useCallback((signaled: Plot, value: unknown) => {
    if (!isNumericalQuery(value) || signaled.id !== currentClick.current?.id || preventSignal.current) return;
    draftSelection.current = value;
    views.current.filter(({ plot }) => plot.id !== signaled.id).forEach(({ view, plot }) => {
      signalView(plot, view, value);
    });
  }, [draftSelection, currentClick.current, views.current]);

  // Syncs the default value of the plots on load to the current numerical query
  useEffect(() => {
    preventSignal.current = true;
    const promises: Promise<void>[] = [];
    views.current.forEach(({ view, plot }) => {
      promises.push(signalView(plot, view, numericalQuery ?? {}, true));
    });
    Promise.allSettled(promises).then(() => {
      preventSignal.current = false;
    });
  }, [views.current, numericalQuery]);

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
      <Button style={{ marginTop: '0.5em' }} onClick={() => setOpenAddPlot(true)}>Add Plot</Button>
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
        {(plots.length > 0) && specs.map(({ plot, spec }) => (
          <VegaLite
            spec={spec}
            data={data}
            actions={false}
            signalListeners={{
              [BRUSH_NAME]: (_, val) => brushHandler(plot, val),
            }}
            onNewView={(view) => {
              views.current.push({ view, plot });
              view.addEventListener('mouseover', () => { currentClick.current = plot; });
              view.addEventListener('mouseout', () => { currentClick.current = null; });
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

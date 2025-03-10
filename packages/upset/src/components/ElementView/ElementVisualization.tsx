import { Box } from '@mui/system';
import {
  useCallback,
  useContext, useEffect, useMemo, useRef,
} from 'react';
import { VegaLite, View } from 'react-vega';
import { useRecoilValue } from 'recoil';

import {
  numericalQueryToBookmark, numericalQueriesEqual, isNumericalQuery, deepCopy, Plot,
  NumericalQuery,
} from '@visdesignlab/upset2-core';
import {
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { elementColorSelector } from '../../atoms/config/currentIntersectionAtom';
import { histogramSelector, scatterplotsSelector } from '../../atoms/config/plotAtoms';
import { currentNumericalQuery, elementsInBookmarkSelector, selectedElementSelector } from '../../atoms/elementsSelectors';
import { generateVegaSpec } from './generatePlotSpec';
import { ProvenanceContext } from '../Root';
import { UpsetActions } from '../../provenance';

const BRUSH_NAME = 'brush';

/**
 * Updates Vega visualization signals based on numerical queries for either scatterplots or histograms
 * and re-runs the view asynchronously.
 *
 * @param view - The Vega view instance to update
 * @param val - Object containing numerical range queries
 * @param sync - Whether to wait for the view to finish updating before returning;
 *               setting to true means that the returned promise can be awaited to indicate the end of plot updates
 * @returns A promise that is meaningless if sync = false, and completes upon full view reevaluation if sync = true
 */
async function signalView(view: View, val: NumericalQuery, sync = false): Promise<void> {
  const state = view.getState();
  if (Object.entries(val).length === 0) {
    state.data[`${BRUSH_NAME}_store`] = [];
  } else {
    state.data[`${BRUSH_NAME}_store`] = [{
      fields: Object.keys(val).map((key) => ({ type: 'R', field: key })),
      values: Object.values(val).map((value) => (value)),
    }];
  }
  view.setState(state);

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
  const scatterplots = useRecoilValue(scatterplotsSelector);
  const histograms = useRecoilValue(histogramSelector);
  const items = useRecoilValue(elementsInBookmarkSelector);
  const numericalQuery = useRecoilValue(currentNumericalQuery);
  const elementSelection = useRecoilValue(selectedElementSelector);
  const selectColor = useRecoilValue(elementColorSelector);
  const { actions }: {actions: UpsetActions} = useContext(ProvenanceContext);

  /**
   * Internal State
   */

  const draftSelection = useRef(numericalQuery);
  const preventSignal = useRef(false);
  const views = useRef<{view: View, plot: Plot}[]>([]);
  const currentClick = useRef<Plot |null>(null);
  const data = useMemo(() => ({
    elements: Object.values(deepCopy(items)),
  }), [items]);
  const plots = useMemo(() => (scatterplots as Plot[]).concat(histograms), [scatterplots, histograms]);
  const specs = useMemo(() => plots.map((plot) => (
    { plot, spec: generateVegaSpec(plot, selectColor) }
  )), [plots, selectColor]);

  /**
   * Functions
   */

  /**
   * Saves brush bounds to state when the interactive brush is used.
   * @param {Plot}    signaled  The plot that this signal fired on
   * @param {unknown} value Should be an object mapping the names of the attributes being brushed over
   *  to an array of the bounds of the brush, but Vega's output format can change if the spec changes.
   */
  const brushHandler = useCallback((signaled: Plot, value: unknown) => {
    if (!isNumericalQuery(value) || signaled.id !== currentClick.current?.id || preventSignal.current) return;
    draftSelection.current = value;
    views.current.filter(({ plot }) => plot.id !== signaled.id).forEach(({ view }) => {
      signalView(view, value);
    });
  }, [draftSelection, currentClick.current, views.current]);

  // Syncs the default value of the plots on load to the current numerical query
  useEffect(() => {
    preventSignal.current = true;
    const promises: Promise<void>[] = [];
    views.current.forEach(({ view }) => {
      promises.push(signalView(view, numericalQuery ?? {}, true));
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
        } else if (elementSelection) actions.setElementSelection(null);
        draftSelection.current = undefined;
      }}
    >
      <Box sx={{
        overflowX: 'auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around',
      }}
      >
        {(plots.length > 0) && specs.map(({ plot, spec }) => (
          // Relative position is necessary so this serves as a positioning container for the close button
          <Box style={{ display: 'inline-block', position: 'relative' }} key={plot.id}>
            <IconButton
              style={{
                position: 'absolute', top: 0, right: -15, zIndex: 100, padding: 0,
              }}
              onClick={() => {
                actions.removePlot(plot);
                views.current = views.current.filter(({ plot: p }) => p.id !== plot.id);
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <VegaLite
              spec={spec}
              data={data}
              actions={false}
              signalListeners={{
                [BRUSH_NAME]: (_, val) => brushHandler(plot, val),
              }}
              // Making room for the close button
              style={{ marginLeft: '5px' }}
              onNewView={(view) => {
                views.current.push({ view, plot });
                view.addEventListener('mouseover', () => { currentClick.current = plot; });
                view.addEventListener('mouseout', () => { currentClick.current = null; });
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

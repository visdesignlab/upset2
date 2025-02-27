import { Box } from '@mui/system';
import {
  useCallback,
  useContext, useEffect, useMemo, useRef,
  useState,
} from 'react';
import { VegaLite, View } from 'react-vega';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  numericalQueriesEqual, isNumericalQuery, deepCopy, Plot,
  NumericalQuery,
} from '@visdesignlab/upset2-core';
import { histogramSelector, scatterplotsSelector } from '../../atoms/config/plotAtoms';
import { currentNumericalQuery, coloredItemsSelector, elementSelectionSelector } from '../../atoms/elementsSelectors';
import { generateVegaSpec } from './generatePlotSpec';
import { ProvenanceContext } from '../Root';
import { UpsetActions } from '../../provenance';
import { contextMenuAtom } from '../../atoms/contextMenuAtom';

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
  const items = useRecoilValue(coloredItemsSelector);
  const numericalQuery = useRecoilValue(currentNumericalQuery);
  const elementSelection = useRecoilValue(elementSelectionSelector);
  const { actions }: {actions: UpsetActions} = useContext(ProvenanceContext);
  const setContextMenu = useSetRecoilState(contextMenuAtom);

  /**
   * Internal State
   */

  const draftSelection = useRef(numericalQuery);
  const preventSignal = useRef(false);
  const [views, setViews] = useState<{view: View, plot: Plot}[]>([]);
  const currentClick = useRef<Plot |null>(null);
  const data = useMemo(() => ({
    elements: Object.values(deepCopy(items)),
  }), [items]);
  const plots = useMemo(() => (scatterplots as Plot[]).concat(histograms), [scatterplots, histograms]);
  const specs = useMemo(() => plots.map((plot) => (
    { plot, spec: generateVegaSpec(plot) }
  )), [plots]);

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
    views.filter(({ plot }) => plot.id !== signaled.id).forEach(({ view }) => {
      signalView(view, value);
    });
  }, [draftSelection, currentClick.current, views]);

  /**
   * Saves the current selection to the state.
   */
  const saveSelection = useCallback(() => {
    if (
      draftSelection.current
      && Object.keys(draftSelection.current).length > 0
      && !numericalQueriesEqual(draftSelection.current, numericalQuery)
    ) {
      actions.setElementSelection({ type: 'numerical', query: draftSelection.current, active: true });
    } else if (elementSelection) actions.setElementSelection(null);
    draftSelection.current = undefined;
  }, [draftSelection.current, numericalQuery, elementSelection, actions]);

  // Syncs the default value of the plots on load to the current numerical query
  useEffect(() => {
    preventSignal.current = true;
    const promises: Promise<void>[] = [];
    views.forEach(({ view }) => {
      promises.push(signalView(view, numericalQuery ?? {}, true));
    });
    Promise.allSettled(promises).then(() => {
      preventSignal.current = false;
    });
  }, [views, numericalQuery]);

  return (
    <Box
      // Since onClick fires onMouseUp, this is a great time to save (onMouseUp doesn't bubble from vegaLite)
      onClick={saveSelection}
    >
      <Box sx={{
        overflowX: 'auto', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around',
      }}
      >
        {(plots.length > 0) && specs.map(({ plot, spec }) => (
          // Relative position is necessary so this serves as a positioning container for the close button
          <Box
            style={{ display: 'inline-block', position: 'relative' }}
            key={plot.id}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setContextMenu({
                mouseX: e.clientX,
                mouseY: e.clientY,
                id: `${plot.id}-menu`,
                items: [
                  {
                    label: 'Remove Plot',
                    onClick: () => {
                      actions.removePlot(plot);
                      setViews(views.filter(({ plot: p }) => p.id !== plot.id));
                      setContextMenu(null);
                    },
                  },
                ],
              });
            }}
          >
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
                views.push({ view, plot });
                setViews([...views]);
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

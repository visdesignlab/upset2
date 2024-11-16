import { Box } from '@mui/system';
import {
  useCallback,
  useContext, useMemo, useRef, useState,
} from 'react';
import { SignalListener, VegaLite, View } from 'react-vega';
import { useRecoilValue } from 'recoil';

import {
  numericalQueryToBookmark, numericalQueriesEqual, isNumericalQuery, Plot,
} from '@visdesignlab/upset2-core';
import { Alert, Button } from '@mui/material';
import { bookmarkSelector, currentIntersectionSelector, elementColorSelector } from '../../atoms/config/currentIntersectionAtom';
import { histogramSelector, scatterplotsSelector } from '../../atoms/config/plotAtoms';
import { currentNumericalQuery, elementsInBookmarkSelector } from '../../atoms/elementsSelectors';
import { AddPlotDialog } from './AddPlotDialog';
import { generateVegaSpec } from './generatePlotSpec';
import { ProvenanceContext } from '../Root';
import { UpsetActions } from '../../provenance';

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
  const data = useMemo(() => ({
    elements: Object.values(structuredClone(items)),
  }), [items]);
  const plots = useMemo(() => (scatterplots as Plot[]).concat(histograms), [scatterplots, histograms]);
  const specs = useMemo(() => plots.map((plot) => (
    { plot, spec: generateVegaSpec(plot, numericalQuery, selectColor) }
  )), [plots, numericalQuery, selectColor]);

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

  const [vegaView, setView] = useState<View | null>(null);

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
            signalListeners={signalListeners}
            onNewView={(view) => {
              setView(view);
            }}
          />
        ))}
      </Box>
      <Button onClick={() => vegaView?.signal('brush', { ReleaseDate: [1950, 2000], Watches: [200, 400] })}>Clear Brush</Button>
    </Box>
  );
};

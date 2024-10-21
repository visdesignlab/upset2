import { Box } from '@mui/system';
import {
  useCallback,
  useContext, useMemo, useRef, useState,
} from 'react';
import { SignalListener, VegaLite } from 'react-vega';
import { useRecoilValue } from 'recoil';

import { elementSelectionToBookmark, elementSelectionsEqual, isElementSelection } from '@visdesignlab/upset2-core';
import { Button } from '@mui/material';
import { bookmarkSelector, elementColorSelector } from '../../atoms/config/currentIntersectionAtom';
import { histogramSelector, scatterplotsSelector } from '../../atoms/config/plotAtoms';
import { elementItemMapSelector, elementSelectionParameters } from '../../atoms/elementsSelectors';
import { AddPlotDialog } from './AddPlotDialog';
import { generateVega } from './generatePlotSpec';
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
  const items = useRecoilValue(elementItemMapSelector(bookmarked.map((b) => b.id)));
  const elementSelection = useRecoilValue(elementSelectionParameters);
  const selectColor = useRecoilValue(elementColorSelector);
  const { actions }: {actions: UpsetActions} = useContext(ProvenanceContext);

  /**
   * Internal State
   */

  const draftSelection = useRef(elementSelection);
  const vegaSpec = useMemo(
    () => generateVega(scatterplots, histograms, selectColor, elementSelection),
    [scatterplots, histograms, selectColor, elementSelection],
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
    if (!isElementSelection(value)) return;
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
          && !elementSelectionsEqual(draftSelection.current, elementSelection)
        ) {
          actions.setElementSelection(elementSelectionToBookmark(draftSelection.current));
        } else {
          actions.setElementSelection(null);
        }
        draftSelection.current = undefined;
      }}
    >
      <Button onClick={() => setOpenAddPlot(true)}>Add Plot</Button>
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

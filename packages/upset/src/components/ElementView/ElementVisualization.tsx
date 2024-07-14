import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useRef, useState } from 'react';
import { SignalListener, VegaLite } from 'react-vega';
import { useRecoilState, useRecoilValue } from 'recoil';

import { bookmarkSelector, elementColorSelector } from '../../atoms/config/currentIntersectionAtom';
import { histogramSelector, scatterplotsSelector } from '../../atoms/config/plotAtoms';
import { elementItemMapSelector, configElementsSelector } from '../../atoms/elementsSelectors';
import { AddPlotDialog } from './AddPlotDialog';
import { generateVega } from './generatePlotSpec';
import { elementSelectionToBookmark, elementSelectionsEqual, isElementSelection } from '@visdesignlab/upset2-core';
import { elementSelectionAtom } from '../../atoms/config/upsetConfigAtoms';
import { ProvenanceContext } from '../Root';
import { UpsetActions } from '../../provenance';

export const ElementVisualization = () => {
  const [openAddPlot, setOpenAddPlot] = useState(false);
  const scatterplots = useRecoilValue(scatterplotsSelector);
  const histograms = useRecoilValue(histogramSelector);
  const bookmarked = useRecoilValue(bookmarkSelector);
  const items = useRecoilValue(elementItemMapSelector(bookmarked.map((b) => b.id)));
  
  const savedSelection = useRecoilValue(configElementsSelector);
  const selectColor = useRecoilValue(elementColorSelector);
  // This will default to the savedSelection because brushHandler fires on the default selection in generateVega()
  const [currentSelection, setCurrentSelection] = useRecoilState(elementSelectionAtom);
  const {actions}: {actions: UpsetActions} = useContext(ProvenanceContext);
  const timeout = useRef<number | null>(null);
  // Necessary to allow functions to be called on the <div> element itself
  const thisComponent = useRef<HTMLDivElement>(null);

  const onClose = () => setOpenAddPlot(false);

  /**
   * Saves brush bounds to state when the interactive brush is used.
   * @param {string}  _     Name of the signal: "brush"
   * @param {unknown} value Should be an object mapping the names of the attributes being brushed over
   *  to an array of the bounds of the brush, but Vega's output format can change if the spec changes.
   */
  const brushHandler: SignalListener = (_: string, value: unknown) => {
    if (!isElementSelection(value)) return;

    if (timeout.current)
      clearTimeout(timeout.current);
    // We debounce the update to prevent re-rendering the size bars every time the handler fires
    timeout.current = setTimeout(() =>
      setCurrentSelection(Object.keys(value).length > 0 ? elementSelectionToBookmark(value) : null), 250);
  };

  return (
    <Box
      // These attributes facilitate saving the current selection when the user clicks outside the plot.
      // Necessary to give the <div> focus; focus doesn't bubble up from the VegaLite component but click does
      onClick={() => {thisComponent.current?.focus()}}
      // Necessary to allow us to focus the <div> programmatically
      ref={thisComponent}
      // Necessary to make <div> focusable so it can receive focus events
      tabIndex={-1}
      // Since we now have focus whenever a plot is clicked, this will always fire when clicking off
      onBlur={() => {
        if (!elementSelectionsEqual(currentSelection?.selection, savedSelection?.selection)) 
          actions.setElementSelection(currentSelection);
      }}
    >
      <Button onClick={() => setOpenAddPlot(true)}>Add Plot</Button>
      <AddPlotDialog open={openAddPlot} onClose={onClose} />
      <Box sx={{ overflowX: 'auto' }}>
        {(scatterplots.length > 0 || histograms.length > 0) && (
          <VegaLite
            spec={generateVega(scatterplots, histograms, selectColor, savedSelection?.selection)}
            data={{
              elements: Object.values(JSON.parse(JSON.stringify(items))),
            }}
            actions={false}
            signalListeners={{
              "brush": brushHandler,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

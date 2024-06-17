import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useRef, useState } from 'react';
import { SignalListener, VegaLite } from 'react-vega';
import { useRecoilValue } from 'recoil';

import { bookmarkedIntersectionSelector } from '../../atoms/config/currentIntersectionAtom';
import { histogramSelector, scatterplotsSelector } from '../../atoms/config/plotAtoms';
import { elementItemMapSelector } from '../../atoms/elementsSelectors';
import { AddPlotDialog } from './AddPlotDialog';
import { generateVega } from './generatePlotSpec';
import { ProvenanceContext } from '../Root';
import { ElementSelection } from '@visdesignlab/upset2-core';
import { upsetConfigAtom } from '../../atoms/config/upsetConfigAtoms';

export const ElementVisualization = () => {
  const [openAddPlot, setOpenAddPlot] = useState(false);
  const scatterplots = useRecoilValue(scatterplotsSelector);
  const histograms = useRecoilValue(histogramSelector);
  const bookmarked = useRecoilValue(bookmarkedIntersectionSelector);
  const items = useRecoilValue(elementItemMapSelector(bookmarked.map((b) => b.id)));
  
  const { actions } = useContext(ProvenanceContext);
  const config = useRecoilValue(upsetConfigAtom);
  const [elementSelection, setElementSelection] = useState<ElementSelection>(config.elementSelection);
  const timeout = useRef<number | null>(null);
  
  const onClose = () => setOpenAddPlot(false);

  /**
   * Saves brush bounds to state when the interactive brush is used.
   * @param {string}  _     Name of the signal: "brush"
   * @param {unknown} value Should be an object mapping the names of the attributes being brushed over
   *  to an array of the bounds of the brush, but Vega's output format can change if the spec changes.
   */
  const brushHandler: SignalListener = (_: string, value: unknown) => {
    console.log("brushHandler", value);
    if ( // Validates that the signal is in the expected format; allows us to convert unknown to ElementSelection
      value === undefined 
      || typeof value !== "object"
      || Object.values(value as Object).some((v) => 
            !Array.isArray(v) 
            || !(v.length === 2) 
            || typeof v[0] !== "number" 
            || typeof v[1] !== "number")
    ) return;

    setElementSelection(value as ElementSelection);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      actions.setElementSelection(value as ElementSelection);
    }, 2000); // Delay for 2 seconds before saving the selection to the provenance state
  };

  return (
    <Box>
      <Button onClick={() => setOpenAddPlot(true)}>Add Plot</Button>
      <AddPlotDialog open={openAddPlot} onClose={onClose} />
      <Box sx={{ overflowX: 'auto' }}>
        {(scatterplots.length > 0 || histograms.length > 0) && (
          <VegaLite
            // elementSelection should default to config.elementSelection (checked in the useState call above)
            // but it's actually undefined here, so this is my fix :/
            spec={generateVega(scatterplots, histograms, elementSelection ? undefined : config.elementSelection)}
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

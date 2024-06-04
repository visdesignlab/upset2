import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { SignalListener, VegaLite } from 'react-vega';
import { useRecoilValue } from 'recoil';

import { bookmarkedIntersectionSelector } from '../../atoms/config/currentIntersectionAtom';
import { histogramSelector, scatterplotsSelector } from '../../atoms/config/plotAtoms';
import { elementItemMapSelector } from '../../atoms/elementsSelectors';
import { AddPlotDialog } from './AddPlotDialog';
import { generateVega } from './generatePlotSpec';

export const ElementVisualization = () => {
  const [openAddPlot, setOpenAddPlot] = useState(false);
  const scatterplots = useRecoilValue(scatterplotsSelector);
  const histograms = useRecoilValue(histogramSelector);
  const bookmarked = useRecoilValue(bookmarkedIntersectionSelector);
  const items = useRecoilValue(elementItemMapSelector(bookmarked.map((b) => b.id)));

  const onClose = () => setOpenAddPlot(false);

  /**
   * Saves brush bounds to state when the interactive brush is used.
   * @param {string} _ Name of the signal: "brush"
   * @param {unknown} value Should be an object mapping the names of the attributes being brushed over
   *                        to an array of the bounds of the brush, but apparently Vega makes no guarantees.
   */
  const brushHandler: SignalListener = (_: string, value: unknown) => {
    console.log(value);
  };

  return (
    <Box>
      <Button onClick={() => setOpenAddPlot(true)}>Add Plot</Button>
      <AddPlotDialog open={openAddPlot} onClose={onClose} />
      <Box>
        {(scatterplots.length > 0 || histograms.length > 0) && (
          <VegaLite
            spec={generateVega(scatterplots, histograms)}
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

import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useRef, useState } from 'react';
import { SignalListener, VegaLite } from 'react-vega';
import { useRecoilValue } from 'recoil';

import { bookmarkSelector } from '../../atoms/config/currentIntersectionAtom';
import { histogramSelector, scatterplotsSelector } from '../../atoms/config/plotAtoms';
import { elementItemMapSelector } from '../../atoms/elementsSelectors';
import { AddPlotDialog } from './AddPlotDialog';
import { generateVega } from './generatePlotSpec';
import { ProvenanceContext } from '../Root';
import { upsetConfigAtom } from '../../atoms/config/upsetConfigAtoms';
import { NumericalAttQuery, isElementSelection } from '@visdesignlab/upset2-core';
import { UpsetActions } from '../../provenance';
import { numAttsToElemQuery, isNumericalAttQuery } from '@visdesignlab/upset2-core/src';

export const ElementVisualization = () => {
  const [openAddPlot, setOpenAddPlot] = useState(false);
  const scatterplots = useRecoilValue(scatterplotsSelector);
  const histograms = useRecoilValue(histogramSelector);
  const bookmarked = useRecoilValue(bookmarkSelector);
  const items = useRecoilValue(elementItemMapSelector(bookmarked.map((b) => b.id)));
  
  const { actions }: {actions: UpsetActions} = useContext(ProvenanceContext);
  const config = useRecoilValue(upsetConfigAtom);
  const [elementSelection, setElementSelection] = 
    useState(isElementSelection(config.selected) ? config.selected : undefined);
  const timeout = useRef<number | null>(null);
  
  const onClose = () => setOpenAddPlot(false);

  /**
   * Saves brush bounds to state when the interactive brush is used.
   * @param {string}  _     Name of the signal: "brush"
   * @param {unknown} value Should be an object mapping the names of the attributes being brushed over
   *  to an array of the bounds of the brush, but Vega's output format can change if the spec changes.
   */
  const brushHandler: SignalListener = (_: string, value: unknown) => {
    if (!isNumericalAttQuery(value)) return;
    const newSelection = numAttsToElemQuery(value as NumericalAttQuery);
    setElementSelection(newSelection);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      actions.setSelected(newSelection);
    }, 2000); // Delay for 2 seconds before saving the selection to the provenance state
  };

  return (
    <Box>
      <Button onClick={() => setOpenAddPlot(true)}>Add Plot</Button>
      <AddPlotDialog open={openAddPlot} onClose={onClose} />
      <Box sx={{ overflowX: 'auto' }}>
        {(scatterplots.length > 0 || histograms.length > 0) && (
          <VegaLite
            spec={
              generateVega(scatterplots, histograms, isElementSelection(elementSelection) ? elementSelection : undefined)
            }
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

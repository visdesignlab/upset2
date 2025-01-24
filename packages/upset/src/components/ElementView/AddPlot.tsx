import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import { FC, useContext, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { attributeAtom, dataAttributeSelector } from '../../atoms/attributeAtom';
import { itemsAtom } from '../../atoms/itemsAtoms';
import { ProvenanceContext } from '../Root';
import { HistogramPlot } from './HistogramPlot';
import { ScatterplotPlot } from './Scatterplot';

type Props = {
  handleClose: () => void;
};

type ButtonProps = {
  /**
   * Function to close the dialog box
   */
  handleClose: () => void;
  /**
   * Type of plot to add
   */
  type: 'Scatterplot' | 'Histogram';
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * If type is histogram, the attribute to plot
   */
  attribute?: string;
  /**
   * If type is histogram, the number of bins
   */
  bins?: number;
  /**
   * If type is histogram, whether to plot frequency (when true; binned) or density (when false; continuous)
   */
  frequency?: boolean;
  /**
   * If type is scatterplot, the x attribute
   */
  x?: string;
  /**
   * If type is scatterplot, the y attribute
   */
  y?: string;
  /**
   * If type is scatterplot, whether to use log scale for x axis
   */
  xLogScale?: boolean;
  /**
   * If type is scatterplot, whether to use log scale for y axis
   */
  yLogScale?: boolean;
}

/**
 * Add button for adding a plot
 * @param param0 @see ButtonProps
 * @returns Button
 */
const AddButton: FC<ButtonProps> = ({
  handleClose, type, bins, attribute, frequency, x, y, xLogScale, yLogScale, disabled,
}) => {
  const { actions } = useContext(ProvenanceContext);

  return (
    <Button
      style={{ display: 'block', margin: 'auto', width: '100%' }}
      disabled={disabled}
      variant="outlined"
      color="success"
      onClick={() => {
        actions.addPlot({
          id: Date.now().toString(),
          type,
          ...(type === 'Scatterplot' && {
            x,
            y,
            xLogScale,
            yLogScale,
          }),
          ...(type === 'Histogram' && {
            attribute,
            bins,
            frequency,
          }),
        });
        handleClose();
      }}
    >
      Add Plot
    </Button>
  );
};

const PLOT_CONTAINER_STYLE = { width: '100%', display: 'flex', justifyContent: 'center' };
/**
 * UI for adding a scatterplot to the element view
 * @param param0 @see Props
 */
export const AddScatterplot: FC<Props> = ({ handleClose }) => {
  const attributeColumns = useRecoilValue(attributeAtom);
  const items = useRecoilValue(itemsAtom);
  const [x, setX] = useState<string>(attributeColumns[0]);
  const [y, setY] = useState<string>(attributeColumns[1]);
  const [xLogscale, setXLogScale] = useState(false);
  const [yLogscale, setYLogScale] = useState(false);

  return (
    <Grid container spacing={1} sx={{ width: '100%', height: '100%' }}>
      <Grid container item xs={6}>
        <FormControl fullWidth>
          <InputLabel id="x-select-label">X</InputLabel>
          <Select
            labelId="x-select-label"
            id="x-select"
            value={x}
            label="X"
            onChange={(event) => setX(event.target.value as string)}
          >
            {attributeColumns.map((attr) => (
              <MenuItem key={attr} value={attr}>
                {attr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid container item xs={6}>
        <FormControl fullWidth>
          <InputLabel id="y-select-label">Y</InputLabel>
          <Select
            labelId="y-select-label"
            id="y-select"
            value={y}
            label="Y"
            onChange={(event) => setY(event.target.value as string)}
          >
            {attributeColumns.map((attr) => (
              <MenuItem key={attr} value={attr}>
                {attr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid container item xs={6}>
        <FormControlLabel
          label="Use logscale"
          control={
            <Switch
              value={xLogscale}
              onChange={() => setXLogScale(!xLogscale)}
            />
          }
        />
      </Grid>

      <Grid container item xs={6}>
        <FormControlLabel
          label="Use logscale"
          control={
            <Switch
              value={yLogscale}
              onChange={() => setYLogScale(!yLogscale)}
            />
          }
        />
      </Grid>
      {x && y && Object.values(items).length && (
      <Box sx={PLOT_CONTAINER_STYLE}>
        <ScatterplotPlot
          spec={{
            id: Date.now().toString(),
            type: 'Scatterplot',
            x,
            y,
            xScaleLog: xLogscale,
            yScaleLog: yLogscale,
          }}
          data={{
            elements: Object.values(JSON.parse(JSON.stringify(items))),
          }}
        />
      </Box>)}
      <AddButton
        disabled={!(x && y && Object.values(items).length)}
        handleClose={handleClose}
        type="Scatterplot"
        x={x}
        y={y}
        xLogScale={xLogscale}
        yLogScale={yLogscale}
      />
    </Grid>
  );
};

/**
 * UI for adding a histogram to the element view
 * @param param0 @see Props
 */
export const AddHistogram: FC<Props> = ({ handleClose }) => {
  const items = useRecoilValue(itemsAtom);
  const attributeColumns = useRecoilValue(dataAttributeSelector);
  const [attribute, setAttribute] = useState(attributeColumns[0]);
  const [bins, setBins] = useState(20);
  // Frequency plots are temporarily disabled, see comment further down
  // const [frequency, setFrequency] = useState(true);
  const frequency = false;

  return (
    <Grid container spacing={1} sx={{ width: '100%', height: '100%' }}>
      <Grid container item xs={4}>
        <FormControl fullWidth>
          <InputLabel id="attribute-select-label">Attribute</InputLabel>
          <Select
            labelId="attribute-select-label"
            id="attribute-select"
            value={attribute}
            label="Attribute"
            onChange={(event) => setAttribute(event.target.value as string)}
          >
            {attributeColumns.map((attr) => (
              <MenuItem key={attr} value={attr}>
                {attr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid container item xs={4}>
        <TextField
          disabled={frequency}
          label="Bins"
          value={bins}
          type="number"
          onChange={(event) => {
            const newBins = Number(event.target.value);

            if (newBins > 0) setBins(newBins);
          }}
        />
      </Grid>

      {/*
        * Frequency plots are disabled currently due to a bug in Vega-Lite
        * To re-enable, uncomment this, change frequency back to a useState at the top of this component,
        * and find the section in generatePlotSpec.ts which also needs uncommenting
      <Grid container item xs={4}>
        <FormControlLabel
          label="Frequency"
          control={
            <Switch
              value={frequency}
              onChange={() => setFrequency(!frequency)}
            />
          }
        />
      </Grid>
      */}
      {attribute && bins > 0 && Object.values(items).length && (
      <Box sx={PLOT_CONTAINER_STYLE}>
        <HistogramPlot
          spec={{
            id: Date.now().toString(),
            type: 'Histogram',
            attribute,
            bins,
            frequency,
          }}
          data={{
            elements: Object.values(JSON.parse(JSON.stringify(items))),
          }}
        />

      </Box>
      )}
      <AddButton
        disabled={!(attribute && bins > 0 && Object.values(items).length)}
        handleClose={handleClose}
        type="Histogram"
        attribute={attribute}
        bins={bins}
        frequency={frequency}
      />
    </Grid>
  );
};

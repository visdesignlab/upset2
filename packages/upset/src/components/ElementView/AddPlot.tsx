import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { FC, useContext, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { dataAttributeSelector } from '../../atoms/attributeAtom';
import { itemsAtom } from '../../atoms/itemsAtoms';
import { ProvenanceContext } from '../Root';
import { HistogramPlot } from './HistogramPlot';
import { ScatterplotPlot } from './Scatterplot';
import { UpsetActions } from '../../provenance';

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
  density?: boolean;
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
  xScaleLog?: boolean;
  /**
   * If type is scatterplot, whether to use log scale for y axis
   */
  yScaleLog?: boolean;
};

/**
 * Add button for adding a plot
 * @param param0 @see ButtonProps
 * @returns Button
 */
const AddButton: FC<ButtonProps> = ({
  handleClose,
  type,
  bins,
  attribute,
  density,
  x,
  y,
  xScaleLog,
  yScaleLog,
  disabled,
}) => {
  const { actions }: { actions: UpsetActions } = useContext(ProvenanceContext);

  return (
    <Button
      style={{ display: 'block', margin: 'auto', width: '100%' }}
      disabled={disabled}
      variant="outlined"
      color="success"
      onClick={() => {
        if (type === 'Scatterplot' && x && y) {
          actions.addPlot({
            id: Date.now().toString(),
            type: 'Scatterplot',
            x,
            y,
            xScaleLog,
            yScaleLog,
          });
        } else if (type === 'Histogram' && attribute && bins) {
          actions.addPlot({
            id: Date.now().toString(),
            type: 'Histogram',
            attribute,
            bins,
            // Just type coerce/default true to avoid undefined
            frequency: density ?? true,
          });
        }
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
  const attributeColumns = useRecoilValue(dataAttributeSelector);
  const items = useRecoilValue(itemsAtom);
  const [x, setX] = useState<string>(attributeColumns[0]);
  const [y, setY] = useState<string>(attributeColumns[1]);
  const [xScaleLog, setXLogScale] = useState(false);
  const [yScaleLog, setYLogScale] = useState(false);

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
            onChange={(event) => setX(event.target.value)}
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
            onChange={(event) => setY(event.target.value)}
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
          control={<Switch value={xScaleLog} onChange={() => setXLogScale(!xScaleLog)} />}
        />
      </Grid>

      <Grid container item xs={6}>
        <FormControlLabel
          label="Use logscale"
          control={<Switch value={yScaleLog} onChange={() => setYLogScale(!yScaleLog)} />}
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
              xScaleLog,
              yScaleLog,
            }}
            data={{
              elements: Object.values(JSON.parse(JSON.stringify(items))),
            }}
          />
        </Box>
      )}
      <AddButton
        disabled={!(x && y && Object.values(items).length)}
        handleClose={handleClose}
        type="Scatterplot"
        x={x}
        y={y}
        xScaleLog={xScaleLog}
        yScaleLog={yScaleLog}
      />
    </Grid>
  );
};

/**
 * UI for adding a histogram to the element view
 * @param param0 @see Props
 */
export const AddHistogram: FC<Props & { density: boolean }> = ({
  handleClose,
  density,
}) => {
  const items = useRecoilValue(itemsAtom);
  const attributeColumns = useRecoilValue(dataAttributeSelector);
  const [attribute, setAttribute] = useState(attributeColumns[0]);
  const [bins, setBins] = useState(20);

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
            onChange={(event) => setAttribute(event.target.value)}
          >
            {attributeColumns.map((attr) => (
              <MenuItem key={attr} value={attr}>
                {attr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {!density && (
        <Grid container item xs={4}>
          <TextField
            disabled={density}
            label="Bins"
            value={bins}
            type="number"
            onChange={(event) => {
              const newBins = Number(event.target.value);

              if (newBins > 0) setBins(newBins);
            }}
          />
        </Grid>
      )}

      <Grid container item xs={12}>
        {attribute && bins > 0 && Object.values(items).length && (
          <Box sx={PLOT_CONTAINER_STYLE}>
            <HistogramPlot
              spec={{
                id: Date.now().toString(),
                type: 'Histogram',
                attribute,
                bins,
                frequency: density,
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
          density={density}
        />
      </Grid>
    </Grid>
  );
};

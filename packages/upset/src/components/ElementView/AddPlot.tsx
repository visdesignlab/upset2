import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import { FC, useContext, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { attributeAtom } from '../../atoms/attributeAtom';
import { itemsAtom } from '../../atoms/itemsAtoms';
import { ProvenanceContext } from '../Root';
import { HistogramPlot } from './HistogramPlot';
import { ScatterplotPlot } from './Scatterplot';

type Props = {
  handleClose: () => void;
};

export const AddScatterplot: FC<Props> = ({ handleClose }) => {
  const { actions } = useContext(ProvenanceContext);
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
      <Grid container item xs={12}>
        {x && y && Object.values(items).length && (
          <Box sx={{ display: 'flex' }}>
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

            <div>
              <IconButton
                onClick={() => {
                  actions.addPlot({
                    id: Date.now().toString(),
                    type: 'Scatterplot',
                    x,
                    y,
                    xScaleLog: xLogscale,
                    yScaleLog: yLogscale,
                  });
                  handleClose();
                }}
              >
                <AddIcon />
              </IconButton>
            </div>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export const AddHistogram: FC<Props> = ({ handleClose }) => {
  const { actions } = useContext(ProvenanceContext);
  const items = useRecoilValue(itemsAtom);
  const attributeColumns = useRecoilValue(attributeAtom);
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

      <Grid container item xs={12}>
        {attribute && bins > 0 && Object.values(items).length && (
          <Box sx={{ display: 'flex' }}>
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

            <div>
              <IconButton
                onClick={() => {
                  actions.addPlot({
                    id: Date.now().toString(),
                    type: 'Histogram',
                    attribute,
                    bins,
                    frequency,
                  });
                  handleClose();
                }}
              >
                <AddIcon />
              </IconButton>
            </div>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

import {
  Box,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  css,
  debounce,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, FC, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { sortBySelector } from '../atoms/config/sortByAtom';
import { maxVisibleSelector, minVisibleSelector } from '../atoms/config/filterAtoms';
import { ProvenanceContext } from './Root';
import { altTextSelector } from '../atoms/config/altTextAtoms';

type Props = {
  open: boolean;
  close: () => void;
  generateAltText: (verbosity: string, explain: string) => Promise<string>;
}

const initialDrawerWidth = 450;

export const AltTextSidebar: FC<Props> = ({ open, close, generateAltText }) => {
  const { actions } = useContext(ProvenanceContext);
  const { verbosity, explain } = useRecoilValue(altTextSelector);

  const sort = useRecoilValue(sortBySelector);
  const minVisible = useRecoilValue(minVisibleSelector);
  const maxVisible = useRecoilValue(maxVisibleSelector);

  const [textDescription, setTextDescription] = useState('');

  // values added as a dependency here indicate values which are usable to the alt-text generator API call
  // When new options are added to the alt-text API, they should be added here as well
  useEffect(() => {
    async function generate(): Promise<void> {
      const resp = await generateAltText(verbosity, explain);
      setTextDescription(resp);
    }

    generate();
  }, [verbosity, explain, sort, minVisible, maxVisible]);

  const handleVerbosityChange = (e: EventTarget & HTMLInputElement): void => {
    actions.setVerbosity(e.value);
  };

  const handleExplainChange = (e: EventTarget & HTMLInputElement): void => {
    actions.setExplain(e.value);
  };

  // the selection values are debounced so that the select dropdown updates immediately while the alt-text is generated, rather than waiting for the generation to complete
  const debouncedVerbosityChange = debounce(handleVerbosityChange, 1);
  const debouncedExplainChange = debounce(handleExplainChange, 1);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={close}
      variant="persistent"
      sx={{
        width: (open) ? initialDrawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          padding: '1em',
          marginTop: '2em',
          width: (open) ? initialDrawerWidth : 0,
          boxSizing: 'border-box',
          zIndex: 0,
        },
      }}
    >
      <div css={css`width:${initialDrawerWidth}`}>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 95%;
          `}
        >
          <Typography variant="h2" fontSize="1.5em" fontWeight="inherit">
            Alternative Text
          </Typography>
          <IconButton onClick={close}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider
          css={css`
            width: 95%;
            margin: auto;
            margin-bottom: 1em;
          `}
        />
        <Box>
          <TextField multiline InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} label="Text Description" defaultValue={textDescription} fullWidth maxRows={8} />
          <Box display="flex" justifyContent="space-around" marginTop="1rem">
            <FormControl sx={{ width: '40%' }}>
              <InputLabel id="verbosity-label">Verbosity</InputLabel>
              <Select
                labelId="verbosity-label"
                label="Verbosity"
                defaultValue="low"
                onChange={(e: any): void => debouncedVerbosityChange(e.target)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: '40%' }}>
              <InputLabel id="explain-label">Explain</InputLabel>
              <Select
                labelId="explain-label"
                label="Explain"
                defaultValue="full"
                onChange={(e: any): void => debouncedExplainChange(e.target)}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="simple">Simple</MenuItem>
                <MenuItem value="full">Full</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </div>
    </Drawer>
  );
};

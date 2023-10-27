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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, FC } from 'react';
import { useRecoilValue } from 'recoil';
import { sortBySelector } from '../atoms/config/sortByAtom';
import { maxVisibleSelector, minVisibleSelector } from '../atoms/config/filterAtoms';

type Props = {
  open: boolean;
  close: () => void;
  generateAltText: (verbosity: string, explain: string) => Promise<string>;
}

const initialDrawerWidth = 450;

export const AltTextSidebar: FC<Props> = ({ open, close, generateAltText }) => {
  const [altText, setAltText] = useState<string>('');
  const [verbosity, setVerbosity] = useState<string>('low');
  const [explain, setExplain] = useState<string>('full');

  const sort = useRecoilValue(sortBySelector);
  const minVisible = useRecoilValue(minVisibleSelector);
  const maxVisible = useRecoilValue(maxVisibleSelector);

  useEffect(() => {
    async function generate(): Promise<void> {
      const resp = await generateAltText(verbosity, explain);
      setAltText(resp);
    }

    generate();
  }, [verbosity, explain, sort, minVisible, maxVisible]);

  const handleVerbosityChange = (e: EventTarget & HTMLInputElement): void => {
    setVerbosity(e.value);
  };

  const handleExplainChange = (e: EventTarget & HTMLInputElement): void => {
    setExplain(e.value);
  };

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
          <Typography variant="button" fontSize="1em">
            Alt Text
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
        <TextField multiline InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} label="Text Description" defaultValue={altText} fullWidth maxRows={8} />
        <Box display="flex" justifyContent="space-around" marginTop="1rem">
          <FormControl sx={{ width: '40%' }}>
            <InputLabel id="verbosity-label">Verbosity</InputLabel>
            <Select
              labelId="verbosity-label"
              label="Verbosity"
              value={verbosity}
              onChange={(e: any): void => handleVerbosityChange(e.target)}
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
              value={explain}
              onChange={(e: any): void => handleExplainChange(e.target)}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="simple">Simple</MenuItem>
              <MenuItem value="full">Full</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
    </Drawer>
  );
};

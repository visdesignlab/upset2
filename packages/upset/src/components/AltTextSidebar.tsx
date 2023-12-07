import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import {
  useState, useEffect, FC, useContext,
} from 'react';
import { useRecoilValue } from 'recoil';
import { Edit } from '@mui/icons-material';
import { sortBySelector } from '../atoms/config/sortByAtom';
import { maxVisibleSelector, minVisibleSelector } from '../atoms/config/filterAtoms';
import { ProvenanceContext } from './Root';
import { altTextSelector } from '../atoms/config/altTextAtoms';
import { metaDataSelector } from '../atoms/config/metaDataAtom';

type Props = {
  open: boolean;
  close: () => void;
  generateAltText: (verbosity: string, explain: string) => Promise<string>;
}

const plotInfoItem = {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  margin: '0.25em 0',
  minHeight: '4em',
};

const plotInfoText = {
  fontSize: '1em',
  fontWeight: 'inherit',
  width: '70%',
};

const plotInfoTitle = {
  fontSize: '1em',
  fontWeight: 'inherit',
  color: 'GrayText',
  width: '30%',
};

const initialDrawerWidth = 450;

export const AltTextSidebar: FC<Props> = ({ open, close, generateAltText }) => {
  const { actions } = useContext(ProvenanceContext);
  const { verbosity, explain } = useRecoilValue(altTextSelector);
  const metaDataState = useRecoilValue(metaDataSelector);

  const sort = useRecoilValue(sortBySelector);
  const minVisible = useRecoilValue(minVisibleSelector);
  const maxVisible = useRecoilValue(maxVisibleSelector);

  const [textDescription, setTextDescription] = useState('');
  const [isEditable, setIsEditable] = useState(false);

  const [metaData, setMetaData] = useState(metaDataState);

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
      aria-label="Alt Text Sidebar"
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
          <Typography variant="h2" fontSize="1.2em" fontWeight="inherit">
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
        <Box>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h3" fontSize="1em" fontWeight="inherit">
                Plot Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* edit icon here which triggers the isEditable state */}
              <IconButton
                aria-label="Toggle editable descriptions"
                onClick={() => setIsEditable(!isEditable)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditable(!isEditable)}
              >
                <Edit />
              </IconButton>
              <Box>
                <Box sx={plotInfoItem}>
                  <Typography variant="h4" sx={plotInfoTitle}>
                    Dataset Description:
                  </Typography>
                  { !isEditable ?
                    <Typography variant="h4" sx={plotInfoText}>
                      {metaDataState.description}
                    </Typography> :
                    <TextField
                      onChange={(e) => setMetaData({ ...metaData, description: e.target.value })}
                      sx={{ width: '70%' }}
                      multiline
                      InputLabelProps={{ shrink: true }}
                      defaultValue={metaDataState.description}
                      fullWidth
                      maxRows={8}
                    />}
                </Box>
              </Box>
              <Box>
                <Box sx={plotInfoItem}>
                  <Typography variant="h4" sx={plotInfoTitle}>
                    Sets:
                  </Typography>
                  { !isEditable ?
                    <Typography variant="h4" sx={plotInfoText}>
                      {metaDataState.sets}
                    </Typography> :
                    <TextField
                      onChange={(e) => setMetaData({ ...metaData, sets: e.target.value })}
                      sx={{ width: '70%' }}
                      multiline
                      InputLabelProps={{ shrink: true }}
                      defaultValue={metaDataState.sets}
                      fullWidth
                      maxRows={8}
                    />}
                </Box>
              </Box>
              <Box>
                <Box sx={plotInfoItem}>
                  <Typography variant="h4" sx={plotInfoTitle}>
                    Items:
                  </Typography>
                  { !isEditable ?
                    <Typography variant="h4" sx={plotInfoText}>
                      {metaDataState.items}
                    </Typography> :
                    <TextField
                      onChange={(e) => setMetaData({ ...metaData, items: e.target.value })}
                      sx={{ width: '70%' }}
                      multiline
                      InputLabelProps={{ shrink: true }}
                      defaultValue={metaDataState.items}
                      fullWidth
                      maxRows={8}
                    />}
                </Box>
              </Box>
              { isEditable && <Button color="error" onClick={() => { setIsEditable(false); }}>Cancel</Button>}
              { isEditable && <Button onClick={() => { actions.setMetaData(metaData); setIsEditable(false); }}>Save</Button> }
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box marginTop={5}>
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

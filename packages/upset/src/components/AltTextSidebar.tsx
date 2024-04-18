import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  TextField,
  Typography,
  css,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import {
  useState, useEffect, FC, useContext,
} from 'react';
import { useRecoilValue } from 'recoil';
import { Edit } from '@mui/icons-material';
import { ProvenanceContext } from './Root';
import { plotInformationSelector } from '../atoms/config/plotInformationAtom';
import ReactMarkdownWrapper from './custom/ReactMarkdownWrapper';
import { upsetConfigAtom } from '../atoms/config/upsetConfigAtoms';

type Props = {
  open: boolean;
  close: () => void;
  generateAltText: () => Promise<string>;
}

const plotInfoItem = {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  margin: '0.25em 0',
  minHeight: '4em',
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
  const plotInformationState = useRecoilValue(plotInformationSelector);

  const currState = useRecoilValue(upsetConfigAtom);

  const [textDescription, setTextDescription] = useState('');
  const [isEditable, setIsEditable] = useState(false);

  const [plotInformation, setPlotInformation] = useState(plotInformationState);

  const placeholderText = {
    description: 'movie genres and ratings',
    sets: 'movie genres (dataset columns)',
    items: 'movies (dataset rows)',
  };

  // values added as a dependency here indicate values which are usable to the alt-text generator API call
  // When new options are added to the alt-text API, they should be added here as well
  useEffect(() => {
    async function generate(): Promise<void> {
      const resp = await generateAltText();

      setTextDescription(resp);
    }

    generate();
  }, [currState]);

  // this will prevent the state from being reset while the user is editing the form values
  if (!isEditable) {
    setPlotInformation(plotInformationState);
  }

  const generatePlotInformationText = () => {
    // return default string if there are no values filled in
    if (Object.values(plotInformation).filter((a) => a.length > 0).length === 0) {
      return `This UpSet plot shows ${placeholderText.description}. The sets are ${placeholderText.sets}. The items are ${placeholderText.items}`;
    }

    let str: string = '';
    if (plotInformation.description !== '') {
      str += `This UpSet plot shows ${plotInformation.description}. `;
    }
    if (plotInformation.sets !== '') {
      str += `The sets are ${plotInformation.sets}. `;
    }
    if (plotInformation.items !== '') {
      str += `The items are ${plotInformation.items}.`;
    }

    return str;
  };

  const handleEditableChange = () => {
    setIsEditable(!isEditable);
  };

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
                onClick={handleEditableChange}
              >
                <Edit />
              </IconButton>
              <Box>
                <Box sx={plotInfoItem}>
                  <Typography variant="h4" sx={plotInfoTitle}>
                    Dataset Description:
                  </Typography>
                  <TextField
                    onChange={(e) => setPlotInformation({ ...plotInformation, description: e.target.value })}
                    sx={{ width: '70%' }}
                    multiline
                    InputLabelProps={{ shrink: true }}
                    value={plotInformation.description}
                    fullWidth
                    maxRows={8}
                    disabled={!isEditable}
                    placeholder={`eg: ${placeholderText.description}`}
                  />
                </Box>
              </Box>
              <Box>
                <Box sx={plotInfoItem}>
                  <Typography variant="h4" sx={plotInfoTitle}>
                    Sets:
                  </Typography>
                  <TextField
                    onChange={(e) => setPlotInformation({ ...plotInformation, sets: e.target.value })}
                    sx={{ width: '70%' }}
                    multiline
                    InputLabelProps={{ shrink: true }}
                    value={plotInformation.sets}
                    fullWidth
                    maxRows={8}
                    disabled={!isEditable}
                    placeholder={`eg: ${placeholderText.sets}`}
                  />
                </Box>
              </Box>
              <Box>
                <Box sx={plotInfoItem}>
                  <Typography variant="h4" sx={plotInfoTitle}>
                    Items:
                  </Typography>
                  <TextField
                    onChange={(e) => setPlotInformation({ ...plotInformation, items: e.target.value })}
                    sx={{ width: '70%' }}
                    multiline
                    InputLabelProps={{ shrink: true }}
                    value={plotInformation.items}
                    fullWidth
                    maxRows={8}
                    disabled={!isEditable}
                    placeholder={`eg: ${placeholderText.items}`}
                  />
                </Box>
              </Box>
              <Typography variant="body1">{generatePlotInformationText()}</Typography>
              { isEditable && <Button color="error" onClick={handleEditableChange}>Cancel</Button>}
              { isEditable && <Button onClick={() => { actions.setPlotInformation(plotInformation); setIsEditable(false); }}>Save</Button> }
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box marginTop={2}>
          <div css={css`overflow-y: auto; padding-bottom: 4rem;`}>
            <ReactMarkdownWrapper text={textDescription} />
          </div>
        </Box>
      </div>
    </Drawer>
  );
};

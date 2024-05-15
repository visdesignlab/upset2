import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
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
import { upsetConfigAtom } from '../atoms/config/upsetConfigAtoms';
import { AltText } from '../types';
import ReactMarkdownWrapper from './custom/ReactMarkdownWrapper';
import { PlotInformation } from '@visdesignlab/upset2-core';
import '../index.css';
import { HelpCircle } from './custom/HelpCircle';

type Props = {
  open: boolean;
  close: () => void;
  generateAltText: () => Promise<AltText>;
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

/**
* Displays a sidebar for generating alternative text
* and editing the alt text, caption, title, and plot information.
*
* @component
* @param {Props} props - The component props.
* @param {boolean} props.open - Indicates whether the sidebar is open or closed.
* @param {() => void} props.close - Callback function to close the sidebar.
* @param {() => Promise<AltText>} props.generateAltText - Callback function to generate alternative text for the plot.
* @returns {JSX.Element} The AltTextSidebar component.
*/
export const AltTextSidebar: FC<Props> = ({ open, close, generateAltText }) => {
  const { actions } = useContext(ProvenanceContext);
  const plotInformationState = useRecoilValue(plotInformationSelector);
  
  const currState = useRecoilValue(upsetConfigAtom);
  let [userAltText, setUserAltText] = useState(currState.userAltText);

  const [altText, setAltText] = useState<AltText | null>(null);
  const [textGenErr, setTextGenErr] = useState(false);
  const [useLong, setUseLong] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  
  const [plotInformation, setPlotInformation] = useState(plotInformationState);
  
  // States for editing the alt text
  const [textHover, setTextHover] = useState(false);
  const [textEditing, setTextEditing] = useState(false);
  
  const placeholderText = {
    description: 'movie genres and ratings',
    sets: 'movie genres (dataset columns)',
    items: 'movies (dataset rows)',
  };

  console.log("User alt text: ", userAltText);
  console.log("Uselong: ", useLong);
  
  // values added as a dependency here indicate values which are usable to the alt-text generator API call
  // When new options are added to the alt-text API, they should be added here as well
  useEffect(() => {
    async function generate(): Promise<void> {
      try {
        setAltText(await generateAltText());
        setTextGenErr(false);
      } catch (e) {
        const msg: string = (e as Error).message;
        // We want the error message to display on the frontend
        setAltText({
          longDescription: msg,
          shortDescription: msg,
          techniqueDescription: msg,
        });
        setTextGenErr(true);
      }
    }
    
    generate();
  }, [currState]);
  
  useEffect(() => {
    // this will prevent the state from being reset while the user is editing the form values
    if (!isEditable &&
      // Technically react will bail out if the values are the same, but this is a more explicit check
      // which should also run faster.
      // The point is to prevent an infinite loop of setting the state to the same value
      !Object.entries(plotInformation).every(([key, value]) => value === plotInformationState[key as keyof PlotInformation])
    ) {
      setPlotInformation(plotInformationState);
    }
  });
  
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
  
  const divider = <Divider
    css={css`
      width: 95%;
      margin: auto;
      margin-bottom: 1em;
    `}
  />
  
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
      <Typography variant="h2" fontSize="1.2em" fontWeight="inherit" height="1.4em" padding="0">
        Title:&nbsp;
      </Typography>
      <TextField fullWidth 
        variant='standard'
        style={{marginBottom: "5px"}}
        inputProps={{
          disableUnderline: true,
          style: {
            padding: "1px", 
            height: "1.4em", 
            fontSize: "1.2em", 
            fontWeight: "inherit",
            border: "none",
        }}}
        // We only want to update the title when losing focus to prevent trrack spam
        onBlur={(e) => {
          if (e.target.value !== currState.title) {
            actions.setTitle(e.target.value);
          }
        }}
      />
      <IconButton onClick={close}>
        <CloseIcon />
      </IconButton>
    </div>
    {divider}
    <Typography variant="h2" fontSize="1.2em" fontWeight="inherit" height="1.4em" padding="0">
      Caption:
    </Typography>
    {divider}
    <TextField fullWidth multiline
      inputProps={{
          rows: 3,
          // We need to override the default overflow prop (hidden), then still deny x scrolling
          style: {height: "4em", overflow: "auto", overflowX: "hidden"}
        }}
      // We only want to update when losing focus to prevent trrack spam
      onBlur={(e) => {
        if (e.target.value !== currState.caption) {
          actions.setCaption(e.target.value);
        }
      }}
    />
    <Typography variant="h2" fontSize="1.2em" fontWeight="inherit" height="1.4em" padding="0" marginTop="1em">
      Text Description:
    </Typography>
    {divider}
    <Grid 
      component="label" 
      container 
      direction="row" 
      justifyContent="center" 
      alignItems="center" 
      spacing={1} 
      width="100%"
    >
      <Grid item>Auto</Grid>
        <Grid item>
          <Switch
            checked={!!userAltText || textEditing}
            onChange={(ev) => {
              setTextEditing(ev.target.checked);
              if (!ev.target.checked) {
                actions.setUserAltText(undefined);
                setUserAltText(undefined);
              }
            }}
          />
        </Grid>
      <Grid item>Manual</Grid>
    </Grid>
    <Box marginTop={2} css={css`overflow-y: auto; padding-bottom: 4rem;`}>
      {!textGenErr ? (<>
        <FormControlLabel
          style={{marginLeft: "5px"}} // Align with below text; has 2px border & 3px padding
          sx={{ '& span': { fontSize: '0.8rem' } }} // Fontsize can't be set in style prop for some reason
          label="Show long description"
          control={
            <Switch
              disabled={textEditing || !!userAltText}
              size="small"
              checked={useLong}
              onChange={(ev) => {
                setUseLong(ev.target.checked);
              }}
            />
          }
          labelPlacement="start"
        />
        <HelpCircle 
          text={"When enabled, displays the long text description for this plot instead of the short version."}
          margin={{left: 12, top: 0, right: 0, bottom: 0}} 
        />
      </>) : null}
      {textEditing ? (<>
        <Button 
          color="primary" 
          style={{float: 'right'}} 
          onClick={() => {
            setTextEditing(false);
            actions.setUserAltText(userAltText);
          }}
        >Save</Button>
        <br />
        <TextField multiline fullWidth
          onChange={(e) => {setUserAltText(e.target.value)}}
          value={userAltText ?? (useLong ? altText?.longDescription : altText?.shortDescription)} 
        />
        <br />
      </>) : (
        <div 
          style={{
            overflowY: 'auto',
            // We want a margin at the bottom if the text is long, but otherwise it pushes the show more button down
            marginBottom: useLong ? '4em' : '0',
            cursor: 'pointer',
            padding: '3px',
            borderRadius: '4px',
            border: textHover ? '2px solid #ddd' : '2px solid #fff',
            width: 'calc(100% - 10px)', // We have 10px of padding + border
          }}
          onMouseEnter={() => setTextHover(true)} 
          onMouseLeave={() => setTextHover(false)} 
          onClick={() => {setTextEditing(true)}}
        >
          <ReactMarkdownWrapper 
            text={userAltText ?? (useLong ? altText?.longDescription : altText?.shortDescription) ?? ''}
          />
        </div>
      )}
    </Box>

          {// TODO: move to modal 
          }
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
          </div>
          </Drawer>
        );
      };
      
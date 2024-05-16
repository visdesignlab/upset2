import {
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
import CloseIcon from '@mui/icons-material/Close';
import {
  useState, useEffect, FC, useContext,
} from 'react';
import { useRecoilValue } from 'recoil';
import { ProvenanceContext } from './Root';
import { upsetConfigAtom } from '../atoms/config/upsetConfigAtoms';
import { AltText } from '../types';
import ReactMarkdownWrapper from './custom/ReactMarkdownWrapper';
import '../index.css';
import { HelpCircle } from './custom/HelpCircle';
import { PlotInformationModal } from './PlotInformationModal';

type Props = {
  open: boolean;
  close: () => void;
  generateAltText: () => Promise<AltText>;
}

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
  
  const currState = useRecoilValue(upsetConfigAtom);
  const [userAltText, setUserAltText] = useState(currState.userAltText);

  const [altText, setAltText] = useState<AltText | null>(null);
  const [textGenErr, setTextGenErr] = useState(false);
  const [useLong, setUseLong] = useState(false);
  
  // States for editing the alt text
  const [textHover, setTextHover] = useState(false);
  const [textEditing, setTextEditing] = useState(false);

  const [plotInformationOpen, setPlotInformationOpen] = useState(false);

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
        <Box marginTop={2} css={css`overflow-y: auto;`}>
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
      </div>
      <Button onClick={() => setPlotInformationOpen(true)} style={{marginBottom: '5rem',}}>Provide Plot Information</Button>
      {/* @ts-ignore */}
      <PlotInformationModal open={plotInformationOpen} close={() => setPlotInformationOpen(false)} divider={divider}></PlotInformationModal>
    </Drawer>
  );
};
      
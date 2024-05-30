import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  css,
} from '@mui/material';
import {
  useState, useEffect, FC, useContext,
  useMemo,
} from 'react';
import { useRecoilValue } from 'recoil';
import { ProvenanceContext } from './Root';
import { upsetConfigAtom } from '../atoms/config/upsetConfigAtoms';
import { AltText } from '@visdesignlab/upset2-core/';
import ReactMarkdownWrapper from './custom/ReactMarkdownWrapper';
import '../index.css';
import { HelpCircle } from './custom/HelpCircle';
import { PlotInformation } from './custom/PlotInformation';

type Props = {
  open: boolean;
  close: () => void;
  generateAltText: () => Promise<AltText>;
}
``
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

  const [altText, setAltText] = useState<AltText | null>(null);
  const [textGenErr, setTextGenErr] = useState(false);
  
  // States for editing the alt text
  const [textHover, setTextHover] = useState(false);
  const [textEditing, setTextEditing] = useState(false);
  const [userLongText, setUserLongText] = useState(currState.userAltText?.longDescription);
  const [userShortText, setUserShortText] = useState(currState.userAltText?.shortDescription);
  const [useLong, setUseLong] = useState(false);

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

  // Current alt text to display to the user
  const displayAltText: string | undefined = useMemo(() => {
    return useLong 
    ? userLongText ?? altText?.longDescription 
    : userShortText ?? altText?.shortDescription;
  }, [useLong, userLongText, userShortText, altText]);
  
  const divider = <Divider
    css={css`
      width: 100%;
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
        <br />
        <PlotInformation divider={divider} />
        <Typography variant="h2" fontSize="1.2em" fontWeight="inherit" height="1.4em" padding="0" marginTop="1em">
          Text Description:
        </Typography>
        {divider}
        <Box marginTop={2} css={css`overflow-y: auto;`}>
          {!textGenErr ? (<>
            <FormControlLabel
              style={{marginLeft: "5px"}} // Align with below text; has 2px border & 3px padding
              sx={{ '& span': { fontSize: '0.8rem' } }} // Fontsize can't be set in style prop for some reason
              label="Manual Editing &nbsp;&nbsp;"
              control={
                <Switch
                  size="small"
                  style={{marginRight: "10px"}}
                  // !! converts to boolean
                  checked={textEditing || !!userShortText || !!userLongText}
                  onChange={(ev) => {
                    setTextEditing(ev.target.checked);
                    if (!ev.target.checked) {
                      setUserShortText(undefined);
                      setUserLongText(undefined);
                      if (currState.userAltText)
                        actions.setUserAltText(undefined);
                    }
                  }}
                />
              }
              labelPlacement="start"
            />
            <HelpCircle 
              text={"When enabled, allows you to enter a custom alternative text description."}
              margin={{left: 12, top: 0, right: 0, bottom: 0}} 
            />
            <br />
            <FormControlLabel
              style={{marginLeft: "5px"}} // Align with below text; has 2px border & 3px padding
              sx={{ '& span': { fontSize: '0.8rem' } }} // Fontsize can't be set in style prop for some reason
              label="Long Description"
              control={
                <Switch
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
                if (currState.userAltText?.shortDescription !== userShortText 
                    || currState.userAltText?.longDescription !== userLongText)  
                  actions.setUserAltText({shortDescription: userShortText, longDescription: userLongText});
              }}
            >Save</Button>
            <br />
            <TextField multiline fullWidth
              onChange={(e) => {useLong ? setUserLongText(e.target.value) : setUserShortText(e.target.value)}}
              value={(displayAltText)} 
            />
            <br />
          </>) : (
            <div 
              style={{
                overflowY: 'auto',
                cursor: 'pointer',
                padding: '3px',
                borderRadius: '4px',
                border: textHover ? '2px inset #ddd' : '2px solid #fff',
                width: 'calc(100% - 10px)', // We have 10px of padding + border
              }}
              onMouseEnter={() => setTextHover(true)} 
              onMouseLeave={() => setTextHover(false)} 
              onClick={() => {setTextEditing(true)}}
            >
              <ReactMarkdownWrapper 
                text={displayAltText ?? "No description available."}
              />
            </div>
          )}
        </Box>
      </div>
    </Drawer>
  );
};
      
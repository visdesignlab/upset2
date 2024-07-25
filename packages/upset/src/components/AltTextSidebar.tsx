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
import { UpsetActions } from '../provenance';

/**
 * Props for the AltTextSidebar component.
 */
/**
 * Props for the AltTextSidebar component.
 */
type Props = {
  /**
   * Indicates whether the sidebar is open or closed.
   */
  open: boolean;

  /**
   * Called when the sidebar is closed.
   */
  close: () => void;

  /**
   * Asynchronous function to generate the text description.
   * @returns A promise that resolves to an `AltText` object.
   */
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
  const { actions }: {actions: UpsetActions} = useContext(ProvenanceContext);
  
  const currState = useRecoilValue(upsetConfigAtom);

  const [altText, setAltText] = useState<AltText | null>(null);
  const [textGenErr, setTextGenErr] = useState<string | false>(false);
  
  // States for editing the alt text
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
        setTextGenErr(msg);
      }
    }
    
    generate();
  }, [currState]);

  // Current alt text to display to the user
  const displayAltText: string | undefined = useMemo(() => {
    if (textEditing) {
      return useLong
      ? userLongText ?? altText?.longDescription
      : userShortText ?? altText?.shortDescription
    }
    return useLong 
    ? currState.useUserAlt ? userLongText : altText?.longDescription 
    : currState.useUserAlt ? userShortText : altText?.shortDescription;
  }, [useLong, userLongText, userShortText, altText, currState.useUserAlt]);
  
  const divider = <Divider
    css={css`
      width: 100%;
      margin: auto;
      margin-bottom: 1em;
    `}
    aria-hidden={true}
  />
  
  return (
    <Drawer
      aria-hidden={!open}
      anchor="right"
      open={open}
      onClose={close}
      variant="persistent"
      aria-label="Accessibility Sidebar"
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
        <Typography variant="h1" fontSize="1.4em" fontWeight="inherit" height="1.4em" padding="0">
          Accessibility Sidebar
        </Typography>
        {divider}
        <PlotInformation divider={divider} tabIndex={10} />
        <Typography variant="h2" fontSize="1.2em" fontWeight="inherit" height="1.4em" padding="0" marginTop="1em">
          Description
        </Typography>
        {divider}
        <Box marginTop={2} css={css`overflow-y: auto;`}>
          {!textGenErr ? (<>
            <FormControlLabel
              style={{marginLeft: "5px"}} // Align with below text; has 2px border & 3px padding
              sx={{ '& span': { fontSize: '0.8rem' } }} // Fontsize can't be set in style prop for some reason
              label="View User Description(s)"
              control={
                <Switch
                  size="small"
                  style={{marginRight: "10px"}}
                  checked={currState.useUserAlt || textEditing}
                  tabIndex={9}
                  onChange={(ev) => {
                    if (currState.useUserAlt !== ev.target.checked)
                      actions.setUseUserAltText(ev.target.checked);
                    if (!ev.target.checked) {
                      setTextEditing(false);
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
              label="Display Long Description"
              control={
                <Switch
                  size="small"
                  checked={useLong}
                  tabIndex={8}
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
          </>) : (
            <Typography variant="body1" color="error">{textGenErr}</Typography>
          )}
          {textEditing ? (<>
            <Button 
              color="primary" 
              style={{float: 'right'}} 
              onClick={() => {
                setTextEditing(false);
                if (!currState.useUserAlt)
                  actions.setUseUserAltText(true);
                if (currState.userAltText?.shortDescription !== userShortText 
                    || currState.userAltText?.longDescription !== userLongText)  
                  actions.setUserAltText({shortDescription: userShortText ?? "", longDescription: userLongText ?? ""});
              }}
              tabIndex={7}
            >Save</Button>
            <Button
              color='warning'
              style={{float: "right"}}
              onClick={() => {
                setUserLongText(altText?.longDescription);
                setUserShortText(altText?.shortDescription);
              }}
              tabIndex={6}
            >Reset Descriptions</Button>
            <br />
            <TextField multiline fullWidth
              onChange={(e) => useLong ? setUserLongText(e.target.value) : setUserShortText(e.target.value)}
              value={(displayAltText)}
              tabIndex={5}
            />
            <br />
          </>) : (
            <div 
              style={{
                overflowY: 'auto',
                cursor: 'pointer',
                padding: '3px',
                borderRadius: '4px',
                width: 'calc(100% - 10px)', // We have 10px of padding + border
                paddingBottom: '90px', // Necessary to keep it above the footer
              }}
              onClick={() => {
                setTextEditing(true);
                if (!currState.userAltText?.shortDescription)
                  setUserShortText(altText?.shortDescription);
                if (!currState.userAltText?.longDescription)
                  setUserLongText(altText?.longDescription);
              }}
              tabIndex={3}  
            >
              <ReactMarkdownWrapper 
                text={
                  displayAltText ?? (currState.useUserAlt 
                    ? "No user-generated description available." 
                    : "No description available.")
                }
              />
              <Button
                style={{
                  width: '100%',
                  textAlign: 'center',
                }}
                onClick={() => setTextEditing(true)}
                tabIndex={4}
              >Edit Text Description</Button>
            </div>
          )}
        </Box>
      </div>
    </Drawer>
  );
};
      
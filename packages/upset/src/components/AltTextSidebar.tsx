import {
  Box,
  Button,
  Divider,
  Drawer,
  Icon,
  TextField,
  Typography,
  css,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
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
import { PlotInformation } from './custom/PlotInformation';
import { UpsetActions } from '../provenance';

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

  /**
   * Handler for when the save button is clicked
   */
  function saveButtonClick() {
    setTextEditing(false);
    if (!currState.useUserAlt)
      actions.setUseUserAltText(true);
    if (currState.userAltText?.shortDescription !== userShortText 
        || currState.userAltText?.longDescription !== userLongText)  
      actions.setUserAltText({shortDescription: userShortText ?? "", longDescription: userLongText ?? ""});
  }

  /**
   * Sets text editing to true and sets default user alttexts if necessary
   */
  function enableTextEditing() {
    setTextEditing(true);
    if (!currState.userAltText?.shortDescription)
      setUserShortText(altText?.shortDescription);
    if (!currState.userAltText?.longDescription)
      setUserLongText(altText?.longDescription);
  }

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
      if (useLong) return userLongText ?? altText?.longDescription ?? ""
      else return userShortText ?? altText?.shortDescription ?? "";
  }, [useLong, userLongText, userShortText, altText?.shortDescription, altText?.longDescription]);
  
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
      aria-label="Alt Text and Plot Information Sidebar"
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
          Text Descriptions
        </Typography>
        {divider}
        <PlotInformation divider={divider} tabIndex={9} />
        <Typography variant="h2" fontSize="1.2em" fontWeight="inherit" height="1.4em" padding="0" marginTop="1em">
          Alt Text Description
        </Typography>
        {divider}
        <Box css={css`overflow-y: auto;`}>
          {textGenErr && !userLongText && !userShortText ? (
            <Typography variant="body1" color="error">{textGenErr}</Typography>
          ) : (
            textEditing ? (<>
              <Button 
                color="primary" 
                style={{float: 'right'}} 
                onClick={saveButtonClick}
                id="saveAltTextButton"
                tabIndex={7}
              >Save</Button>
              <Button
                color='warning'
                style={{float: "right"}}
                onClick={() => {
                  setUserLongText(altText?.longDescription);
                  setUserShortText(altText?.shortDescription);
                }}
                tabIndex={8}
              >Reset Descriptions</Button>
              <br />
              <TextField multiline fullWidth
                onChange={(e) => useLong ? setUserLongText(e.target.value) : setUserShortText(e.target.value)}
                value={(displayAltText)}
                tabIndex={6}
                aria-flowto='saveAltTextButton'
              />
              <br />
            </>) : (
              <Box 
                style={{
                  
                }}
                sx={{
                  '&:hover': {
                  border: '2px inset #ddd', 
                  },
                  overflowY: 'auto',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  border: '2px solid white',
                  width: 'calc(100% - 10px)', // We have 10px of padding + border
                }}
                onClick={enableTextEditing}
                tabIndex={3}  
              >
                <Button
                  style={{
                    display: 'inline-block',
                    width: '24px',
                    float: 'right',
                  }}
                  onClick={enableTextEditing}
                  tabIndex={5}
                  aria-label="Alt Text Description Editor"
                >
                  <Icon style={{overflow: 'visible'}}>
                    <EditIcon />
                  </Icon>
                </Button>
                <ReactMarkdownWrapper 
                  text={displayAltText}
                />
              </Box>
            )
          )}
          <Button
            onClick={() => setUseLong(!useLong)}
            tabIndex={4}
            style={{
              width: '100%', 
              textAlign: 'center',
              marginBottom: '90px', // Necessary to keep it above the footer
            }}
          >
            {useLong ? "Show Less" : "Show More"}
          </Button>
        </Box>
      </div>
    </Drawer>
  );
};
      
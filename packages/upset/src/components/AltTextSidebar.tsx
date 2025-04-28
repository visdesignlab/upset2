import {
  Box,
  Button,
  CircularProgress,
  Icon,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
  useState, useEffect, FC, useContext,
  useMemo,
  useCallback,
} from 'react';
import { useRecoilValue } from 'recoil';
import { AltText } from '@visdesignlab/upset2-core/';
import { ProvenanceContext } from './Root';
import { upsetConfigAtom } from '../atoms/config/upsetConfigAtoms';
import ReactMarkdownWrapper from './custom/ReactMarkdownWrapper';
import { PlotInformation } from './custom/PlotInformation';
import { UpsetActions } from '../provenance';
import { plotInformationSelector } from '../atoms/config/plotInformationAtom';
import { canEditPlotInformationAtom } from '../atoms/config/canEditPlotInformationAtom';
import { Sidebar } from './custom/Sidebar';
import { UpsetHeading } from './custom/theme/heading';

/**
 * Props for the AltTextSidebar component.
 */
type Props = {
  /**
   * Indicates whether the sidebar is open or closed.
   */
  open: boolean;

  /**
   * Callback to close the sidebar.
   */
  close: () => void;

  /**
   * Asynchronous function to generate the text description.
   * @returns A promise that resolves to an `AltText` object.
   */
  generateAltText: () => Promise<AltText>;
}

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
  /**
   * State
   */

  const { actions }: {actions: UpsetActions} = useContext(ProvenanceContext);
  const currState = useRecoilValue(upsetConfigAtom);
  const canEditPlotInformation = useRecoilValue(canEditPlotInformationAtom);
  const [altText, setAltText] = useState<AltText | null>(null);
  const [textGenErr, setTextGenErr] = useState<string | false>(false);
  const [textEditing, setTextEditing] = useState(false);
  const [userLongText, setUserLongText] = useState(currState.userAltText?.longDescription);
  const [userShortText, setUserShortText] = useState(currState.userAltText?.shortDescription);
  const [useLong, setUseLong] = useState(false);
  const [plotInfoEditing, setPlotInfoEditing] = useState(false);
  const plotInfo = useRecoilValue(plotInformationSelector);

  /**
   * Functions
   */

  /**
   * Handler for when the save button is clicked
   */
  const saveButtonClick: () => void = useCallback(() => {
    // if the user doesn't have edit permissions, don't allow saving
    // The user shouldn't be able to edit in this case, but this is a failsafe
    if (!canEditPlotInformation) return;

    setTextEditing(false);
    if (currState.userAltText?.shortDescription !== userShortText
        || currState.userAltText?.longDescription !== userLongText) { actions.setUserAltText({ shortDescription: userShortText ?? '', longDescription: userLongText ?? '' }); }
  }, [currState, userShortText, userLongText, actions, canEditPlotInformation]);

  /**
   * Sets text editing to true and sets default user alttexts if necessary
   */
  const enableTextEditing: () => void = useCallback(() => {
    // if the user doesn't have edit permissions, don't allow editing
    // The button should be hidden in this case, but this is a failsafe
    if (!canEditPlotInformation) return;

    setTextEditing(true);
    if (!currState.userAltText?.shortDescription) setUserShortText(altText?.shortDescription);
    if (!currState.userAltText?.longDescription) setUserLongText(altText?.longDescription);
  }, [currState, altText, canEditPlotInformation]);

  /**
   * Effects
   */

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

    setAltText(null);
    if (open) generate();
  }, [currState, generateAltText, open]);

  /**
   * Constants
   */

  /**
   * Number of tab indicies used by the PlotInformation component
   * @see PlotInformation to count the number of tab indices used
   */
  const PLOT_INFO_TABS = 7;
  /**
   * The tab index, in this component, of the plot information component
   */
  const PLOT_INFO_TAB_INDEX = 9;

  // Current alt text to display to the user
  const displayAltText: string | undefined = useMemo(() => {
    if (useLong) return userLongText ?? altText?.longDescription ?? '';
    return userShortText ?? altText?.shortDescription ?? '';
  }, [useLong, userLongText, userShortText, altText?.shortDescription, altText?.longDescription]);

  /**
   * Whether to display the plot information section
   */
  const displayPlotInfo: boolean = useMemo(
    () => plotInfoEditing || (currState.plotInformation && Object.values(currState.plotInformation).some((v) => !!v)),
    [currState.plotInformation, plotInfoEditing],
  );

  return (
    <Sidebar
      open={open}
      close={close}
      closeButtonTabIndex={PLOT_INFO_TABS + PLOT_INFO_TAB_INDEX}
      label="Alt Text and Plot Information Sidebar"
      title={displayPlotInfo ? plotInfo.title ?? 'Editing Plot Information' : 'Text Description'}
    >
      {displayPlotInfo &&
          // We only want to display plotInfo if the user is editing OR if they've entered some field other than title
          (plotInfoEditing || Object.entries(plotInfo).filter(([k, _]) => k !== 'title').some(([_, v]) => !!v)) ? (
            <PlotInformation
              tabIndex={PLOT_INFO_TAB_INDEX}
              editing={plotInfoEditing}
              setEditing={setPlotInfoEditing}
            />
        ) : (
      // only show "Add Plot Information" if the user has edit permissions
          canEditPlotInformation ? (
            <Button
              onClick={() => setPlotInfoEditing(true)}
              tabIndex={PLOT_INFO_TAB_INDEX}
            >
              Add Plot Information
            </Button>
          ) : null
        )}
      {displayPlotInfo && (
      <UpsetHeading level="h2" divStyle={{ marginTop: '10px' }}>Text Description</UpsetHeading>
      )}
      {/* 0.875em for default 16px = 1em makes 14px, which is the standard for much of the UI */}
      {/* if no error and currently fetching alt text (altText is null), show loading spinner */}
      {textGenErr === false && altText === null ? (
        <Box style={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) :
        <Box style={{ overflowY: 'auto', fontSize: '0.875em' }}>
          {textGenErr && !userLongText && !userShortText ? (
            <Typography variant="body1" color="error">{textGenErr}</Typography>
          ) : (
            textEditing ? (
              <>
                <Button
                  color="primary"
                  style={{ float: 'right' }}
                  onClick={saveButtonClick}
                  id="saveAltTextButton"
                  tabIndex={7}
                >
                  Save
                </Button>
                <Button
                  color="warning"
                  style={{ float: 'right' }}
                  onClick={() => {
                    setUserLongText(altText?.longDescription);
                    setUserShortText(altText?.shortDescription);
                  }}
                  tabIndex={8}
                >
                  Reset Descriptions
                </Button>
                <br />
                <TextField
                  multiline
                  fullWidth
                  onChange={(e) => (useLong ? setUserLongText(e.target.value) : setUserShortText(e.target.value))}
                  value={(displayAltText)}
                  tabIndex={6}
                  aria-flowto="saveAltTextButton"
                />
                <br />
              </>
            ) : (
              <Box
                sx={{
                  overflowY: 'auto',
                  borderRadius: '4px',
                  border: '2px solid white',
                  width: 'calc(100% - 10px)', // We have 10px of padding + border
                }}
                tabIndex={3}
              >
                {canEditPlotInformation && (
                // Only show the edit button if the user has edit permissions
                <Button
                  style={{
                    display: 'inline-block',
                    width: '24px',
                    float: 'right',
                    cursor: 'pointer',
                  }}
                  onClick={enableTextEditing}
                  tabIndex={5}
                  aria-label="Alt Text Description Editor"
                >
                  <Icon style={{ overflow: 'visible' }}>
                    <EditIcon />
                  </Icon>
                </Button>
                )}
                <ReactMarkdownWrapper
                  text={displayAltText}
                />
                <Button
                  onClick={() => setUseLong(!useLong)}
                  tabIndex={4}
                  style={{
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  {useLong ? 'Show Less' : 'Show More'}
                </Button>
              </Box>)
          )}
        </Box>}
    </Sidebar>
  );
};

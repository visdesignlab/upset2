import {
  Alert,
  Box,
  Button,
  Icon,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useRecoilValue } from 'recoil';
import {
  useContext, useState, useCallback,
} from 'react';
import { plotInformationSelector } from '../../atoms/config/plotInformationAtom';
import { ProvenanceContext } from '../Root';

/**
 * Props for the PlotInformation component.
 */
type Props = {
  /**
   * Callback function triggered when the save button is clicked.
   * @returns void
   */
  onSave?: () => void;
  /**
   * Callback to set the editing state.
   */
  setEditing: (editing: boolean) => void;
  /**
   * The starting tab index for the component. Uses up to 6 additional indices
   */
  tabIndex: number;
  /**
   * Whether the component is in editing mode by default
   */
  editing: boolean;
}

/**
 * Display & editor for plot information.
 * Uses up to 5 tab indices, starting from @param tabIndex
 * @param Props @see @type Props
 */
export const PlotInformation = ({
  onSave, setEditing, tabIndex, editing,
}: Props) => {
  /**
   * Width of the titles for all the fields in %.
   * Field entry boxes will occupy the rest of the space
   */
  const fieldTitleWidth = 30;

  /**
   * Constants
   */

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
    width: `${fieldTitleWidth}%`,
  };
  const placeholderText = {
    description: 'description of this dataset, eg: "movie genres and ratings"',
    sets: 'name for the sets in this data, eg: "movie genres"',
    items: 'name for the items in this data, eg: "movies"',
  };

  /**
   * State
   */

  const plotInformationState = useRecoilValue(plotInformationSelector);
  const [plotInformation, setPlotInformation] = useState(plotInformationState);
  const { actions } = useContext(ProvenanceContext);

  /**
   * Functions
   */

  /**
   * Generates plot information string
   * @returns string Plot information description
   */
  const generatePlotInformationText: () => string = useCallback(() => {
    // return default string if there are no values filled in
    if (Object.values(plotInformation).filter((a) => a?.length > 0).length === 0) {
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
  }, [plotInformation, placeholderText]);

  /**
   * Commits changes to the plot information if the new state is different from the old state.
   * If a commit occurs, records a trrack action.
   */
  const commitEdits = () => {
    if ( // Need to manually check for changes since the state is an object
      plotInformation.caption !== plotInformationState.caption
      || plotInformation.title !== plotInformationState.title
      || plotInformation.description !== plotInformationState.description
      || plotInformation.sets !== plotInformationState.sets
      || plotInformation.items !== plotInformationState.items
    ) actions.setPlotInformation(plotInformation);
    if (onSave) onSave();
    setEditing(false);
  };

  return (
    !editing ? (
      <Box
        tabIndex={tabIndex}
        sx={{
          border: '2px solid white', // Prevent resize on hover
          padding: '.2em',
        }}
      >
        <div style={{ height: '1.6em' }}>
          <Button
            aria-label="Plot Information Editor"
            style={{
              float: 'right',
              position: 'relative',
              bottom: '10px',
              cursor: 'pointer',
            }}
            tabIndex={tabIndex + 1}
            onClick={() => setEditing(true)}
          >
            <Icon style={{ overflow: 'visible' }}>
              <EditIcon />
            </Icon>
          </Button>
          <Typography>{plotInformation.caption}</Typography>
        </div>
        <br />
        <Typography>{generatePlotInformationText()}</Typography>
      </Box>
    ) : (
      <Box tabIndex={tabIndex}>
        <Button
          tabIndex={tabIndex + 6}
          color="primary"
          style={{ float: 'right' }}
          onClick={commitEdits}
        >
          Save
        </Button>
        <Box>
          <TextField
            tabIndex={tabIndex + 1}
            fullWidth
            variant="standard"
            style={{ marginBottom: '5px' }}
            value={plotInformation.title ?? ''}
            onChange={(e) => setPlotInformation({ ...plotInformation, title: e.target.value })}
            placeholder="Title"
            inputProps={{
              style: {
                padding: '1px',
                height: '1.4em',
                fontSize: '1.2em',
                fontWeight: 'inherit',
                border: 'none',
              },
            }}
          />
          <TextField
            tabIndex={tabIndex + 2}
            fullWidth
            multiline
            inputProps={{
              rows: 3,
              // We need to override the default overflow prop (hidden), then still deny x scrolling
              style: { height: '4em', overflow: 'auto', overflowX: 'hidden' },
            }}
            value={plotInformation.caption ?? ''}
            onChange={(e) => setPlotInformation({ ...plotInformation, caption: e.target.value })}
            placeholder="Caption"
          />
        </Box>
        <Alert severity="info">
          Providing the following information will help us improve auto-generated text descriptions
        </Alert>
        <Box>
          <Box sx={plotInfoItem}>
            <Typography variant="h4" sx={plotInfoTitle}>
              This upset plot shows:
            </Typography>
            <TextField
              tabIndex={tabIndex + 3}
              onChange={(e) => setPlotInformation({ ...plotInformation, description: e.target.value })}
              sx={{ width: `${100 - fieldTitleWidth}%` }}
              multiline
              InputLabelProps={{ shrink: true }}
              value={plotInformation.description ?? ''}
              fullWidth
              maxRows={8}
              placeholder={`${placeholderText.description}`}
            />
          </Box>
        </Box>
        <Box>
          <Box sx={plotInfoItem}>
            <Typography variant="h4" sx={plotInfoTitle}>
              The sets are:
            </Typography>
            <TextField
              tabIndex={tabIndex + 4}
              onChange={(e) => setPlotInformation({ ...plotInformation, sets: e.target.value })}
              sx={{ width: `${100 - fieldTitleWidth}%` }}
              multiline
              InputLabelProps={{ shrink: true }}
              value={plotInformation.sets ?? ''}
              fullWidth
              maxRows={8}
              placeholder={`${placeholderText.sets}`}
            />
          </Box>
        </Box>
        <Box>
          <Box sx={plotInfoItem}>
            <Typography variant="h4" sx={plotInfoTitle}>
              The items are:
            </Typography>
            <TextField
              tabIndex={tabIndex + 5}
              onChange={(e) => setPlotInformation({ ...plotInformation, items: e.target.value })}
              sx={{ width: `${100 - fieldTitleWidth}%` }}
              multiline
              InputLabelProps={{ shrink: true }}
              value={plotInformation.items ?? ''}
              fullWidth
              maxRows={8}
              placeholder={`${placeholderText.items}`}
            />
          </Box>
        </Box>
        <Typography>{generatePlotInformationText()}</Typography>
      </Box>
    )
  );
};

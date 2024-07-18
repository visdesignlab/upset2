import {
  Box,
  Button,
  Icon,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { plotInformationSelector } from '../../atoms/config/plotInformationAtom';
import { useRecoilValue } from 'recoil';
import { useContext, useState } from 'react';
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
   * The JSX element to be used as a divider.
   */
  divider: JSX.Element;
  /**
   * The starting tab index for the component. Uses up to 5 additional indices
   */
  tabIndex: number;
}

/**
 * Display & editor for plot information.
 * Uses up to 5 tab indices, starting from @parm tabIndex
 * @param Props @see @type Props
 */
export const PlotInformation = ({onSave, divider, tabIndex}: Props) => {
  /**
   * Width of the titles for all the fields in %. 
   * Field entry boxes will occupy the rest of the space
   */
  const fieldTitleWidth = 30;

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
    width: fieldTitleWidth + '%',
  };

  const placeholderText = {
    description: 'description of this dataset, eg: "movie genres and ratings"',
    sets: 'name for the setsc in this data, eg: "movie genres"',
    items: 'name for the items in this data, eg: "movies"',
  };

  const plotInformationState = useRecoilValue(plotInformationSelector);
  const [plotInformation, setPlotInformation] = useState(plotInformationState);
  const { actions } = useContext(ProvenanceContext);

  const [editing, setEditing] = useState(false);

  /**
   * Generates plot information string
   * @returns string Plot information description
   */
  const generatePlotInformationText: () => string = () => {
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
    )
      actions.setPlotInformation(plotInformation);
    if (onSave) onSave();
    setEditing(false);
  };

  return (
    !editing ? (
      <Box
        tabIndex={tabIndex}
        onClick={() => setEditing(true)}
        sx={{ 
          cursor: 'pointer',
          border: '2px solid white', // Prevent resize on hover
          padding: '.2em',
          '&:hover': {
            border: '2px inset #ddd', 
          }
        }}
      >
        <div style={{height: '1.6em'}}>
          <Typography variant="h2" fontSize="1.2em" fontWeight="inherit" height="1.4em" padding="0">
            {plotInformation.title ?? "[Title]"}
          </Typography>
          <Button 
            aria-label='Edit Plot Information' 
            style={{float: 'right', position: 'relative', bottom: '40px'}} 
            tabIndex={tabIndex + 1}
          >
            <Icon style={{overflow: 'visible'}}>
              <EditIcon />
            </Icon>
          </Button>
        </div>
        {divider}
        <Typography>{plotInformation.caption ?? "[Caption]"}</Typography>
        <br />
        <Typography>{generatePlotInformationText()}</Typography>
      </Box>
    ) : (
      <Box tabIndex={tabIndex}>
        <Button 
          tabIndex={tabIndex + 6} 
          color="primary" 
          style={{float: 'right'}} 
          onClick={commitEdits}
        >Save</Button>
        <Box>
          <TextField
            tabIndex={tabIndex + 1} 
            fullWidth 
            variant='standard'
            style={{marginBottom: "5px"}}
            value={plotInformation.title}
            onChange={(e) => setPlotInformation({ ...plotInformation, title: e.target.value })}
            placeholder='Title'
            inputProps={{
              disableUnderline: true,
              style: {
                padding: "1px", 
                height: "1.4em", 
                fontSize: "1.2em", 
                fontWeight: "inherit",
                border: "none",
            }}}/>
          <TextField 
            tabIndex={tabIndex + 2}
            fullWidth multiline
            inputProps={{
              rows: 3,
              // We need to override the default overflow prop (hidden), then still deny x scrolling
              style: {height: "4em", overflow: "auto", overflowX: "hidden"}
            }}
            value={plotInformation.caption}
            onChange={(e) => setPlotInformation({ ...plotInformation, caption: e.target.value })}
            placeholder='Caption'
          />
        </Box>
        <Box>
          <Box sx={plotInfoItem}>
            <Typography variant="h4" sx={plotInfoTitle}>
              This upset plot shows:
            </Typography>
            <TextField
              tabIndex={tabIndex + 3}
              onChange={(e) => setPlotInformation({ ...plotInformation, description: e.target.value })}
              sx={{ width: 100 - fieldTitleWidth + '%' }}
              multiline
              InputLabelProps={{ shrink: true }}
              value={plotInformation.description}
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
              sx={{ width: 100 - fieldTitleWidth + '%' }}
              multiline
              InputLabelProps={{ shrink: true }}
              value={plotInformation.sets}
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
              sx={{ width: 100 - fieldTitleWidth + '%' }}
              multiline
              InputLabelProps={{ shrink: true }}
              value={plotInformation.items}
              fullWidth
              maxRows={8}
              placeholder={`${placeholderText.items}`}
            />
          </Box>
        </Box>
        <Typography>{generatePlotInformationText()}</Typography>
      </Box>
    )
  )
}
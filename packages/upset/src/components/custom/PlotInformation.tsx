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
 * Properties for the PlotInformationEditor component
 * @param onSave Callback to run when saving the plot, in addition to saving the plot information
 * @param divider Divider component to use between the title and the caption
 */
type Props = {
  onSave?: () => void;
  divider: JSX.Element;
}

/**
 * Display & editor for plot information
 * @param Props @see @type Props
 */
export const PlotInformation = ({onSave, divider}: Props) => {
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
    description: 'movie genres and ratings',
    sets: 'movie genres (dataset columns)',
    items: 'movies (dataset rows)',
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
        <Typography variant="h2" fontSize="1.2em" fontWeight="inherit" height="1.4em" padding="0">
          {plotInformation.title ?? "[Title]"}
          <Icon style={{float: 'right'}}>
            <EditIcon />
          </Icon>
        </Typography>
        {divider}
        <Typography>{plotInformation.caption ?? "[Caption]"}</Typography>
        <br />
        <Typography>{generatePlotInformationText()}</Typography>
      </Box>
    ) : (
      <Box>
        <Button 
          color="primary" 
          style={{float: 'right'}} 
          onClick={commitEdits}
        >Save</Button>
        <Box>
          <TextField fullWidth 
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
          <TextField fullWidth multiline
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
              Dataset Description:
            </Typography>
            <TextField
              onChange={(e) => setPlotInformation({ ...plotInformation, description: e.target.value })}
              sx={{ width: 100 - fieldTitleWidth + '%' }}
              multiline
              InputLabelProps={{ shrink: true }}
              value={plotInformation.description}
              fullWidth
              maxRows={8}
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
              sx={{ width: 100 - fieldTitleWidth + '%' }}
              multiline
              InputLabelProps={{ shrink: true }}
              value={plotInformation.sets}
              fullWidth
              maxRows={8}
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
              sx={{ width: 100 - fieldTitleWidth + '%' }}
              multiline
              InputLabelProps={{ shrink: true }}
              value={plotInformation.items}
              fullWidth
              maxRows={8}
              placeholder={`eg: ${placeholderText.items}`}
            />
          </Box>
        </Box>   
      </Box>
    )
  )
}
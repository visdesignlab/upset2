import {
  Box,
  Dialog,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { plotInformationSelector } from '../atoms/config/plotInformationAtom';
import { useRecoilValue } from 'recoil';
import { useContext, useState } from 'react';
import { ProvenanceContext } from './Root';



/**
 * Properties of the modal
 * @param open Whether the modal is open
 * @param close Callback to close the modal
 * @param divider Divider component to put under the title
 */
type Props = {
  open: boolean;
  close: () => void;
  divider: Element;
}

/**
 * Modal for entering plot information
 * @param Props @see @type Props
 */
export const PlotInformationModal = ({open, close, divider}: Props) => {
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
   * Finally, closes the modal.
   */
  const commitAndClose = () => { 
    if (plotInformation !== plotInformationState)
      actions.setPlotInformation(plotInformation);
    close();
  };

  return (
    <Dialog open={open} onClose={commitAndClose}>
      <Box sx={{ padding: '20px', width: '25vw' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '95%',
          }}
        >
          <Typography variant="h3" fontSize="1em" fontWeight="inherit">
            Plot Information
          </Typography>
          <IconButton onClick={commitAndClose}>
            <CloseIcon />
          </IconButton>
        </div>
        {divider}
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
        <Typography variant="body1">{generatePlotInformationText()}</Typography>
      </Box>
    </Dialog>
  )
}
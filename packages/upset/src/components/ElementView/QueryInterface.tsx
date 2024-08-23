import {
  Button,
  FormControl, InputLabel, MenuItem, Select,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { useRecoilValue } from 'recoil';
import { TextualQueryType } from '@visdesignlab/upset2-core';
import { queryColumnsSelector } from '../../atoms/dataAtom';

/**
 * Component showing a form allowing element queries to be created based on non-numeric fields
 * @returns {EmotionJSX.Element}
 */
export const QueryInterface = () => {
  /**
   * State
   */

  const atts = useRecoilValue(queryColumnsSelector);

  const FIELD_MARGIN = '5px';
  const FIELD_CSS = { marginTop: FIELD_MARGIN, width: '50%' };

  return (
    <Box>
      <FormControl css={FIELD_CSS}>
        <InputLabel id="query-att-select-label">Attribute Name</InputLabel>
        <Select labelId="query-att-select-label">
          {atts.map((att) => (
            <MenuItem key={att} value={att}>{att}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl css={FIELD_CSS}>
        <InputLabel id="query-type-select-label">Query Type</InputLabel>
        <Select labelId="query-type-select-label">
          {Object.values(TextualQueryType).map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box css={{ height: '56px', marginTop: FIELD_MARGIN }}>
        <TextField
          fullWidth
          placeholder="Query"
          css={{
            width: '80%',
            display: 'inline-block',
          }}
        />
        <Button fullWidth css={{ width: '20%', height: '100%' }}>Save</Button>
      </Box>
    </Box>
  );
};

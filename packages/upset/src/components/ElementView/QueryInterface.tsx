import {
  Button,
  FormControl, InputLabel, MenuItem, Select,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { useRecoilValue } from 'recoil';
import { ElementQueryToBookmark, ElementQueryType } from '@visdesignlab/upset2-core';
import { useCallback, useContext, useState } from 'react';
import { queryColumnsSelector } from '../../atoms/dataAtom';
import { currentElementQuery } from '../../atoms/elementsSelectors';
import { ProvenanceContext } from '../Root';
import { UpsetActions } from '../../provenance';

/**
 * Component showing a form allowing element queries to be created based on non-numeric fields
 * @returns {EmotionJSX.Element}
 */
export const QueryInterface = () => {
  /*
   * State
   */

  const atts = useRecoilValue(queryColumnsSelector);
  const currentSelection = useRecoilValue(currentElementQuery);
  const { actions }: { actions: UpsetActions } = useContext(ProvenanceContext);

  const FIELD_MARGIN = '5px';
  const FIELD_CSS = { marginTop: FIELD_MARGIN, width: '50%' };

  const [attField, setAttField] = useState(currentSelection?.att);
  const [typeField, setTypeField] = useState<string | undefined>(currentSelection?.type);
  const [queryField, setQueryField] = useState(currentSelection?.query);

  /*
   * Functions
   */

  /**
   * Save the current query if none is defined, or clear the existing selection
   */
  const saveOrClear = useCallback(() => {
    if (currentSelection) {
      actions.setElementSelection(null);
      setAttField(undefined);
      setTypeField(undefined);
      setQueryField(undefined);
    } else if (attField && typeField && queryField
      && Object.values(ElementQueryType).includes(typeField as ElementQueryType)
      && atts.includes(attField)
    ) {
      actions.setElementSelection(ElementQueryToBookmark({
        att: attField,
        type: typeField as ElementQueryType || ElementQueryType.EQUALS,
        query: queryField,
      }));
    }
  }, [attField, typeField, queryField, atts, actions, currentSelection]);

  return atts.length > 0 ? (
    <Box>
      <FormControl css={FIELD_CSS}>
        <InputLabel id="query-att-select-label">Attribute Name</InputLabel>
        <Select
          disabled={!!currentSelection}
          labelId="query-att-select-label"
          value={attField ?? ''}
          onChange={(e) => setAttField(e.target.value)}
        >
          {atts.map((att) => (
            <MenuItem key={att} value={att}>{att}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl css={FIELD_CSS}>
        <InputLabel id="query-type-select-label">Query Type</InputLabel>
        <Select
          disabled={!!currentSelection}
          labelId="query-type-select-label"
          value={typeField ?? ''}
          onChange={(e) => setTypeField(e.target.value)}
        >
          {Object.values(ElementQueryType).map((type) => (
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
          disabled={!!currentSelection}
          value={queryField ?? ''}
          onChange={(e) => setQueryField(e.target.value)}
        />
        <Button
          fullWidth
          css={{ width: '20%', height: '100%' }}
          onClick={saveOrClear}
          color={currentSelection ? 'error' : 'success'}
        >
          {currentSelection ? 'Clear' : 'Save'}
        </Button>
      </Box>
    </Box>
  ) : null;
};

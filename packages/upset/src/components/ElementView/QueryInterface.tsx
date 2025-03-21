import {
  Button,
  FormControl, InputLabel, MenuItem, Select,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { useRecoilValue } from 'recoil';
import { ElementQueryType, NumericalQueryType } from '@visdesignlab/upset2-core';
import {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { queryColumnsSelector } from '../../atoms/dataAtom';
import { ProvenanceContext } from '../Root';
import { UpsetActions } from '../../provenance';
import { attTypesSelector } from '../../atoms/attributeAtom';
import { activeSelectionSelector, currentQuerySelection } from '../../atoms/config/selectionAtoms';

/**
 * Default type for the element query
 */
const DEFAULT_TYPE = ElementQueryType.EQUALS;

/**
 * Component showing a form allowing element queries to be created based on non-numeric fields
 * @returns {EmotionJSX.Element}
 */
export const QueryInterface = () => {
  /*
   * State
   */

  const atts = useRecoilValue(queryColumnsSelector);
  const currentSelection = useRecoilValue(currentQuerySelection);
  const selectionType = useRecoilValue(activeSelectionSelector);
  const { actions }: { actions: UpsetActions } = useContext(ProvenanceContext);
  const attTypes = useRecoilValue(attTypesSelector);

  const FIELD_MARGIN = '5px';
  const FIELD_CSS = { marginTop: FIELD_MARGIN, width: '50%' };

  const [attField, setAttField] = useState(currentSelection?.att ?? atts.length > 0 ? atts[0] : undefined);
  const [typeField, setTypeField] = useState<string | undefined>(currentSelection?.type ?? DEFAULT_TYPE);
  const [queryField, setQueryField] = useState(currentSelection?.query);

  // Resets input state every time the current selection changes
  useEffect(() => {
    if (currentSelection) {
      setAttField(currentSelection?.att);
      setTypeField(currentSelection?.type);
      setQueryField(currentSelection?.query);
    } else {
      setAttField(atts.length > 0 ? atts[0] : undefined);
      setTypeField(DEFAULT_TYPE);
      setQueryField(undefined);
    }
  }, [currentSelection]);

  /*
   * Functions
   */

  /**
   * Save the current query if none is defined, or clear the existing selection
   */
  const saveOrClear = useCallback(() => {
    if (currentSelection) {
      actions.setQuerySelection(null);
      if (selectionType === 'query') actions.setActiveSelection(null);
      setAttField(undefined);
      setTypeField(undefined);
      setQueryField(undefined);
    } else if (attField && typeField && queryField
      && Object.values(ElementQueryType).includes(typeField as ElementQueryType)
      && atts.includes(attField)
    ) {
      actions.setQuerySelection({
        att: attField,
        type: typeField as ElementQueryType || ElementQueryType.EQUALS,
        query: queryField,
      });
      actions.setActiveSelection('query');
    }
  }, [attField, typeField, queryField, atts, actions, currentSelection, selectionType]);

  return atts.length > 0 ? (
    <Box css={{ marginTop: '10px' }}>
      <FormControl css={FIELD_CSS}>
        <InputLabel id="query-att-select-label">Attribute Name</InputLabel>
        <Select
          disabled={!!currentSelection}
          labelId="query-att-select-label"
          label="Attribute Name"
          value={attField ?? ''}
          onChange={(e) => { setAttField(e.target.value); setTypeField(DEFAULT_TYPE); }}
        >
          {atts.map((att) => (
            <MenuItem key={att} value={att}>{att}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl css={FIELD_CSS}>
        <InputLabel id="query-type-select-label">Query Type</InputLabel>
        <Select
          disabled={!!currentSelection || !attField}
          label="Query Type"
          labelId="query-type-select-label"
          value={typeField ?? ''}
          onChange={(e) => setTypeField(e.target.value)}
        >
          {attField && Object.values(attTypes[attField] === 'number' ? NumericalQueryType : ElementQueryType).map(
            (type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ),
          )}
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
          variant="outlined"
        >
          {currentSelection ? 'Clear' : 'Apply'}
        </Button>
      </Box>
    </Box>
  ) : null;
};

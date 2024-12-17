import { css } from '@emotion/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Slider,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {
  AggregateBy, aggregateByList,
  BaseElement,
} from '@visdesignlab/upset2-core';
import React, {
  CSSProperties,
  FC,
  Fragment, useCallback, useContext, useEffect, useState,
} from 'react';
import { useRecoilValue } from 'recoil';

import {
  firstAggregateSelector,
  firstOvelapDegreeSelector,
  secondAggregateSelector,
  secondOverlapDegreeSelector,
} from '../atoms/config/aggregateAtoms';
import {
  hideEmptySelector, hideNoSetSelector, maxVisibleSelector, minVisibleSelector,
} from '../atoms/config/filterAtoms';
import { visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { ProvenanceContext } from './Root';
import { HelpCircle, defaultMargin } from './custom/HelpCircle';
import { helpText } from '../utils/helpText';
import { dimensionsSelector, footerHeightAtom } from '../atoms/dimensionsAtom';
import { setsAtom } from '../atoms/setsAtoms';
import { UpsetActions } from '../provenance';
import { attributeAtom } from '../atoms/attributeAtom';
import { visibleAttributesSelector } from '../atoms/config/visibleAttributes';

const ITEM_DIV_CSS = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SIDEBAR_HEADER_CSS = css`
  font-size: 0.95rem;
`;

/** Styles for the 3 accordions in the sidebar */
const ACCORDION_CSS: CSSProperties = {
  boxShadow: 'none',
};

/**
 * Finds the added and removed elements between two arrays
 * @param old The old array
 * @param current The new array
 * @returns An object with the added and removed elements
 */
function findChange(old: string[], current: string[]): {added: string[], removed: string[]} {
  const added = current.filter((s) => !old.includes(s));
  const removed = old.filter((s) => !current.includes(s));
  return { added, removed };
}

/**
 * Props for the toggle switch
 */
type ToggleProps = {
  /** A short title for the toggle switch's functionality; displays directly to the user */
  shortLabel: string;
  /** A longer description of the functionality; used for the help circle text */
  longLabel: string;
  /** Whether the toggle switch is currently checked */
  checked: boolean;
  /** The function to call when the toggle changes */
  onChange: (ev: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * A toggle switch for a boolean setting
 */
const ToggleSwitch: FC<ToggleProps> = ({
  shortLabel, longLabel, checked, onChange,
}: ToggleProps) => (
  <Box
    css={ITEM_DIV_CSS}
    aria-label={shortLabel}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        onChange(e);
      }
    }}
  >
    <FormControlLabel
      sx={{ ml: 0, '& span': { fontSize: '0.8rem' } }}
      label={shortLabel}
      control={
        <Switch
          size="small"
          checked={checked}
          onChange={onChange}
        />
      }
      labelPlacement="start"
    />
    <HelpCircle text={longLabel} margin={{ ...defaultMargin, left: 12 }} />
  </Box>
);

/**
 * Settings sidebar; appears to the left of the plot
 * @jsxImportSource @emotion/react
 */
export const SettingsSidebar = () => {
  const { actions }: {actions: UpsetActions} = useContext(
    ProvenanceContext,
  );

  const visibleSets = useRecoilValue(visibleSetSelector);
  const allSets = useRecoilValue(setsAtom);
  const allAtts = useRecoilValue(attributeAtom);
  const visibleAtts = useRecoilValue(visibleAttributesSelector);

  const firstAggregateBy = useRecoilValue(firstAggregateSelector);
  const firstOverlapDegree = useRecoilValue(firstOvelapDegreeSelector);
  const secondAggregateBy = useRecoilValue(secondAggregateSelector);
  const secondOverlapDegree = useRecoilValue(secondOverlapDegreeSelector);

  const maxVisible = useRecoilValue(maxVisibleSelector);
  const minVisible = useRecoilValue(minVisibleSelector);
  const hideEmpty = useRecoilValue(hideEmptySelector);
  const hideNoSet = useRecoilValue(hideNoSetSelector);
  const dimensions = useRecoilValue(dimensionsSelector);
  const footerHeight = useRecoilValue(footerHeightAtom);

  const [secondaryAccordionOpen, setSecondaryAccordionOpen] = useState(
    secondAggregateBy !== 'None',
  );

  const [degreeFilters, setDegreeFilters] = useState([minVisible, maxVisible]);
  // Tracking the previous state of the filters to avoid unnecessary updates
  const [prevFilters, setPrevFilters] = useState([minVisible, maxVisible]);

  useEffect(() => {
    if (firstAggregateBy === 'None') {
      setSecondaryAccordionOpen(false);
    }
  }, [firstAggregateBy]);

  /**
   * Handles a change in the visible sets multiselect by adding or removing the sets that changed
   */
  const handleSetChange = useCallback((event: SelectChangeEvent<string[]>) => {
    const newSets = typeof event.target.value === 'string' ? [event.target.value] : event.target.value;
    const { added, removed } = findChange(visibleSets, newSets);
    added.forEach((s) => actions.addVisibleSet(s));
    removed.forEach((s) => actions.removeVisibleSet(s));
  }, [visibleSets, actions]);

  /**
   * Handles a change in the visible attributes multiselect
   * by adding or removing the attributes that changed
   */
  const handleAttChange = useCallback((event: SelectChangeEvent<string[]>) => {
    const newAtts = typeof event.target.value === 'string' ? [event.target.value] : event.target.value;
    // Ensures that the order is always Degree, Deviation, then the rest;
    // this keeps the plot consistent & prevents graphical bugs
    newAtts.sort((a, b) => {
      if (a === 'Degree') return -1;
      if (b === 'Degree') return 1;
      if (a === 'Deviation') return -1;
      if (b === 'Deviation') return 1;
      return 0;
    });
    // This simply sets the config visibleAtts to all newAtts, so it removes atts as well
    actions.addMultipleAttributes(newAtts);
  }, [visibleAtts, actions]);

  return (
    <Box>
      <Box
        width={dimensions.sidebar.width}
        paddingTop="1em"
        // This matches the accordion's default styles, with 1px added to the right
        boxShadow="rgba(0, 0, 0, 0.2) 1px 2px 1px"
      >
        <Typography
          variant="h2"
          fontSize="1.2em"
          fontWeight="inherit"
          // Half the indentation of the accordion titles
          paddingLeft="8px"
        >
          Settings
        </Typography>
        <Accordion disableGutters style={ACCORDION_CSS}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography css={SIDEBAR_HEADER_CSS} variant="h3">General</Typography>
          </AccordionSummary>
          <FormControl sx={{ width: '100%' }} />
        </Accordion>
        <Accordion disableGutters defaultExpanded style={ACCORDION_CSS}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography css={SIDEBAR_HEADER_CSS} variant="h3">Sets and Attributes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="sets-multiselect-label">Sets</InputLabel>
              <Select
                labelId="sets-multiselect-label"
                id="sets-multiselect"
                multiple
                value={visibleSets}
                input={<OutlinedInput label="Sets" />}
                renderValue={(selected) => selected.map((s) => allSets[s].elementName).join(', ')}
                onChange={handleSetChange}
              >
                {Object.values(allSets).map((set: BaseElement) => (
                  <MenuItem key={set.id} value={set.id}>
                    <Checkbox checked={visibleSets.includes(set.id)} />
                    <ListItemText primary={set.elementName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: '100%', marginTop: '1em' }}>
              <InputLabel
                // Matches style of above label; prevents select border from overlapping text
                style={{ backgroundColor: 'white', paddingRight: '5px' }}
                id="atts-multiselect-label"
              >
                Attributes
              </InputLabel>
              <Select
                labelId="atts-multiselect-label"
                id="atts-multiselect"
                multiple
                value={visibleAtts}
                input={<OutlinedInput label="atts" />}
                renderValue={(selected) => selected.join(', ')}
                onChange={handleAttChange}
              >
                {Object.values(allAtts).map((att: string) => (
                  <MenuItem key={att} value={att}>
                    <Checkbox checked={visibleAtts.includes(att)} />
                    <ListItemText primary={att} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters defaultExpanded style={ACCORDION_CSS}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography css={SIDEBAR_HEADER_CSS} variant="h3">Aggregation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl sx={{ width: '100%' }}>
              <RadioGroup
                value={firstAggregateBy}
                onChange={(ev) => {
                  const newAggBy: AggregateBy = ev.target.value as AggregateBy;
                  actions.firstAggregateBy(newAggBy);
                }}
              >
                {aggregateByList.map((agg) => (
                  <Fragment key={agg}>
                    <Box
                      css={ITEM_DIV_CSS}
                      key={agg}
                      aria-label={agg !== 'None' ? helpText.aggregation[agg] : undefined}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          actions.firstAggregateBy(agg);
                        }
                      }}
                    >
                      <FormControlLabel
                        key={agg}
                        value={agg}
                        label={agg}
                        control={<Radio size="small" />}
                      />
                      {agg !== 'None' && <HelpCircle key={`${agg} 1st`} text={helpText.aggregation[agg]} />}
                    </Box>
                    {agg === 'Overlaps' && firstAggregateBy === agg && (
                    <TextField
                      aria-label="Select the overlap degree (minimum 2)"
                      label="Degree"
                      size="small"
                      type="number"
                      value={firstOverlapDegree}
                      onChange={(ev) => {
                        let val = parseInt(ev.target.value, 10);
                        if (!val) return; // Blocks users from clearing the input
                        if (val < 2) val = 2;
                        if (val > visibleSets.length) val = visibleSets.length;
                        if (val === firstOverlapDegree) return; // Don't dispatch action if overlap hasn't changed
                        actions.firstOverlapBy(val);
                      }}
                    />
                    )}
                  </Fragment>
                ))}
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={secondaryAccordionOpen}
          onChange={() => {
            setSecondaryAccordionOpen(!secondaryAccordionOpen);
          }}
          disableGutters
          disabled={firstAggregateBy === 'None'}
          style={ACCORDION_CSS}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography css={SIDEBAR_HEADER_CSS} variant="h3">Second Aggregation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl sx={{ width: '100%' }}>
              <RadioGroup
                value={secondAggregateBy}
                onChange={(ev) => {
                  const newAggBy: AggregateBy = ev.target.value as AggregateBy;
                  actions.secondAggregateBy(newAggBy);
                }}
              >
                {aggregateByList
                  .filter((agg) => agg !== firstAggregateBy)
                  .map((agg) => (
                    <Fragment key={agg}>
                      <Box
                        css={ITEM_DIV_CSS}
                        key={agg}
                        aria-label={agg !== 'None' ? helpText.aggregation[agg] : 'No aggregation'}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            actions.secondAggregateBy(agg);
                          }
                        }}
                      >
                        <FormControlLabel
                          value={agg}
                          label={agg}
                          control={<Radio size="small" />}
                        />
                        {agg !== 'None' && <HelpCircle key={`${agg} 2nd`} text={helpText.aggregation[agg]} />}
                      </Box>
                      {agg === 'Overlaps' && secondAggregateBy === agg && (
                      <TextField
                        aria-label="Select the overlap degree (minimum 2)"
                        label="Degree"
                        size="small"
                        type="number"
                        value={secondOverlapDegree}
                        onChange={(ev) => {
                          let val = parseInt(ev.target.value, 10);
                          if (!val) return; // Block users from clearing the input
                          if (val < 2) val = 2;
                          if (val > visibleSets.length) val = visibleSets.length;
                          if (val === secondOverlapDegree) return; // Don't dispatch an action if overlap hasn't changed
                          actions.secondOverlapBy(val);
                        }}
                      />
                      )}
                    </Fragment>
                  ))}
              </RadioGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters style={ACCORDION_CSS}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography css={SIDEBAR_HEADER_CSS} variant="h3">Filter Intersections</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup sx={{ mb: 2.5, width: '100%' }}>
              <ToggleSwitch
                shortLabel="Hide Empty Sets"
                longLabel={helpText.filter.HideEmptySets}
                checked={hideEmpty}
                onChange={() => actions.setHideEmpty(!hideEmpty)}
              />
              <ToggleSwitch
                shortLabel="Hide No-Set Intersection"
                longLabel={helpText.filter.HideNoSet}
                checked={hideNoSet}
                onChange={() => actions.setHideNoSet(!hideNoSet)}
              />
            </FormGroup>
            <FormGroup>
              <Box
                css={ITEM_DIV_CSS}
              >
                <FormLabel>
                  <Typography>Filter by Degree</Typography>
                </FormLabel>
                <HelpCircle text={helpText.filter.Degree} />
              </Box>
              <Box
                css={ITEM_DIV_CSS}
                aria-label={helpText.filter.Degree}
              >
                <Slider
                  value={degreeFilters}
                  min={0}
                  max={10}
                  valueLabelDisplay="auto"
                  onChange={(_, newVal: number | number[]) => {
                    if (typeof newVal === 'number') { // if the sliders are set to the same value
                      setDegreeFilters([newVal, newVal]);
                    } else {
                      setDegreeFilters(newVal);
                    }
                  }}
                  onChangeCommitted={() => {
                  // Prevents unncessary Trrack state changes
                    if (prevFilters[0] !== degreeFilters[0]) {
                      actions.setMinVisible(degreeFilters[0]);
                    }
                    if (prevFilters[1] !== degreeFilters[1]) {
                      actions.setMaxVisible(degreeFilters[1]);
                    }
                    setPrevFilters(degreeFilters);
                  }}
                />
              </Box>
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box minHeight={footerHeight} />
    </Box>
  );
};

import { css } from '@emotion/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Slider,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {
  AggregateBy, aggregateByList,
} from '@visdesignlab/upset2-core';
import {
  Fragment, useContext, useEffect, useState,
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
import { dimensionsSelector } from '../atoms/dimensionsAtom';

const itemDivCSS = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const sidebarHeaderCSS = css`
  font-size: 0.95rem;
`;

/** @jsxImportSource @emotion/react */
export const Sidebar = () => {
  const { actions } = useContext(
    ProvenanceContext,
  );

  const visibleSets = useRecoilValue(visibleSetSelector);
  const firstAggregateBy = useRecoilValue(firstAggregateSelector);
  const firstOverlapDegree = useRecoilValue(firstOvelapDegreeSelector);
  const secondAggregateBy = useRecoilValue(secondAggregateSelector);
  const secondOverlapDegree = useRecoilValue(secondOverlapDegreeSelector);
  const maxVisible = useRecoilValue(maxVisibleSelector);
  const minVisible = useRecoilValue(minVisibleSelector);
  const hideEmpty = useRecoilValue(hideEmptySelector);
  const hideNoSet = useRecoilValue(hideNoSetSelector);
  const dimensions = useRecoilValue(dimensionsSelector);

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

  return (
    <div
      css={css`
        width: ${dimensions.sidebar.width}px;
        box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12);
      `}
    >
      <Typography variant="h2" padding="1em" fontSize="1.2em" fontWeight="inherit">
        Settings
      </Typography>
      <Accordion disableGutters di defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography css={sidebarHeaderCSS} variant="h3">Aggregation</Typography>
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
                    css={itemDivCSS}
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
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography css={sidebarHeaderCSS} variant="h3">Second Aggregation</Typography>
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
                      css={itemDivCSS}
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
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography css={sidebarHeaderCSS} variant="h3">Filter Intersections</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup sx={{ mb: 2.5, width: '100%' }}>
            <Box
              css={itemDivCSS}
              aria-label={helpText.filter.HideEmptySets}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  actions.setHideEmpty(!hideEmpty);
                }
              }}
            >
              <FormControlLabel
                sx={{ ml: 0, '& span': { fontSize: '0.8rem' } }}
                label="Hide Empty Intersections"
                control={
                  <Switch
                    size="small"
                    checked={hideEmpty}
                    onChange={(ev) => {
                      actions.setHideEmpty(ev.target.checked);
                    }}
                  />
                }
                labelPlacement="start"
              />
              <HelpCircle text={helpText.filter.HideEmptySets} margin={{ ...defaultMargin, left: 12 }} />
            </Box>
            <Box
              css={itemDivCSS}
              aria-label={helpText.filter.HideNoSet}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  actions.setHideNoSet(!hideNoSet);
                }
              }}
            >
              <FormControlLabel
                sx={{ ml: 0, '& span': { fontSize: '0.8rem' } }}
                label="Hide No-Set Intersection"
                control={
                  <Switch
                    size="small"
                    checked={hideNoSet}
                    onChange={(ev) => {
                      actions.setHideNoSet(ev.target.checked);
                    }}
                  />
                }
                labelPlacement="start"
              />
              <HelpCircle text={helpText.filter.HideNoSet} margin={{ ...defaultMargin, left: 12 }} />
            </Box>
          </FormGroup>
          <FormGroup>
            <Box
              css={itemDivCSS}
            >
              <FormLabel>
                <Typography>Filter by Degree</Typography>
              </FormLabel>
              <HelpCircle text={helpText.filter.Degree} />
            </Box>
            <Box
              css={itemDivCSS}
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
    </div>
  );
};

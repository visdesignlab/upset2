import { css } from '@emotion/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
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
  AggregateBy, aggregateByList, SortBy, sortByList,
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
import { hideEmptySelector, hideNoSetSelector, maxVisibleSelector, minVisibleSelector } from '../atoms/config/filterAtoms';
import { sortBySelector } from '../atoms/config/sortByAtom';
import { visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { ProvenanceContext } from './Root';
import { HelpCircle, defaultMargin } from './custom/HelpCircle';
import { helpText } from '../utils/helpText';
import { dimensionsSelector } from '../atoms/dimensionsAtom';

const itemDivCSS = css`
  display: flex;
  justify-content: space-between;
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

  const sortBy = useRecoilValue(sortBySelector);
  const maxVisible = useRecoilValue(maxVisibleSelector);
  const minVisible = useRecoilValue(minVisibleSelector);
  const hideEmpty = useRecoilValue(hideEmptySelector);
  const hideNoSet = useRecoilValue(hideNoSetSelector);
  const dimensions = useRecoilValue(dimensionsSelector);

  const [secondaryAccordionOpen, setSecondaryAccordionOpen] = useState(
    secondAggregateBy !== 'None',
  );

  const [degreeFilters, setDegreeFilters] = useState([minVisible, maxVisible]);

  useEffect(() => {
    if (firstAggregateBy === 'None') {
      setSecondaryAccordionOpen(false);
    }
  }, [firstAggregateBy]);

  return (
    <div
      css={css`
        width: ${dimensions.sidebar.width}px
      `}
    >
      <Typography variant="h2" fontSize="1.5em" fontWeight="inherit">
        Settings
      </Typography>
      <Accordion disableGutters defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography css={sidebarHeaderCSS} variant="h3">Sorting</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <RadioGroup
              value={sortBy}
              onChange={(ev) => {
                actions.sortBy(ev.target.value as SortBy);
              }}
            >
              {sortByList.map((sort) => (sort === 'Deviation' ?
                (
                  <Alert severity="info" variant="outlined" key={sort} sx={{ alignItems: 'center', padding: '0.1em 0.4em', marginTop: '0.5em' }}><Typography>Use column headers for custom sorting</Typography></Alert>
                ) :
                (
                  <div css={itemDivCSS} key={sort}>
                    <FormControlLabel
                      key={sort}
                      value={sort}
                      label={sort}
                      control={<Radio size="small" />}
                    />
                    <HelpCircle text={helpText.sorting[sort]} />
                  </div>
                )))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters>
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
                  <div css={itemDivCSS}>
                    <FormControlLabel
                      key={agg}
                      value={agg}
                      label={agg}
                      control={<Radio size="small" />}
                    />
                    {agg !== 'None' && <HelpCircle text={helpText.aggregation[agg]} />}
                  </div>
                  {agg === 'Overlaps' && firstAggregateBy === agg && (
                    <TextField
                      label="Degree"
                      size="small"
                      type="number"
                      value={firstOverlapDegree}
                      onChange={(ev) => {
                        let val = parseInt(ev.target.value, 10);
                        if (val < 2) val = 2;
                        if (val > visibleSets.length) val = visibleSets.length;
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
                    <div css={itemDivCSS}>
                      <FormControlLabel
                        value={agg}
                        label={agg}
                        control={<Radio size="small" />}
                      />
                      {agg !== 'None' && <HelpCircle text={helpText.aggregation[agg]} />}
                    </div>
                    {agg === 'Overlaps' && secondAggregateBy === agg && (
                      <TextField
                        label="Degree"
                        size="small"
                        type="number"
                        value={secondOverlapDegree}
                        onChange={(ev) => {
                          let val = parseInt(ev.target.value, 10);
                          if (val < 2) val = 2;
                          if (val > visibleSets.length) val = visibleSets.length;
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
            <div css={itemDivCSS}>
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
            </div>
            <div css={itemDivCSS}>
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
            </div>
          </FormGroup>
          <FormGroup>
            <div css={itemDivCSS}>
              <FormLabel>
                <Typography>Filter by Degree</Typography>
              </FormLabel>
              <HelpCircle text={helpText.filter.Degree} />
            </div>
            <div css={itemDivCSS}>
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
                  actions.setMinVisible(degreeFilters[0]);
                  actions.setMaxVisible(degreeFilters[1]);
                }}
              />
            </div>
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

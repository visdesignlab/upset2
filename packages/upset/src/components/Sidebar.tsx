/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { Fragment, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  AggregateBy,
  aggregateByList,
  SortBy,
  sortByList,
} from '@visdesignlab/upset2-core';
import { useRecoilState } from 'recoil';
import {
  firstAggregateByAtom,
  firstOverlapDegreeAtom,
  hideEmptyAtom,
  maxVisibleAtom,
  minVisibleAtom,
  secondAggregateByAtom,
  secondOverlapDegreeAtom,
  sortByAtom,
} from '../atoms/upsetConfigAtoms';

export const Sidebar = () => {
  const [firstAggregateBy, setFirstaggregateBy] =
    useRecoilState(firstAggregateByAtom);

  const [firstOverlapDegree, setFirstOverlapDegree] = useRecoilState(
    firstOverlapDegreeAtom,
  );

  const [secondAggregateBy, setSecondAggregateBy] = useRecoilState(
    secondAggregateByAtom,
  );

  const [secondOverlapDegree, setSecondOverlapDegree] = useRecoilState(
    secondOverlapDegreeAtom,
  );

  const [sortBy, setSortBy] = useRecoilState(sortByAtom);
  const [maxVisible, setMaxVisible] = useRecoilState(maxVisibleAtom);
  const [minVisible, setMinVisible] = useRecoilState(minVisibleAtom);
  const [hideEmpty, setHideEmpty] = useRecoilState(hideEmptyAtom);

  const [secondaryAccordionOpen, setSecondaryAccordionOpen] = useState(
    secondAggregateBy !== 'None',
  );

  useEffect(() => {
    if (firstAggregateBy === 'None') {
      setSecondaryAccordionOpen(false);
    }
  }, [firstAggregateBy]);

  return (
    <div
      css={css`
        width: 250px;
      `}
    >
      <Accordion disableGutters defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Aggregation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <RadioGroup
              value={firstAggregateBy}
              onChange={(ev) => {
                const newAggBy: AggregateBy = ev.target.value as AggregateBy;
                setFirstaggregateBy(newAggBy);
                if (newAggBy === 'None' || newAggBy === secondAggregateBy) {
                  setSecondAggregateBy('None');
                }
              }}
            >
              {aggregateByList.map((agg) => (
                <Fragment key={agg}>
                  <FormControlLabel
                    key={agg}
                    value={agg}
                    label={agg}
                    control={<Radio size="small" />}
                  />
                  {agg === 'Overlaps' && firstAggregateBy === agg && (
                    <TextField
                      label="Degree"
                      size="small"
                      type="number"
                      value={firstOverlapDegree}
                      onChange={(ev) => {
                        let val = parseInt(ev.target.value, 10);
                        if (val < 0) val = 0;
                        setFirstOverlapDegree(val);
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
          <Typography>Second Aggregation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <RadioGroup
              value={secondAggregateBy}
              onChange={(ev) => {
                setSecondAggregateBy(ev.target.value as AggregateBy);
              }}
            >
              {aggregateByList
                .filter((agg) => agg !== firstAggregateBy)
                .map((agg) => (
                  <Fragment key={agg}>
                    <FormControlLabel
                      value={agg}
                      label={agg}
                      control={<Radio size="small" />}
                    />
                    {agg === 'Overlaps' && secondAggregateBy === agg && (
                      <TextField
                        label="Degree"
                        size="small"
                        type="number"
                        value={secondOverlapDegree}
                        onChange={(ev) => {
                          let val = parseInt(ev.target.value, 10);
                          if (val < 0) val = 0;
                          setSecondOverlapDegree(val);
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
          <Typography>Sorting</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <RadioGroup
              value={sortBy}
              onChange={(ev) => {
                setSortBy(ev.target.value as SortBy);
              }}
            >
              {sortByList.map((sort) => (
                <FormControlLabel
                  key={sort}
                  value={sort}
                  label={sort}
                  control={<Radio size="small" />}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Filter Intersections</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            size="small"
            sx={{ m: 1, display: 'block' }}
            label="More Than"
            type="number"
            value={minVisible}
            onChange={(ev) => {
              let val = parseInt(ev.target.value, 10);
              if (val < 0) val = 0;
              setMinVisible(val);
            }}
          />
          <TextField
            size="small"
            sx={{ m: 1, display: 'block' }}
            label="Less Than"
            type="number"
            value={maxVisible}
            onChange={(ev) => {
              let val = parseInt(ev.target.value, 10);
              if (val < 0) val = 0;
              setMaxVisible(val);
            }}
          />
          <FormGroup>
            <FormControlLabel
              componentsProps={{
                typography: {
                  fontSize: '0.8em',
                },
              }}
              label="Hide Empty Intersections"
              control={
                <Switch
                  size="small"
                  checked={hideEmpty}
                  onChange={(ev) => {
                    setHideEmpty(ev.target.checked);
                  }}
                />
              }
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

import { css } from '@emotion/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { AggregateBy, aggregateByList, SortBy, sortByList } from '@visdesignlab/upset2-core';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import {
  firstAggregateSelector,
  firstOvelapDegreeSelector,
  secondAggregateSelector,
  secondOverlapDegreeSelector,
} from '../atoms/config/aggregateAtoms';
import { hideEmptySelector, maxVisibleSelector, minVisibleSelector } from '../atoms/config/filterAtoms';
import { sortBySelector } from '../atoms/config/sortByAtom';
import { visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { ProvenanceContext } from './Root';
import { exportStateGrammar, ImportModal } from './ImportModal';

/** @jsxImportSource @emotion/react */
export const Sidebar = () => {
  const { actions, provenance, isAtLatest, isAtRoot } = useContext(
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

  const [secondaryAccordionOpen, setSecondaryAccordionOpen] = useState(
    secondAggregateBy !== 'None',
  );

  const [ showImportModal, setShowImportModal ] = useState(false);

  useEffect(() => {
    if (firstAggregateBy === 'None') {
      setSecondaryAccordionOpen(false);
    }
  }, [firstAggregateBy]);

  const handleImportModalClose = () => {
    setShowImportModal(false);
  }

  return (
    <div
      css={css`
        width: 250px;
      `}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ButtonGroup>
          <IconButton disabled={isAtRoot} onClick={() => provenance.undo()}>
            <UndoIcon />
          </IconButton>
          <IconButton disabled={isAtLatest} onClick={() => provenance.redo()}>
            <RedoIcon />
          </IconButton>
        </ButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <ButtonGroup>
          <Button onClick={() => setShowImportModal(true) }>
            Import
          </Button>
          <Button onClick={() => exportStateGrammar(provenance)}>
            Export
          </Button>
        </ButtonGroup>
        
        <ImportModal open={showImportModal} close={handleImportModalClose} />
      </Box>
      <Accordion disableGutters defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Aggregation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <RadioGroup
              value={firstAggregateBy}
              onChange={ev => {
                const newAggBy: AggregateBy = ev.target.value as AggregateBy;
                actions.firstAggregateBy(newAggBy);
              }}
            >
              {aggregateByList.map(agg => (
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
                      onChange={ev => {
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
          <Typography>Second Aggregation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <RadioGroup
              value={secondAggregateBy}
              onChange={ev => {
                const newAggBy: AggregateBy = ev.target.value as AggregateBy;
                actions.secondAggregateBy(newAggBy);
              }}
            >
              {aggregateByList
                .filter(agg => agg !== firstAggregateBy)
                .map(agg => (
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
                        onChange={ev => {
                          let val = parseInt(ev.target.value, 10);
                          if (val < 2) val = 2;
                          if (val > visibleSets.length)
                            val = visibleSets.length;
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
          <Typography>Sorting</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <RadioGroup
              value={sortBy}
              onChange={ev => {
                actions.sortBy(ev.target.value as SortBy);
              }}
            >
              {sortByList.map(sort => (
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
            onChange={ev => {
              let val = parseInt(ev.target.value, 10);
              if (Number.isNaN(val) || val < 0) {
                val = 0;
              }

              // removes leading 0's in text
              ev.target.value = `${val}`;

              actions.setMinVisible(val);
            }}
          />
          <TextField
            size="small"
            sx={{ m: 1, display: 'block' }}
            label="Less Than"
            type="number"
            value={maxVisible}
            onChange={ev => {
              let val = parseInt(ev.target.value, 10);
              if (Number.isNaN(val) || val < 0) {
                val = 0;
              }

              // removes leading 0's in text
              ev.target.value = `${val}`;
              
              actions.setMaxVisible(val);
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
                  onChange={ev => {
                    actions.setHideEmpty(ev.target.checked);
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

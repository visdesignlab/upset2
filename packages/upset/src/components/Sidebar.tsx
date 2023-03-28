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
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { AggregateBy, aggregateByList, CoreUpsetData, SortBy, sortByList } from '@visdesignlab/upset2-core';
import { FC, Fragment, useContext, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

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
import { HelpCircle, defaultMargin } from './custom/HelpCircle';
import { helpText } from '../utils/helpText'; 

const itemDivCSS = css`
  display: flex;
  justify-content: space-between;
`;

/** @jsxImportSource @emotion/react */
export const Sidebar: FC<Props> = ({ data }) => {
  const { actions, provenance, isAtLatest, isAtRoot } = useContext(
    ProvenanceContext,
  );

  const visibleSets = useRecoilValue(visibleSetSelector);
  const firstAggregateBy = useRecoilValue(firstAggregateSelector);
  const firstOverlapDegree = useRecoilValue(firstOvelapDegreeSelector);
  const secondAggregateBy = useRecoilValue(secondAggregateSelector);
  const secondOverlapDegree = useRecoilValue(secondOverlapDegreeSelector);
  const rows = useRecoilValue(rowsSelector);

  const sortBy = useRecoilValue(sortBySelector);
  const maxVisible = useRecoilValue(maxVisibleSelector);
  const minVisible = useRecoilValue(minVisibleSelector);
  const hideEmpty = useRecoilValue(hideEmptySelector);

  const setHideElementSidebar = useSetRecoilState(elementSidebarAtom);
  const [ provenanceVis, setProvenanceVis ] = useRecoilState(provenanceVisAtom);
  const setContextMenu = useSetRecoilState(contextMenuAtom);

  const [ secondaryAccordionOpen, setSecondaryAccordionOpen ] = useState(
    secondAggregateBy !== 'None',
  );

  useEffect(() => {
    if (firstAggregateBy === 'None') {
      setSecondaryAccordionOpen(false);
    }
  }, [firstAggregateBy]);

  const handleImportModalClose = () => {
    setShowImportModal(false);
  }

  const openExportContextMenu = (e: React.MouseEvent) => {
    setContextMenu(
      {
        mouseX: e.clientX,
        mouseY: e.clientY,
        id: `export-menu`,
        items: [
          {
            label: `Export State`,
            onClick: () => {
              exportState(provenance);
            }
          },
          {
            label: `Export State + Data`,
            onClick: () => {
              exportState(provenance, data, rows);
            }
          },
        ]
      }
    );
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
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '5px', }}>
        <ButtonGroup>
          <Button onClick={() => setShowImportModal(true) }>
            Import
          </Button>
          <Button onClick={(e) => {
            openExportContextMenu(e);
          }
          }>
            Export
          </Button>
        </ButtonGroup>
        
        <ImportModal open={showImportModal} close={handleImportModalClose} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', margin: '5px 0' }}>
        <Button variant="outlined" onClick={() => {
          if (provenanceVis === false) { 
            setProvenanceVis(true); 
            setHideElementSidebar(true); 
          };
        }}>
          Provenance Vis
        </Button>
      </Box>
      <Accordion disableGutters defaultExpanded>
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
              {sortByList.map(sort => {
                return ( sort === "Deviation" ?
                (
                  <Alert severity="info" variant="outlined" key={sort} sx={{ alignItems: 'center', padding: "0.1em 0.4em", marginTop: "0.5em"}}>Use column headers for custom sorting</Alert>
                ):
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
                ))})}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Aggregation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl sx={{width: "100%"}}>
            <RadioGroup
              value={firstAggregateBy}
              onChange={ev => {
                const newAggBy: AggregateBy = ev.target.value as AggregateBy;
                actions.firstAggregateBy(newAggBy);
              }}
            >
              {aggregateByList.map(agg => (
                <Fragment key={agg}>
                  <div css={itemDivCSS}>
                    <FormControlLabel
                      key={agg}
                      value={agg}
                      label={agg}
                      control={<Radio size="small" />}
                    />
                    {agg !== "None" && <HelpCircle text={helpText.aggregation[agg]} />}
                  </div>
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
          <FormControl sx={{width: "100%"}}>
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
                    <div css={itemDivCSS}>
                      <FormControlLabel
                        value={agg}
                        label={agg}
                        control={<Radio size="small" />}
                      />
                      {agg !== "None" && <HelpCircle text={helpText.aggregation[agg]} />}
                    </div>
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
          <Typography>Filter Intersections</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup sx={{ mb: 2.5, width: '100%' }}>
            <div css={itemDivCSS}>
              <FormControlLabel
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
                labelPlacement="start"
              />
              <HelpCircle text={helpText.filter.HideEmptySets} margin={{...defaultMargin, left: 12}}/>
            </div>
          </FormGroup>
          <div css={itemDivCSS}>
            <TextField
              size="small"
              sx={{ m: 1, display: 'block' }}
              label="Min Degree"
              type="number"
              value={minVisible}
              onChange={ev => {
                let val = parseInt(ev.target.value, 10);
                if (Number.isNaN(val) || val < 0) {
                  val = 0;
                }

                // removes leading 0's in user input text
                ev.target.value = `${val}`;

                // change the max value to match the min if the min is increased to above the max 
                if (maxVisible <= val - 1) {
                  actions.setMaxVisible(val);
                }
                actions.setMinVisible(val);
              }}
            />
            <HelpCircle text={helpText.filter.MinDegree} />
          </div>
          <div css={itemDivCSS}>
            <TextField
              size="small"
              sx={{ m: 1, display: 'block' }}
              label="Max Degree"
              type="number"
              value={maxVisible}
              onChange={ev => {
                let val = parseInt(ev.target.value, 10);
                if (Number.isNaN(val) || val < 1) {
                  val = 1;
                }

                // removes leading 0's in user input text
                ev.target.value = `${val}`;
                
                // change the min value to match the max if the max is reduced to below the min
                if (minVisible >= val + 1) {
                  actions.setMinVisible(val);
                }

                actions.setMaxVisible(val);
              }}
            />
            <HelpCircle text={helpText.filter.MaxDegree} />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

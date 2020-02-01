import React, { FC, useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { UpsetStore } from '../../Store/UpsetStore';
import { Accordion, Icon, Form, Radio, Checkbox, Input, Label } from 'semantic-ui-react';
import { AggregationOptionsList } from '../../Interfaces/AggregationOptions';
import { SortingOptionsList } from '../../Interfaces/SortOptions';
import { actions } from '../../Upset';

interface Props {
  store?: UpsetStore;
}

const Controls: FC<Props> = ({ store }: Props) => {
  const {
    firstAggregation,
    secondAggregation,
    sortBy,
    hideEmpty,
    minDegree,
    maxDegree,
    sortBySetName,
    firstOverlap,
    secondOverlap
  } = store!;

  const [minVal, setMinVal] = useState(minDegree);
  const [maxVal, setMaxVal] = useState(maxDegree);
  const [foverlap, setFoverlap] = useState(firstOverlap);
  const [soverlap, setSoverlap] = useState(secondOverlap);

  useEffect(() => {
    setMinVal(minDegree);
    setMaxVal(maxDegree);
    setFoverlap(firstOverlap);
    setSoverlap(secondOverlap);
  }, [minDegree, maxDegree, firstOverlap, secondOverlap]);

  const [menuStatus, setMenuStatus] = useState<{ [key: number]: boolean }>({
    0: true,
    1: true,
    2: true,
    3: true
  });

  const handleClick = (_: any, titleProps: any) => {
    const index: number = titleProps.index;
    const currentStatus = menuStatus[index];
    setMenuStatus({ ...menuStatus, [index]: !currentStatus });
  };

  return (
    <Accordion styled fluid>
      <>
        <Accordion.Title active={menuStatus[0]} index={0} onClick={handleClick}>
          <Icon name="dropdown"></Icon>
          Aggregation
        </Accordion.Title>
        <Accordion.Content active={menuStatus[0]} index={0}>
          <Form>
            {AggregationOptionsList.map(agg => (
              <Form.Field key={agg} inline>
                <Radio
                  name="firstAggregation"
                  label={agg}
                  checked={agg === firstAggregation}
                  disabled={agg !== 'None' && agg === secondAggregation}
                  onChange={() => actions.setFirstAggregation(agg)}
                ></Radio>
                {agg === 'Overlaps' && (
                  <Input
                    type="text"
                    pattern="[0-9]"
                    labelPosition="left"
                    value={foverlap}
                    onChange={(event: any) => {
                      const value = parseInt(event.target.value, 10) || 0;
                      setFoverlap(value);
                    }}
                    onBlur={() => {
                      actions.setFirstOverlap(foverlap);
                    }}
                    disabled={firstAggregation !== 'Overlaps'}
                  ></Input>
                )}
              </Form.Field>
            ))}
          </Form>
        </Accordion.Content>
      </>
      {firstAggregation !== 'None' && (
        <>
          <Accordion.Title active={menuStatus[1]} index={1} onClick={handleClick}>
            <Icon name="dropdown"></Icon>
            Second Level Aggregation
          </Accordion.Title>
          <Accordion.Content active={menuStatus[1]} index={1}>
            <Form>
              {AggregationOptionsList.map(agg => (
                <Form.Field key={agg} inline>
                  <Radio
                    name="secondAggregation"
                    label={agg}
                    checked={agg === secondAggregation}
                    disabled={agg !== 'None' && agg === firstAggregation}
                    onChange={() => actions.setSecondAggregation(agg)}
                  ></Radio>
                  {agg === 'Overlaps' && (
                    <Input
                      type="text"
                      pattern="[0-9]"
                      labelPosition="left"
                      value={soverlap}
                      onChange={(event: any) => {
                        const value = parseInt(event.target.value, 10) || 0;
                        setSoverlap(value);
                      }}
                      onBlur={() => {
                        actions.setSecondOverlap(soverlap);
                      }}
                      disabled={secondAggregation !== 'Overlaps'}
                    ></Input>
                  )}
                </Form.Field>
              ))}
            </Form>
          </Accordion.Content>
        </>
      )}
      <>
        <Accordion.Title active={menuStatus[2]} index={2} onClick={handleClick}>
          <Icon name="dropdown"></Icon>
          Sorting
        </Accordion.Title>
        <Accordion.Content active={menuStatus[2]} index={2}>
          <Form>
            {SortingOptionsList.map(sort => (
              <Form.Field key={sort}>
                <Radio
                  name="sortBy"
                  label={
                    sort !== 'Set'
                      ? sort
                      : sortBySetName === ''
                      ? `${sort}`
                      : `${sort} (${sortBySetName})`
                  }
                  disabled={sort === 'Set'}
                  checked={sort === sortBy}
                  onChange={() => actions.setSortBy(sort)}
                ></Radio>
              </Form.Field>
            ))}
          </Form>
        </Accordion.Content>
      </>
      <>
        <Accordion.Title active={menuStatus[3]} index={3} onClick={handleClick}>
          <Icon name="dropdown"></Icon>
          Filter Intersections
        </Accordion.Title>
        <Accordion.Content active={menuStatus[3]} index={3}>
          <Form>
            <Form.Field>
              <Checkbox
                toggle
                label="Hide empty intersections"
                checked={hideEmpty}
                onClick={() => {
                  if (hideEmpty) actions.setHideEmpty(false);
                  else actions.setHideEmpty(true);
                }}
              ></Checkbox>
            </Form.Field>
            <Form.Field>
              <Input
                type="text"
                pattern="[0-9]"
                labelPosition="left"
                fluid
                value={minVal}
                onChange={(event: any) => {
                  const value = parseInt(event.target.value, 10) || 0;
                  setMinVal(value);
                }}
                onBlur={() => {
                  actions.setMinDegree(minVal);
                }}
              >
                <Label>Min Degree</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field>
              <Input
                type="text"
                pattern="[0-9]"
                labelPosition="left"
                fluid
                value={maxVal}
                onChange={(event: any) => {
                  const value = parseInt(event.target.value, 10) || 0;
                  setMaxVal(value);
                }}
                onBlur={() => {
                  actions.setMaxDegree(maxVal);
                }}
              >
                <Label>Max Degree</Label>
                <input />
              </Input>
            </Form.Field>
          </Form>
        </Accordion.Content>
      </>
    </Accordion>
  );
};

export default inject('store')(observer(Controls));

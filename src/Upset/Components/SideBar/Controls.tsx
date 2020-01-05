import React, { FC, useState, useContext, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { UpsetStore } from '../../Store/UpsetStore';
import { Accordion, Icon, Menu, Form, Radio, Checkbox, Input, Label } from 'semantic-ui-react';
import { AggregationOptionsList } from '../../Interfaces/AggregationOptions';
import { ProvenanceContext } from '../../Upset';
import { SortingOptionsList } from '../../Interfaces/SortOptions';

interface Props {
  store?: UpsetStore;
}

const Controls: FC<Props> = ({ store }: Props) => {
  const { firstAggregation, secondAggregation, sortBy, hideEmpty, minDegree, maxDegree } = store!;

  const { actions } = useContext(ProvenanceContext);

  const [minVal, setMinVal] = useState(minDegree);
  const [maxVal, setMaxVal] = useState(maxDegree);

  useEffect(() => {
    if (minDegree !== minVal) setMinVal(minDegree);
    if (maxDegree !== maxVal) setMaxVal(maxDegree);
  }, [minDegree, maxDegree]);

  const [menuStatus, setMenuStatus] = useState<{ [key: number]: boolean }>({
    0: true,
    1: false,
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
              <Form.Field key={agg}>
                <Radio
                  name="firstAggregation"
                  label={agg}
                  checked={agg === firstAggregation}
                  onChange={() => actions.setFirstAggregation(agg)}
                ></Radio>
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
                <Form.Field key={agg}>
                  <Radio
                    name="secondAggregation"
                    label={agg}
                    checked={agg === secondAggregation}
                    onChange={() => actions.setSecondAggregation(agg)}
                  ></Radio>
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
                  label={sort}
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
                  const value = parseInt(event.target.value, 10);
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
                  const value = parseInt(event.target.value, 10);
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

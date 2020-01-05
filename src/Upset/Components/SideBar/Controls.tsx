import React, { FC, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { UpsetStore } from '../../Store/UpsetStore';
import { Accordion, Icon, Menu } from 'semantic-ui-react';

interface Props {
  store?: UpsetStore;
}

const Controls: FC<Props> = ({}: Props) => {
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
      {/*  */}
      <Accordion.Title active={menuStatus[0]} index={0} onClick={handleClick}>
        <Icon name="dropdown"></Icon>
        Aggregation
      </Accordion.Title>
      <Accordion.Content active={menuStatus[0]} index={0}>
        <Menu vertical fluid></Menu>
      </Accordion.Content>
      {/*  */}
      <Accordion.Title active={menuStatus[1]} index={1} onClick={handleClick}>
        <Icon name="dropdown"></Icon>
        Second Level Aggregation
      </Accordion.Title>
      <Accordion.Content active={menuStatus[1]} index={1}>
        <Menu vertical fluid></Menu>
      </Accordion.Content>
      {/*  */}
      <Accordion.Title active={menuStatus[2]} index={2} onClick={handleClick}>
        <Icon name="dropdown"></Icon>
        Sorting
      </Accordion.Title>
      <Accordion.Content active={menuStatus[2]} index={2}>
        <Menu vertical fluid></Menu>
      </Accordion.Content>
      {/*  */}
      <Accordion.Title active={menuStatus[3]} index={3} onClick={handleClick}>
        <Icon name="dropdown"></Icon>
        Filter Intersections
      </Accordion.Title>
      <Accordion.Content active={menuStatus[3]} index={3}>
        <Menu vertical fluid></Menu>
      </Accordion.Content>
    </Accordion>
  );
};

export default inject('store')(observer(Controls));

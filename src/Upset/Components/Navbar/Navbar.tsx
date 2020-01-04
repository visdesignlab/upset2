import React, { FC, useContext } from 'react';
import { Menu, Header, Button, Dropdown, Label } from 'semantic-ui-react';
import { ProvenanceContext } from '../../Upset';

const options: any[] = [
  {
    key: 'test1',
    text: 'test1',
    value: 'test1'
  },
  {
    key: 'test2',
    text: 'test2',
    value: 'test2'
  },
  {
    key: 'test3',
    text: 'test3',
    value: 'test3'
  },
  {
    key: 'test4',
    text: 'test4',
    value: 'test4'
  }
];

const Navbar: FC = () => {
  return (
    <Menu borderless>
      <Menu.Item>
        <Header>UpSet - Visualizing Intersecting Sets</Header>
      </Menu.Item>
      <Menu.Item>
        <Button.Group>
          <Button icon="undo" content="Undo"></Button>
          <Button.Or></Button.Or>
          <Button icon="redo" content="Redo"></Button>
        </Button.Group>
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>
          <Header>Choose Dataset</Header>
        </Menu.Item>
        <Menu.Item>
          <Dropdown selection defaultValue={'test1'} options={options}></Dropdown>
        </Menu.Item>
        <Menu.Item>
          <Button>Load Data</Button>
        </Menu.Item>
        <Menu.Item>
          <Button>Embed</Button>
        </Menu.Item>
        <Menu.Item>
          <Label as="a">About UpSet</Label>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default Navbar;

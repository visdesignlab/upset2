import React, { FC, useContext, useEffect } from 'react';
import { Menu, Header, Button, Dropdown, Label } from 'semantic-ui-react';
import { ProvenanceContext, DatasetOptions } from '../../Upset';
import { inject, observer } from 'mobx-react';
import { UpsetStore } from '../../Store/UpsetStore';
import { DatasetInfo } from '../../Interfaces/DatasetInfo';

interface Props {
  store?: UpsetStore;
  datasets: DatasetOptions;
  loadDatasets: (dataset: DatasetInfo | undefined) => void;
}

const Navbar: FC<Props> = ({ store, datasets, loadDatasets }: Props) => {
  const { isAtRoot, isAtLatest, selectedDataset } = store!;
  const { actions } = useContext(ProvenanceContext);

  useEffect(() => {
    if (!selectedDataset && datasets.length > 0) {
      loadDatasets(datasets.find(d => d.text.includes('Movies'))?.info);
    }
  });

  const selectedDatasetValue = selectedDataset ? selectedDataset.file : '';

  return (
    <Menu borderless>
      <Menu.Item>
        <Header>UpSet - Visualizing Intersecting Sets</Header>
      </Menu.Item>
      <Menu.Item>
        <Button.Group>
          <Button icon="undo" content="Undo" disabled={isAtRoot} onClick={actions.goBack}></Button>
          <Button.Or></Button.Or>
          <Button
            icon="redo"
            content="Redo"
            disabled={isAtLatest}
            onClick={actions.goForward}
          ></Button>
        </Button.Group>
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>
          <Header>Choose Dataset</Header>
        </Menu.Item>
        <Menu.Item>
          <Dropdown
            scrolling
            fluid
            selection
            value={selectedDatasetValue}
            options={datasets}
            onChange={(_, data) => {
              const selectedDataset = datasets.find(d => d.value === data.value);
              if (selectedDataset) {
                loadDatasets(selectedDataset.info);
              }
            }}
          ></Dropdown>
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

export default inject('store')(observer(Navbar));

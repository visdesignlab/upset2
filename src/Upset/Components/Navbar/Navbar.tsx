import React, { FC, useContext, useState, useEffect } from 'react';
import { Menu, Header, Button, Dropdown, Label } from 'semantic-ui-react';
import { ProvenanceContext, DatasetOptions, fileServer, getSetCount } from '../../Upset';
import { inject, observer } from 'mobx-react';
import { UpsetStore } from '../../Store/UpsetStore';
import axios from 'axios';
import { DatasetInfo } from '../../Interfaces/DatasetInfo';

interface Props {
  store?: UpsetStore;
}

const Navbar: FC<Props> = ({ store }: Props) => {
  const { isAtRoot, isAtLatest, selectedDataset } = store!;
  const [datasets, setDatasets] = useState<DatasetOptions>([]);
  const { actions } = useContext(ProvenanceContext);

  useEffect(() => {
    axios
      .get(`${fileServer}/datasets`)
      .then(({ data: { datasets } }) => {
        const ds: DatasetOptions = datasets.map((d: DatasetInfo) => ({
          info: d,
          key: d.file,
          text: `${d.name} (${getSetCount(d.sets)} Ssets & ${
            d.meta.filter(m => m.type !== 'id').length
          } Attributes)`,
          value: d.file
        }));
        setDatasets(ds);
      })
      .catch(err => {
        console.error(err);
        throw new Error(err);
      });
  }, []);

  useEffect(() => {
    if (!selectedDataset && datasets.length > 0) {
      actions.setDataset(datasets[0].info);
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
                actions.setDataset(selectedDataset.info);
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

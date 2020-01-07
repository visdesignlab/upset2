import React, { FC } from 'react';
import { inject, observer } from 'mobx-react';
import { UpsetStore } from '../../Store/UpsetStore';
import { Card, Header } from 'semantic-ui-react';

interface Props {
  store?: UpsetStore;
}

const Details: FC<Props> = ({ store }: Props) => {
  const { selectedDataset } = store!;

  const { name = '', author = '', description = '', meta = [], sets = [], source = '' } =
    selectedDataset || {};

  return (
    <Card color="blue" fluid>
      <Card.Content>
        <Header as="h1">Dataset Information</Header>
      </Card.Content>
      <Card.Content>
        <Card.Header as="h1">{name}</Card.Header>
        <Card.Meta>{author}</Card.Meta>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      {source.length > 0 && (
        <Card.Content>
          <a href={source}>{source}</a>
        </Card.Content>
      )}
      <Card.Content extra>
        <div># Sets: {sets.length}</div>
        <div># Attributes: {meta.filter(m => m.type !== 'id').length}</div>
      </Card.Content>
    </Card>
  );
};

export default inject('store')(observer(Details));

import React, { FC } from 'react';
import { inject, observer } from 'mobx-react';
import { UpsetStore } from '../../Store/UpsetStore';
import Controls from './Controls';
import Details from './Details';

interface Props {
  store?: UpsetStore;
}

const Sidebar: FC<Props> = ({}: Props) => {
  return (
    <>
      <Controls></Controls>
      <Details></Details>
    </>
  );
};

export default inject('store')(observer(Sidebar));

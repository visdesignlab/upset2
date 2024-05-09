/* eslint-disable react/destructuring-assignment */
import { CoreUpsetData } from '@visdesignlab/upset2-core';
import React, { useEffect, useState } from 'react';

import simpsonsData from './data/simpsons/data.json';
import simpsonsAnnotations from './data/simpsons/annotations.json';

import { Upset, process } from '../src';

const meta = {
  title: 'Upset',
  component: Upset,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: 'true' },
  },
};

export default meta;

const Template = (args) => {
  const [data, setData] = useState<CoreUpsetData | null>(null);

  useEffect(() => {
    const d = process(
      simpsonsData as any,
      simpsonsAnnotations as any,
    );

    setData(d);
  }, []);

  return data ? (
    <Upset data={data} visualizeDatasetAttributes={[]} hideSettings />
  ) : (
    <div>
      Loading
      {args.dataset}
      {' '}
      dataset
    </div>
  );
};

// By passing using the Args format for exported stories,
// you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Movies = Template.bind({});

Movies.args = {
  dataset: 'Movies',
};

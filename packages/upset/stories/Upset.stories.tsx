/* eslint-disable react/destructuring-assignment */
import React from 'react';

import moviesData from './data/movies/data.json';

import { Upset } from '../src';

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

const Template = (args) => (moviesData ? (
  <div style={{ height: 300 }}>
    <Upset data={moviesData} hideSettings allowAttributeRemoval visualizeDatasetAttributes={['AvgRating']} visualizeUpsetAttributes={false} />
  </div>
) : (
  <div>
    Loading
    {' '}
    {args.dataset}
    {' '}
    dataset
  </div>
));

// By passing using the Args format for exported stories,
// you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Movies = Template.bind({});

Movies.args = {
  dataset: 'Movies',
};

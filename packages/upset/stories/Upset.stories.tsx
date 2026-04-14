/* eslint-disable react/destructuring-assignment */
import React from 'react';

import moviesData from './data/movies/data.json' with { type: 'json' };

import { Upset } from '../src';

const dateData = [
  {
    id: 'date/1',
    Name: 'Alpha',
    'Group A': true,
    'Group B': false,
    ReleaseDate: new Date(Date.UTC(1999, 0, 1)),
    Premiere: new Date(Date.UTC(2024, 0, 2)),
  },
  {
    id: 'date/2',
    Name: 'Beta',
    'Group A': true,
    'Group B': true,
    ReleaseDate: new Date(Date.UTC(2001, 0, 1)),
    Premiere: new Date(Date.UTC(2024, 1, 15)),
  },
  {
    id: 'date/3',
    Name: 'Gamma',
    'Group A': false,
    'Group B': true,
    ReleaseDate: new Date(Date.UTC(2004, 0, 1)),
    Premiere: new Date(Date.UTC(2024, 4, 20, 13, 30)),
  },
];

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
    <Upset data={moviesData} hideSettings allowAttributeRemoval visibleDatasetAttributes={['AvgRating']} visualizeUpsetAttributes={false} />
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

export const DateAttributes = () => (
  <div style={{ height: 300 }}>
    <Upset
      data={dateData}
      hideSettings
      allowAttributeRemoval
      visibleDatasetAttributes={['ReleaseDate', 'Premiere']}
      visualizeUpsetAttributes={false}
    />
  </div>
);

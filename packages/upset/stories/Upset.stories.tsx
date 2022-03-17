import { Meta, Story } from '@storybook/react';
import { CoreUpsetData, test } from '@visdesignlab/upset2-core';
import React, { useEffect, useState } from 'react';

import { Upset } from '../src';

const meta: Meta = {
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
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<{ dataset: string }> = (args) => {
  const [data, setData] = useState<CoreUpsetData | null>(null);

  useEffect(() => {
    test().then((d) => setData(d));
  }, []);

  return data ? (
    <Upset data={data} loadAttributes={3} />
  ) : (
    <div>Loading {args.dataset} dataset</div>
  );
};

// By passing using the Args format for exported stories,
// you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Movies = Template.bind({});

Movies.args = {
  dataset: 'Movies',
};

/* eslint-disable react/destructuring-assignment */
import { Meta } from '@storybook/react';
import { CoreUpsetData, process } from '@visdesignlab/upset2-core';
import React, { useEffect, useState } from 'react';

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
    controls: { expanded: "true" },
  },
};

export default meta;

const Template = (args) => {
  const [data, setData] = useState<CoreUpsetData | null>(null);

  useEffect(() => {
    const d = process(
      // [
      //   {
      //     "_key": "40726825",
      //     "_id": "simpsons/40726825",
      //     "_rev": "_fQwAX56---",
      //     "Name": "Lisa",
      //     "School": "true",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "false",
      //     "Male": "false",
      //     "Power Plant": "false",
      //     "Age": "8"
      //   },
      //   {
      //     "_key": "40726826",
      //     "_id": "simpsons/40726826",
      //     "_rev": "_fQwAX56--_",
      //     "Name": "Bart",
      //     "School": "true",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "false",
      //     "Male": "true",
      //     "Power Plant": "false",
      //     "Age": "10"
      //   },
      //   {
      //     "_key": "40726827",
      //     "_id": "simpsons/40726827",
      //     "_rev": "_fQwAX56--A",
      //     "Name": "Homer",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "true",
      //     "Evil": "false",
      //     "Male": "true",
      //     "Power Plant": "true",
      //     "Age": "40"
      //   },
      //   {
      //     "_key": "40726828",
      //     "_id": "simpsons/40726828",
      //     "_rev": "_fQwAX56--B",
      //     "Name": "Marge",
      //     "School": "false",
      //     "Blue Hair": "true",
      //     "Duff Fan": "false",
      //     "Evil": "false",
      //     "Male": "false",
      //     "Power Plant": "false",
      //     "Age": "36"
      //   },
      //   {
      //     "_key": "40726829",
      //     "_id": "simpsons/40726829",
      //     "_rev": "_fQwAX56--C",
      //     "Name": "Maggie",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "false",
      //     "Male": "false",
      //     "Power Plant": "false",
      //     "Age": "1"
      //   },
      //   {
      //     "_key": "40726830",
      //     "_id": "simpsons/40726830",
      //     "_rev": "_fQwAX56--D",
      //     "Name": "Barney",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "true",
      //     "Evil": "false",
      //     "Male": "true",
      //     "Power Plant": "false",
      //     "Age": "39"
      //   },
      //   {
      //     "_key": "40726831",
      //     "_id": "simpsons/40726831",
      //     "_rev": "_fQwAX56--E",
      //     "Name": "Mr. Burns",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "true",
      //     "Male": "true",
      //     "Power Plant": "true",
      //     "Age": "90"
      //   },
      //   {
      //     "_key": "40726832",
      //     "_id": "simpsons/40726832",
      //     "_rev": "_fQwAX56--F",
      //     "Name": "Mo",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "true",
      //     "Evil": "false",
      //     "Male": "true",
      //     "Power Plant": "false",
      //     "Age": "41"
      //   },
      //   {
      //     "_key": "40726833",
      //     "_id": "simpsons/40726833",
      //     "_rev": "_fQwAX56--G",
      //     "Name": "Ned",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "false",
      //     "Male": "true",
      //     "Power Plant": "false",
      //     "Age": "42"
      //   },
      //   {
      //     "_key": "40726834",
      //     "_id": "simpsons/40726834",
      //     "_rev": "_fQwAX56--H",
      //     "Name": "Milhouse",
      //     "School": "true",
      //     "Blue Hair": "true",
      //     "Duff Fan": "false",
      //     "Evil": "false",
      //     "Male": "true",
      //     "Power Plant": "false",
      //     "Age": "10"
      //   },
      //   {
      //     "_key": "40726835",
      //     "_id": "simpsons/40726835",
      //     "_rev": "_fQwAX56--I",
      //     "Name": "Grampa",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "false",
      //     "Male": "true",
      //     "Power Plant": "false",
      //     "Age": "85"
      //   },
      //   {
      //     "_key": "40726836",
      //     "_id": "simpsons/40726836",
      //     "_rev": "_fQwAX56--J",
      //     "Name": "Krusty",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "true",
      //     "Evil": "true",
      //     "Male": "true",
      //     "Power Plant": "false",
      //     "Age": "46"
      //   },
      //   {
      //     "_key": "40726837",
      //     "_id": "simpsons/40726837",
      //     "_rev": "_fQwAX56--K",
      //     "Name": "Smithers",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "true",
      //     "Male": "true",
      //     "Power Plant": "true",
      //     "Age": "33"
      //   },
      //   {
      //     "_key": "40726838",
      //     "_id": "simpsons/40726838",
      //     "_rev": "_fQwAX56--L",
      //     "Name": "Ralph",
      //     "School": "true",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "false",
      //     "Male": "true",
      //     "Power Plant": "false",
      //     "Age": "8"
      //   },
      //   {
      //     "_key": "40726839",
      //     "_id": "simpsons/40726839",
      //     "_rev": "_fQwAX56--M",
      //     "Name": "Sideshow Bob",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "true",
      //     "Male": "true",
      //     "Power Plant": "false",
      //     "Age": "37"
      //   },
      //   {
      //     "_key": "40726840",
      //     "_id": "simpsons/40726840",
      //     "_rev": "_fQwAX56--N",
      //     "Name": "Kent Brockman",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "false",
      //     "Male": "true",
      //     "Power Plant": "false",
      //     "Age": "45"
      //   },
      //   {
      //     "_key": "40726841",
      //     "_id": "simpsons/40726841",
      //     "_rev": "_fQwAX56--O",
      //     "Name": "Fat Tony",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "true",
      //     "Male": "true",
      //     "Power Plant": "false",
      //     "Age": "50"
      //   },
      //   {
      //     "_key": "40726842",
      //     "_id": "simpsons/40726842",
      //     "_rev": "_fQwAX56--P",
      //     "Name": "Jacqueline Bouvier ",
      //     "School": "false",
      //     "Blue Hair": "true",
      //     "Duff Fan": "false",
      //     "Evil": "false",
      //     "Male": "false",
      //     "Power Plant": "false",
      //     "Age": "76"
      //   },
      //   {
      //     "_key": "40726843",
      //     "_id": "simpsons/40726843",
      //     "_rev": "_fQwAX56--Q",
      //     "Name": "Patty Bouvier",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "false",
      //     "Male": "false",
      //     "Power Plant": "false",
      //     "Age": "45"
      //   },
      //   {
      //     "_key": "40726844",
      //     "_id": "simpsons/40726844",
      //     "_rev": "_fQwAX56--R",
      //     "Name": "Selma Bouvier",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "false",
      //     "Male": "false",
      //     "Power Plant": "false",
      //     "Age": "45"
      //   },
      //   {
      //     "_key": "40726845",
      //     "_id": "simpsons/40726845",
      //     "_rev": "_fQwAX56--S",
      //     "Name": "Lenny Leonard",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "true",
      //     "Evil": "false",
      //     "Male": "true",
      //     "Power Plant": "true",
      //     "Age": 38
      //   },
      //   {
      //     "_key": "40726846",
      //     "_id": "simpsons/40726846",
      //     "_rev": "_fQwAX56--T",
      //     "Name": "Carl Carlson",
      //     "School": "false",
      //     "Blue Hair": "false",
      //     "Duff Fan": "true",
      //     "Evil": "false",
      //     "Male": "true",
      //     "Power Plant": "true",
      //     "Age": "37"
      //   },
      //   {
      //     "_key": "40726847",
      //     "_id": "simpsons/40726847",
      //     "_rev": "_fQwAX56--U",
      //     "Name": "Nelson",
      //     "School": "true",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "true",
      //     "Male": "true",
      //     "Power Plant": "false",
      //     "Age": "11"
      //   },
      //   {
      //     "_key": "40726848",
      //     "_id": "simpsons/40726848",
      //     "_rev": "_fQwAX56--V",
      //     "Name": "Martin Prince",
      //     "School": "true",
      //     "Blue Hair": "false",
      //     "Duff Fan": "false",
      //     "Evil": "false",
      //     "Male": "true",
      //     "Power Plant": "false",
      //     "Age": "10"
      //   }
      // ],
      [
        {
          "_key": "40726825",
          "_id": "simpsons/40726825",
          "_rev": "_hETsMiy---",
          "Name": "Lisa",
          "School": true,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": false,
          "Male": false,
          "Power Plant": false,
          "Age": 8
        },
        {
          "_key": "40726826",
          "_id": "simpsons/40726826",
          "_rev": "_hETsMiy--_",
          "Name": "Bart",
          "School": true,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": false,
          "Male": true,
          "Power Plant": false,
          "Age": 10
        },
        {
          "_key": "40726827",
          "_id": "simpsons/40726827",
          "_rev": "_hETsMiy--A",
          "Name": "Homer",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": true,
          "Evil": false,
          "Male": true,
          "Power Plant": true,
          "Age": 40
        },
        {
          "_key": "40726828",
          "_id": "simpsons/40726828",
          "_rev": "_hETsMiy--B",
          "Name": "Marge",
          "School": false,
          "Blue Hair": true,
          "Duff Fan": false,
          "Evil": false,
          "Male": false,
          "Power Plant": false,
          "Age": 36
        },
        {
          "_key": "40726829",
          "_id": "simpsons/40726829",
          "_rev": "_hETsMiy--C",
          "Name": "Maggie",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": false,
          "Male": false,
          "Power Plant": false,
          "Age": 1
        },
        {
          "_key": "40726830",
          "_id": "simpsons/40726830",
          "_rev": "_hETsMiy--D",
          "Name": "Barney",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": true,
          "Evil": false,
          "Male": true,
          "Power Plant": false,
          "Age": 39
        },
        {
          "_key": "40726831",
          "_id": "simpsons/40726831",
          "_rev": "_hETsMiy--E",
          "Name": "Mr. Burns",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": true,
          "Male": true,
          "Power Plant": true,
          "Age": 90
        },
        {
          "_key": "40726832",
          "_id": "simpsons/40726832",
          "_rev": "_hETsMiy--F",
          "Name": "Mo",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": true,
          "Evil": false,
          "Male": true,
          "Power Plant": false,
          "Age": 41
        },
        {
          "_key": "40726833",
          "_id": "simpsons/40726833",
          "_rev": "_hETsMiy--G",
          "Name": "Ned",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": false,
          "Male": true,
          "Power Plant": false,
          "Age": 42
        },
        {
          "_key": "40726834",
          "_id": "simpsons/40726834",
          "_rev": "_hETsMiy--H",
          "Name": "Milhouse",
          "School": true,
          "Blue Hair": true,
          "Duff Fan": false,
          "Evil": false,
          "Male": true,
          "Power Plant": false,
          "Age": 10
        },
        {
          "_key": "40726835",
          "_id": "simpsons/40726835",
          "_rev": "_hETsMiy--I",
          "Name": "Grampa",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": false,
          "Male": true,
          "Power Plant": false,
          "Age": 85
        },
        {
          "_key": "40726836",
          "_id": "simpsons/40726836",
          "_rev": "_hETsMiy--J",
          "Name": "Krusty",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": true,
          "Evil": true,
          "Male": true,
          "Power Plant": false,
          "Age": 46
        },
        {
          "_key": "40726837",
          "_id": "simpsons/40726837",
          "_rev": "_hETsMiy--K",
          "Name": "Smithers",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": true,
          "Male": true,
          "Power Plant": true,
          "Age": 33
        },
        {
          "_key": "40726838",
          "_id": "simpsons/40726838",
          "_rev": "_hETsMiy--L",
          "Name": "Ralph",
          "School": true,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": false,
          "Male": true,
          "Power Plant": false,
          "Age": 8
        },
        {
          "_key": "40726839",
          "_id": "simpsons/40726839",
          "_rev": "_hETsMiy--M",
          "Name": "Sideshow Bob",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": true,
          "Male": true,
          "Power Plant": false,
          "Age": 37
        },
        {
          "_key": "40726840",
          "_id": "simpsons/40726840",
          "_rev": "_hETsMiy--N",
          "Name": "Kent Brockman",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": false,
          "Male": true,
          "Power Plant": false,
          "Age": 45
        },
        {
          "_key": "40726841",
          "_id": "simpsons/40726841",
          "_rev": "_hETsMiy--O",
          "Name": "Fat Tony",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": true,
          "Male": true,
          "Power Plant": false,
          "Age": 50
        },
        {
          "_key": "40726842",
          "_id": "simpsons/40726842",
          "_rev": "_hETsMiy--P",
          "Name": "Jacqueline Bouvier ",
          "School": false,
          "Blue Hair": true,
          "Duff Fan": false,
          "Evil": false,
          "Male": false,
          "Power Plant": false,
          "Age": 76
        },
        {
          "_key": "40726843",
          "_id": "simpsons/40726843",
          "_rev": "_hETsMiy--Q",
          "Name": "Patty Bouvier",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": false,
          "Male": false,
          "Power Plant": false,
          "Age": 45
        },
        {
          "_key": "40726844",
          "_id": "simpsons/40726844",
          "_rev": "_hETsMiy--R",
          "Name": "Selma Bouvier",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": false,
          "Male": false,
          "Power Plant": false,
          "Age": 45
        },
        {
          "_key": "40726845",
          "_id": "simpsons/40726845",
          "_rev": "_hETsMiy--S",
          "Name": "Lenny Leonard",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": true,
          "Evil": false,
          "Male": true,
          "Power Plant": true,
          "Age": 38
        },
        {
          "_key": "40726846",
          "_id": "simpsons/40726846",
          "_rev": "_hETsMiy--T",
          "Name": "Carl Carlson",
          "School": false,
          "Blue Hair": false,
          "Duff Fan": true,
          "Evil": false,
          "Male": true,
          "Power Plant": true,
          "Age": 37
        },
        {
          "_key": "40726847",
          "_id": "simpsons/40726847",
          "_rev": "_hETsMiy--U",
          "Name": "Nelson",
          "School": true,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": true,
          "Male": true,
          "Power Plant": false,
          "Age": 11
        },
        {
          "_key": "40726848",
          "_id": "simpsons/40726848",
          "_rev": "_hETsMiy--V",
          "Name": "Martin Prince",
          "School": true,
          "Blue Hair": false,
          "Duff Fan": false,
          "Evil": false,
          "Male": true,
          "Power Plant": false,
          "Age": 10
        }
      ],
      {
        columns: {
          "_id": "string",
          "_rev": "string",
          "Name": "label",
          "School": "boolean",
          "Blue Hair": "boolean",
          "Duff Fan": "boolean",
          "Evil": "boolean",
          "Male": "boolean",
          "Power Plant": "boolean",
          "Age": "number",
          "_key": "primary key"
        }
      }
    );

    console.log(d);
    setData(d);
  }, []);

  return data ? (
    <Upset data={data} loadAttributes={3} />
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

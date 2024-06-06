# UpSet 2.0 – Visualizing Intersecting Sets

UpSet 2 is deployed at [https://upset.multinet.app/](https://upset.multinet.app/).  

Deployment Status: [![Netlify Status](https://api.netlify.com/api/v1/badges/edb8054f-7bfd-4b6a-8325-b26c279e2991/deploy-status)](https://app.netlify.com/sites/upset2/deploys)

## About

UpSet is an interactive, web based visualization technique designed to analyze set-based data. UpSet visualizes both, set intersections and their properties, and the items (elements) in the dataset.

Please see the <https://upset.app> for more info about UpSet.

This version is a re-implementation using modern web technologies of [the original UpSet](https://vdl.sci.utah.edu/publications/2014_infovis_upset/).

UpSet 2 is described in this short poster:

```text
Kiran Gadhave, Hendrik Strobelt, Nils Gehlenborg, Alexander Lex
UpSet 2: From Prototype to Tool
Proceedings of the IEEE Information Visualization Conference – Posters (InfoVis ’19), 2019.
```

UpSet 2 is based on the original UpSet, which was first described in this paper:

```text
Alexander Lex, Nils Gehlenborg, Hendrik Strobelt, Romain Vuillemot, Hanspeter Pfister
UpSet: Visualization of Intersecting Sets
IEEE Transactions on Visualization and Computer Graphics (InfoVis), 20(12): 1983--1992, doi:10.1109/TVCG.2014.2346248, 2014.
```

---

## UpSet 2.0 as a React Component

UpSet 2.0 can be imported as a React component using:

```console
npm install @visdesignlab/upset2-react
```

Note that UpSet 2.0 requires a react version of 16.0 or higher.

Import the component using `import { Upset } from @visdesignlab/upset2-react` in your react component.

### UpSet 2.0 Data

#### Data structure

The raw data structure for UpSet should be two data objects. One is the set membership data, and the other is the column type annotations.

The `data` object should be an array of objects. Each object should contain all the set membership boolean values as well as any attributes.

The `annotations` object should be an object with a nested object field `columns`. The `columns` field should contain each possible column in the data, as well as the type for each column. This should be every possible set as well as any attribute type.

The column which is the name of the item should be of type `label`. This will be used to generate ids and name the subsets. *Note*: There should only be one `label` column. Any set membership should be a boolean type. Finally, any attribute should be a `number` type.

In the example below, the item name is `Name`, noted by the `label` type. The sets are `School`, `Blue Hair`, `Duff Fan`, `Evil`, `Male`, and `Power Plant`. The only attribute in this dataset is `Age`, which is a number. This is clear in the annotations object, which denotes this.

```js
const annotations = {
  "columns": {
    "Name": "label",
    "School": "boolean",
    "Blue Hair": "boolean",
    "Duff Fan": "boolean",
    "Evil": "boolean",
    "Male": "boolean",
    "Power Plant": "boolean",
    "Age": "number"
  }
}
```

This data example shows only two characters from the Simpsons. Note that the fields directly correlate to the `annotations` object above.

```js
const rawData = [
   {
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
    "Name": "Marge",
    "School": false,
    "Blue Hair": true,
    "Duff Fan": false,
    "Evil": false,
    "Male": false,
    "Power Plant": false,
    "Age": 36
  },
]
```

The data and/or attributes objects can be JSON strings or traditional JS objects.

#### Loading Data into the UpSet 2.0 component

To load your raw data into UpSet 2.0, some additional processing is required. First, import `process` from `@visdesignlab/upset2-react`. Then, before loading rendering the UpSet 2.0 component, call the `process` function, which takes the data and annotations objects as arguments. The example below details a simple usecase of the process function.

```JSX
import { Upset, process } from '@visdesignlab/upset2-react';

const main = () => {
  const rawData = const data = [
    {
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
      "Name": "Marge",
      "School": false,
      "Blue Hair": true,
      "Duff Fan": false,
      "Evil": false,
      "Male": false,
      "Power Plant": false,
      "Age": 36
    },
  ];

  const annotations = {
    columns: {
      "Name": "label",
      "School": "boolean",
      "Blue Hair": "boolean",
      "Duff Fan": "boolean",
      "Evil": "boolean",
      "Male": "boolean",
      "Power Plant": "boolean",
      "Age": "number"
    }
  };

  const processedData = process(rawData, annotations);

  return <Upset data={processedData} />;
}
```

### UpSet 2.0 component options

#### All options

- `data`: The data for the Upset component. See [UpSet 2.0 Data](#upset-20-data) for more information.
- `config` (optional): The configuration options for the Upset component. This can be partial. See [Configuration Options](#configuration-options) for more details.
- `visualizeAttributes` (optional)(`string[]`): List of attribute names (strings) which should be visualized. Defaults to the first 3 if no value is provided. If an empty list is provided, displays no attributes.
- `visualizeUpsetAttributes` (optional)(`boolean`): Whether or not to visualize UpSet generated attributes (`degree` and `deviation`). Defaults to `false`.
- `allowAttributeRemoval` (optional)(`boolean`): Whether or not to allow the user to remove attribute columns. This should be enabled only if there is an option within the parent application which allows for attributes to be added after removal. Default attribute removal behavior in UpSet 2.0 is done via context menu on attribute headers. Defaults to `false`.
- `hideSettings` (optional)(`boolean`): Hide the aggregations/filter settings sidebar.
- `parentHasHeight` (optional)(`boolean`): Indicates if the parent component has a fixed height. If this is set to `false`, the plot will occupy the full viewport height. When set to `true`, the plot will fit entirely within the parent component. Defaults to `false`.
- `extProvenance` (optional): External provenance actions and [TrrackJS](https://github.com/Trrack/trrackjs) object for provenance history tracking and actions. This should only be used if your tool is using TrrackJS and has all the actions used by UpSet 2.0. Provenance is still tracked if nothing is provided. See [App.tsx](https://github.com/visdesignlab/upset2/blob/main/packages/app/src/App.tsx) to see how UpSet 2.0 and Multinet use an external Trrack object. Note that [initializeProvenanceTracking](https://github.com/visdesignlab/upset2/blob/main/packages/upset/src/provenance/index.ts#L300) and [getActions](https://github.com/visdesignlab/upset2/blob/main/packages/upset/src/provenance/index.ts#L322) are used to ensure that the provided provenance object is compatible.
- `provVis` (optional): [Sidebar options](#sidebar-options) for the provenance visualization sidebar. See [Trrack-Vis](https://github.com/Trrack/trrackvis) for more information about Trrack provenance visualization.
- `elementSidebar` (optional): [Sidebar options](#sidebar-options) for the element visualization sidebar. This sidebar is used for element queries, element selection datatable, and supplimental plot generation.
- `altTextSidebar` (optional): [Sidebar options](#sidebar-options) for the text description sidebar. This sidebar is used to display the generated text descriptions for an Upset 2.0 plot, given that the `generateAltText` function is provided.
- `generateAltText` (optional)(`() => Promise<AltText>`): Async function which should return a generated AltText object. See [Alt Text Generation](#alt-text-generation) for more information about Alt Text generation.

##### Configuration options

If no configuration options are provided, the default will be:

- No aggregation
- Sort rows by `Size - Descending`
- Sort visible sets by `Alphabetical`
- Minimum degree filter: 0
- Maximum degree filter: 6
- Show the "no set" row
- Hide empty rows

Example of full configuration (grammar) JSON produced for default Simpsons dataset:

```json
{
  "plotInformation": {
    "description": "",
    "sets": "",
    "items": ""
  },
  "horizontal": false,
  "firstAggregateBy": "None",
  "firstOverlapDegree": 2,
  "secondAggregateBy": "None",
  "secondOverlapDegree": 2,
  "sortVisibleBy": "Alphabetical",
  "sortBy": "Size",
  "sortByOrder": "Descending",
  "filters": {
    "maxVisible": 6,
    "minVisible": 0,
    "hideEmpty": true,
    "hideNoSet": false
  },
  "visibleSets": [
    "Set_School",
    "Set_Blue Hair",
    "Set_Duff Fan",
    "Set_Evil",
    "Set_Male",
    "Set_Power Plant"
  ],
  "visibleAttributes": [
    "Age"
  ],
  "bookmarkedIntersections": [],
  "collapsed": [],
  "plots": {
    "scatterplots": [],
    "histograms": []
  },
  "allSets": [
    {
      "name": "Set_School",
      "size": 6
    },
    {
      "name": "Set_Blue Hair",
      "size": 3
    },
    {
      "name": "Set_Duff Fan",
      "size": 6
    },
    {
      "name": "Set_Evil",
      "size": 6
    },
    {
      "name": "Set_Male",
      "size": 18
    },
    {
      "name": "Set_Power Plant",
      "size": 5
    }
  ],
  "selected": null
}
```

##### Sidebar options

SidebarProps type:

```js
interface SidebarProps {
  /**
   * Indicates whether the sidebar is open or closed.
   */
  open: boolean;

  /**
   * Callback function to close the sidebar.
   */
  close: () => void;
}
```

##### Alt Text Generation

Alt Text generation requires the use of a custom or imported Alt-Text generation function. In [upset.multinet.app](https://upset.multinet.app), we are using the Multinet API, which exposes an api call to the [upset-alttxt](https://pypi.org/project/upset-alttxt/) python package. This Python package 

#### Default Configuration

The default configuration for UpSet 2.0 shows the Aggregation/Filtering settings sidebar, sort the plot by Size (Descending), and shows up to the first 3 attributes in the data.

Example using Simpsons dataset:

```js
<Upset data={simpsonsCharacterData} />
```

![Default UpSet 2.0 plot configuration](/assets/default-plot-example.png)

## Developer Docs

Developer documentation can be found at [https://vdl.sci.utah.edu/upset2/](https://vdl.sci.utah.edu/upset2/).

For more information on documentation see the [Developer Documentation Guidelines](#developer-documentation-guidelines).

## Local Installation

To deploy UpSet 2.0 locally it is necessary to install the Multinet infrastructure.

### Multinet Installation

1. Clone [Multinet API](https://github.com/multinet-app/multinet-api), [Multinet Client](https://github.com/multinet-app/multinet-client), and [Multinet JS](https://github.com/multinet-app/multinetjs) into individual folders.
2. Follow the installation instructions for Multinet API and Multinet Client.

### Upset Installation

1. Clone the repository using `git clone` or download and extract the zip file.
2. Open terminal in the cloned folder and run `yarn install`
3. Run `yarn build` in the terminal to compile.
4. Navigate to the upset2 folder.
5. In `packages/app` copy `.env.default` and rename the copied file to `.env`
6. In the OAUTH application created during the [OAUTH API setup](https://github.com/multinet-app/multinet-api#api) of Multinet API, add `http://localhost:3000/` to the redirect uris field.
7. Copy the `Client id` field in the application but do not modify the value
8. Navigate to the `.env` file created in step 5.
9. Paste the `Client id` to the field `VITE_OAUTH_CLIENT_ID`

## Running the application

To run UpSet 2.0 locally, first, complete the [Local Installation](#local-installation) steps. Then, use `yarn dev` to run UpSet 2.0 on port 3000.
A browser window for `localhost:3000` will open during the launch process.

## End To End (e2e) Testing

To run the playwright end to end tests, use the command:
`yarn test`

To open the test in a UI view to track steps, append `--ui`.

This will launch a local server if there is not one already running on port 3000.

To add a test, add a `.spec.ts` file to `e2e-tests`. For information on how to use playwright, please see the [playwright documentation](https://playwright.dev/docs/writing-tests).

## Storybook development

Storybook can be used to test development of UpSet 2.0 as a react component. To run storybook, run `cd packages/upset` from the project root directory. Then, run `yarn storybook`. This will run `Upset.stories.tsx`, which opens a browser tab for the storybook. This will render the react component of UpSet with the simpsons dataset and stripped of any attribute or settings rendering.

A new story can be added by adding a `{name}.stories.tsx` file to `packages/upset/stories/`. New data can be added to the `data` subfolder in the same directory.

## Developer Documentation Guidelines

When adding a new feature, ensure that your additions are well documented following [JSDoc style annotations](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html). Also, please add testing via Playwright, outlined in [#end-to-end-e2e-testing](#end-to-end-e2e-testing).

To build the documentation locally, use the command: `yarn doc`. The default file output is at `/docs`.

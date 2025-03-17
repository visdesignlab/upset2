---
sidebar_position: 2
---

# Local Installation

To deploy UpSet 2.0 locally it is necessary to install the Multinet infrastructure.

## Multinet Installation

1. Clone [Multinet API](https://github.com/multinet-app/multinet-api), [Multinet Client](https://github.com/multinet-app/multinet-client), and [Multinet JS](https://github.com/multinet-app/multinetjs) into individual folders.
2. Follow the installation instructions for Multinet API and Multinet Client.

## Upset Installation

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
A browser window for `localhost:3000` will open during the launch process. *Note* that for this to work with the data upload portal, multinet server and client should be running in parallel.

## End To End (e2e) Testing

To run the playwright end to end tests, use the command:
`yarn test`

To open the test in a UI view to track steps, append `--ui`.

This will launch a local server if there is not one already running on port 3000.

To add a test, add a `.spec.ts` file to `e2e-tests`. For information on how to use playwright, please see the [playwright documentation](https://playwright.dev/docs/writing-tests).

## Storybook development

Storybook can be used to test development of UpSet 2.0 as a react component. To run storybook, run `cd packages/upset` from the project root directory. Then, run `yarn storybook`. This will run `Upset.stories.tsx`, which opens a browser tab for the storybook. This will render the react component of UpSet with the simpsons dataset and stripped of any attribute or settings rendering.

A new story can be added by adding a `{name}.stories.tsx` file to `packages/upset/stories/`. New data can be added to the `data` subfolder in the same directory.

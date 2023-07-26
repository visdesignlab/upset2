# UpSet 2.0 – Visualizing Intersecting Sets

UpSet 2 is deployed at [https://upset.multinet.app/](https://upset.multinet.app/).  

Deployment Status: [![Netlify Status](https://api.netlify.com/api/v1/badges/edb8054f-7bfd-4b6a-8325-b26c279e2991/deploy-status)](https://app.netlify.com/sites/upset2/deploys)

## About

UpSet is an interactive, web based visualization technique designed to analyze set-based data. UpSet visualizes both, set intersections and their properties, and the items (elements) in the dataset.

Please see the <http://upset.app> for more info about UpSet.

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

## Local Installation

To deploy UpSet 2.0 locally it is necessary to install the Multinet infrastructure.

### Multinet Installtion

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
9. Paste the `Client id` to the field `REACT_APP_OAUTH_CLIENT_ID`

## Running the application

To run UpSet 2.0 locally, first, complete the [Local Installation](#local-installation) steps. Then, use `yarn dev` to run UpSet 2.0 on port 3000.
A browser window for `localhost:3000` will open during the launch process.

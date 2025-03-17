---
sidebar_position: 1
---

# Developer Documentation

Developer documentation can be found at [https://vdl.sci.utah.edu/upset2/](https://vdl.sci.utah.edu/upset2/).

For more information on documentation see the [Developer Documentation Guidelines](#developer-documentation-guidelines).

## Developer Documentation Guidelines

When adding a new feature, ensure that your additions are well documented following [JSDoc style annotations](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html). Also, please add testing via Playwright, outlined in [#end-to-end-e2e-testing](./local-development.md#end-to-end-e2e-testing).

To build the documentation locally, use the command: `yarn build:docs`. Then, use `yarn dev:docs` to visualize the results.

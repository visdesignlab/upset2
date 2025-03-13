---
sidebar_position: 3
---

# Developer Guidelines

Changes to the `UpsetConfig` type require writing config conversion functions to ensure backwards compatibility. See the note at the top of `packages/core/src/convertConfig.ts` for details. Additionally, the typechecker for the `UpsetConfig` must be updated when the type is. See `packages/core/src/typecheck.ts`. Additionally, all the types used within `UpsetConfig` have their own typecheck functions; changes to these types must be reflected in the typechecker.

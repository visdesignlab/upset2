import { atom, selector } from 'recoil';
import { SetQuery } from '@visdesignlab/upset2-core';
import { upsetConfigAtom } from './upsetConfigAtoms';

/**
 * Atom to manage the state of the query-by-sets interface.
 *
 * This atom holds a boolean value indicating whether the query-by-sets
 * interface is enabled or not. The default value is `false`.
 *
 * @constant
 * @type {boolean}
 * @default false
 */
export const queryBySetsInterfaceAtom = atom<boolean>({
  key: 'query-by-sets-interface',
  default: false,
});

/**
 * A Recoil selector that retrieves the current set query from the upset configuration atom.
 *
 * @remarks
 * This selector is used to get the `setQuery` property from the `upsetConfigAtom`.
 *
 * @returns {SetQuery} The current set query or null if not set.
 *
 * @example
 * ```typescript
 * const currentSetQuery = useRecoilValue(setQueryAtom);
 * ```
 */
export const setQuerySelector = selector<SetQuery | null>({
  key: 'set-query',
  get: ({ get }) => get(upsetConfigAtom).setQuery,
});

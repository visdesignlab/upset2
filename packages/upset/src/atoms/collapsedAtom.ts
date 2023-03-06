import { Row, isRowAggregate } from '@visdesignlab/upset2-core';
import { atom, selector } from 'recoil';
import { rowsSelector } from './renderRowsAtom';

type CollapsedState = { [id: string]: boolean }

export const defaultCollapsedIntersections = selector<CollapsedState>({
  key: 'collapsed-selector',
  get: ({ get }) => {
    const rows = get(rowsSelector);
    const ids: CollapsedState = {};
    Object.entries(rows.values).forEach((entry) => {
      const row = entry[1];
      if(isRowAggregate(row)) {
        ids[row.id] = false;
      }
    })

    return ids;
  }
});

export const collapsedAtom = atom<CollapsedState>({
  key: 'collapsed-ids',
  default: defaultCollapsedIntersections,
});

export const getChildrenCollapseState = (row: Row, collapseState: boolean, children: CollapsedState): CollapsedState => {
  if (!isRowAggregate(row)) {
    return {...children, [row.id]: collapseState}
  } else {
    children[row.id] = collapseState; // add the aggregate-id to the dictionary
    for (const [_id, set] of Object.entries(row.items.values)) {
      children = getChildrenCollapseState(set, collapseState, children);
    }
  }

  return children;
}
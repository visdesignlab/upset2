import { Row, isRowAggregate } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

type CollapsedState = { [id: string]: boolean }

export const collapsedAtom = atom<CollapsedState>({
  key: 'collapsed-ids',
  default: {},
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
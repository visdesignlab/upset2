import { createBaseSet, BaseSet } from './BaseSet';

export interface Set extends BaseSet {}

export type Sets = Set[];

export function createSet(
  id: string,
  setName: string,
  combinedSets: number[],
  data: number[],
  depth: number
): Set {
  const base = createBaseSet(id, setName, combinedSets, data, depth);

  base.type = 'Set';

  return {
    ...base
  };
}

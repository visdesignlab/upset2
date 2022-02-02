import { Sets, Items, Subsets } from '@visdesignlab/upset2-core';
import { createContext } from 'react';
import { atom } from 'recoil';
import { calculateDimensions, useUpsetDimensions } from '../dimensions';

export type UpsetContextType = {
  sets: Sets;
  visibleSets: string[];
  items: Items;
  subsets: Subsets;
  dimensions: ReturnType<typeof useUpsetDimensions>;
};

export const defaultContext: UpsetContextType = {
  sets: {},
  visibleSets: [],
  items: {},
  subsets: {},
  dimensions: calculateDimensions(),
};

export const UpsetContext = createContext<UpsetContextType>(defaultContext);

export const maxCardinality = atom({
  key: 'maxCardinality',
  default: -1,
});

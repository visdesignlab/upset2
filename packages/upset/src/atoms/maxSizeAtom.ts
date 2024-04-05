import { atom } from 'recoil';

/**
 * Max set size; used to set the size scale
 * Either calculated automatically or manually set by the advanced scale slider
 */
export const maxSize = atom({
  key: 'max-size',
  default: -1,
});

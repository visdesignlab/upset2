import { UpsetConfig, DefaultConfig, BookmarkedSelection } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

// This config is overruled by any config provided by an external source
export const upsetConfigAtom = atom<UpsetConfig>({
  key: 'upset-config',
  default: DefaultConfig,
});

/**
 * Represents the current element selection plot state.
 * 
 * This is also stored in upset-config's elementSelection field.
 * However, we don't want to save to the config (by firing a Trrack action)
 * every time the user brush moves slightly (this would spam actions).
 * At the same time, the size bars need to know the active selection every
 * time the selection changes slightly, so this acts as a 'draft' edit to the config.
 */
export const elementSelectionAtom = atom<BookmarkedSelection | null>({
  key: 'element-selection',
  default: null,
});

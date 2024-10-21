import { DefaultConfig, UpsetConfig } from "@visdesignlab/upset2-core";
import { atom } from "recoil";

export const configAtom = atom<UpsetConfig>({
  key: 'upset-config',
  default: DefaultConfig,
});
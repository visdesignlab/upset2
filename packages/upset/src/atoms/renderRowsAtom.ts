import { rowsCount } from "@visdesignlab/upset2-core";
import { upsetConfigAtom } from "./config/upsetConfigAtoms";
import { dataAtom } from "./dataAtom";
import { selector } from "recoil";

export type RowConfig = {
  position: number;
  collapsed: boolean;
};

export type RowConfigMap = { [key: string]: RowConfig };

export const rowCountSelector = selector({
  key: 'row-count',
  get: ({ get }) => {
    const state = get(upsetConfigAtom);
    const data = get(dataAtom);
    return rowsCount(data, state);
  }
})
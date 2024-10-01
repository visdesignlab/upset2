import { getRows, Rows, UpsetConfig } from "@visdesignlab/upset2-core";
import { selectorFamily } from "recoil";
import { dataSelector } from "./dataAtom";

/**
 * Gets all rows in the plot
 */
export const rowsSelector = selectorFamily<Rows, UpsetConfig>({
  key: 'plot-rows',
  get: (config: UpsetConfig) => ({ get }) => getRows(get(dataSelector), config),
})
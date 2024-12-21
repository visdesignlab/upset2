import { Column, CoreUpsetData, Rows } from '@visdesignlab/upset2-core';
import { getAccessibleData } from '@visdesignlab/upset2-react';
import localforage from 'localforage';
import { useSetRecoilState } from 'recoil';
import { saveQueryParam } from '../atoms/queryParamAtom';
import { loadingAtom } from '../atoms/loadingAtom';

/**
 * Dispatches the plot state to local storage before redirecting to the data table;
 * this allows the data table to display without calling the Multinet API again
 * @param data The upset data to be stored in the 'data' field
 * @param rows The rows to be stored in the 'rows' field
 * @param visibleSets The visible sets to be stored in the 'visibleSets' field
 * @param hiddenSets The hidden sets to be stored in the 'hiddenSets' field
 */
export async function dispatchState(data: CoreUpsetData, rows: Rows, visibleSets: string[], hiddenSets: Column[]) {
  const setLoading = useSetRecoilState(loadingAtom);
  setLoading(true);
  await Promise.all([
    localforage.clear(),
    localforage.setItem('data', data),
    localforage.setItem('rows', getAccessibleData(rows, true)),
    localforage.setItem('visibleSets', visibleSets),
    localforage.setItem('hiddenSets', hiddenSets.map((set: Column) => set.name)),
  ]);

  saveQueryParam();
  setLoading(false);
}

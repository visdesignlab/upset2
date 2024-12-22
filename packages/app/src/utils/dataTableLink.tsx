import { Column, CoreUpsetData, Rows } from '@visdesignlab/upset2-core';
import { getAccessibleData } from '@visdesignlab/upset2-react';
import localforage from 'localforage';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { Link } from 'react-router-dom';
import { FC, PropsWithChildren } from 'react';
import { getQueryParam, saveQueryParam } from '../atoms/queryParamAtom';
import { loadingAtom } from '../atoms/loadingAtom';

/**
 * Dispatches the plot state to local storage before redirecting to the data table;
 * this allows the data table to display without calling the Multinet API again
 * @param data The upset data to be stored in the 'data' field
 * @param rows The rows to be stored in the 'rows' field
 * @param visibleSets The visible sets to be stored in the 'visibleSets' field
 * @param hiddenSets The hidden sets to be stored in the 'hiddenSets' field
 * @param setLoading The setter for the loadingAtom
 */
async function dispatchState(
  data: CoreUpsetData,
  rows: Rows,
  visibleSets: string[],
  hiddenSets: Column[],
  setLoading: SetterOrUpdater<boolean>,
) {
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

type Props = {
  /** The Upset data to tabulate */
  data: CoreUpsetData;
  /** Rows of the plot */
  rows: Rows;
  /** Names of visible sets */
  visibleSets: string[];
  /** Names of hidden sets */
  hiddenSets: Column[];
  /** Tab index of the <Link> component */
  tabIndex?: number;
}

/**
 * A link to the data table,
 * which automatically dispatches the state needed by the table to local storage
 * @returns
 */
export const DataTableLink: FC<PropsWithChildren<Props>> = ({
  data, rows, visibleSets, hiddenSets, tabIndex, children,
}) => {
  const [loading, setLoading] = useRecoilState(loadingAtom);
  return loading ? (
    <p>Loading...</p>
  ) : (
    <Link
      to={`/datatable${getQueryParam()}`}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        dispatchState(data, rows, visibleSets, hiddenSets, setLoading);
      }}
      style={{ textDecoration: 'none', color: 'inherit' }}
      aria-label="Data Tables (raw and computed)"
      tabIndex={tabIndex}
    >
      {children}
    </Link>
  );
};

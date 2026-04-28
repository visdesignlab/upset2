import { Item } from '@visdesignlab/upset2-core';
import {
  useMemo, useEffect, useState,
} from 'react';
import { useRecoilValue } from 'recoil';

import { selectedOrBookmarkedItemsSelector } from '../../atoms/elementsSelectors';
import { setColumnsSelector } from '../../atoms/dataAtom';
import { dataAttributeSelector } from '../../atoms/attributeAtom';

// Local type aliases – avoids a compile-time hard dependency on @mui/x-data-grid
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GridRow = Record<string, any> & { id: string | number };
type GridColumn = {
  field: string;
  headerName: string;
  type?: string;
  description?: string;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataGridComponent = React.ComponentType<any>;

/**
 * Hook to generate rows for the DataGrid
 * @param items Items in the dataset
 * @returns readonly array of rows
 */
function useRows(items: Item[]): GridRow[] {
  return useMemo(() => items.map((item) => ({
    ...item.atts,
    _label: item._label,
    id: item._id,
  })), [items]);
}

/**
 * Hook to generate columns for the DataGrid
 * @param columns columns to be displayed
 * @returns array of columns with item field to be displayed in the DataGrid and headerName
 */
function useColumns(columns: string[]): GridColumn[] {
  const setColumns = useRecoilValue(setColumnsSelector);
  return useMemo(
    () => columns.map((col) => {
      // Prefixed with _ since that's how the Item object is structured
      const displayName = col === '_id' ? 'ID' : col === '_label' ? 'Label' : col;
      return {
        field: col,
        headerName: displayName,
        type: setColumns.includes(col) ? 'boolean' : 'string',
        description: displayName,
      };
    }),
    [columns, setColumns],
  );
}

/**
 * Table to display elements.
 * Requires @mui/x-data-grid to be installed; renders a warning if unavailable.
 */
export function ElementTable() {
  const attributeColumns = useRecoilValue(dataAttributeSelector);
  const elements = useRecoilValue(selectedOrBookmarkedItemsSelector);
  const rows = useRows(elements);
  const setColumns = useRecoilValue(setColumnsSelector);
  // Filtering out columns w/ _ removes metadata columns
  const columns = useColumns([
    '_label',
    ...[...attributeColumns, ...setColumns].filter((col) => !col.startsWith('_')),
  ]);

  // null = loading, false = unavailable, Component = ready
  const [DataGrid, setDataGrid] = useState<DataGridComponent | null | false>(null);

  useEffect(() => {
    let isMounted = true;
    try {
      import(/* @vite-ignore */ '@mui/x-data-grid')
        .then((mod) => {
          if (isMounted) setDataGrid(() => mod.DataGrid ?? false);
        })
        .catch(() => {
          if (isMounted) setDataGrid(false);
        });
    } catch {
      setDataGrid(false);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  if (DataGrid === false) {
    return (
      <p style={{ padding: '1rem', color: 'gray' }}>
        Install
        {' '}
        <code>@mui/x-data-grid</code>
        {' '}
        to view the element data table.
      </p>
    );
  }

  if (!DataGrid) return null;

  return <DataGrid style={{ height: 650 }} rows={rows} columns={columns} />;
}

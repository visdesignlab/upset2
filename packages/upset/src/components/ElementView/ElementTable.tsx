import { Box } from '@mui/material';
import { DataGrid, GridRowsProp } from '@mui/x-data-grid';
import { Item } from '@visdesignlab/upset2-core';
import { FC, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { selectedItemsSelector } from '../../atoms/elementsSelectors';
import { columnsAtom } from '../../atoms/columnAtom';
import { setColumnsSelector } from '../../atoms/dataAtom';

/**
 * Hook to generate rows for the DataGrid
 * @param items Items in the dataset
 * @returns readonly array of rows
 */
function useRows(items: Item[]): GridRowsProp {
  return useMemo(() => {
    const newItems: GridRowsProp = items.map((item) => ({
      ...item,
      id: item._id,
    }));

    return newItems;
  }, [items]);
}

/**
 * Hook to generate columns for the DataGrid
 * @param columns columns to be displayed
 * @returns array of columns with item field to be displayed in the DataGrid and headerName
 */
function useColumns(columns: string[]) {
  return useMemo(() => columns.map((col) => ({
    field: col,
    // Prefixed with _ since that's how the Item object is structured
    headerName: col === '_id' ? 'ID' : col === '_label' ? 'Label' : col,
  })), [columns]);
}

/**
 * Table to display elements
 */
export const ElementTable: FC = () => {
  const allColumns = useRecoilValue(columnsAtom);
  const elements = useRecoilValue(selectedItemsSelector);
  const rows = useRows(elements);
  const setColumns = useRecoilValue(setColumnsSelector);
  let columns = useColumns(['_label', ...allColumns.filter((col) => !col.startsWith('_'))]);
  // Sort set columns to the right of other columns & add a boolean type to
  columns = columns.sort((a, b) => {
    if (setColumns.includes(a.field) && setColumns.includes(b.field)) {
      return 0;
    }
    if (setColumns.includes(a.field)) {
      return 1;
    }
    if (setColumns.includes(b.field)) {
      return -1;
    }
    return 0;
  }).map((col) => ({
    ...col,
    type: setColumns.includes(col.field) ? 'boolean' : 'string',
  }));

  return (
    <Box
      sx={{
        minHeight: 550,
      }}
    >
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
};

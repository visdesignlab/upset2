import { Box } from '@mui/material';
import { DataGrid, GridRowsProp } from '@mui/x-data-grid';
import { Item } from '@visdesignlab/upset2-core';
import { FC, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { attributeAtom } from '../../atoms/attributeAtom';
import { selectedItemsSelector } from '../../atoms/elementsSelectors';

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
  const attributeColumns = useRecoilValue(attributeAtom);
  const elements = useRecoilValue(selectedItemsSelector);
  const rows = useRows(elements);
  const columns = useColumns(['_label', ...attributeColumns]);

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

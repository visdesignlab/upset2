import { Box } from '@mui/material';
import { DataGrid, GridRowsProp } from '@mui/x-data-grid';
import { Item } from '@visdesignlab/upset2-core';
import { FC, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { selectedItemsSelector } from '../../atoms/elementsSelectors';
import { setColumnsSelector } from '../../atoms/dataAtom';
import { dataAttributeSelector } from '../../atoms/attributeAtom';

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
  const setColumns = useRecoilValue(setColumnsSelector);
  return useMemo(() => columns.map((col) => {
    // Prefixed with _ since that's how the Item object is structured
    const displayName = col === '_id' ? 'ID' : col === '_label' ? 'Label' : col;
    return {
      field: col,
      headerName: displayName,
      type: setColumns.includes(col) ? 'boolean' : 'string',
      description: displayName,
    };
  }), [columns]);
}

/**
 * Table to display elements
 */
export const ElementTable: FC = () => {
  const attributeColumns = useRecoilValue(dataAttributeSelector);
  const elements = useRecoilValue(selectedItemsSelector);
  const rows = useRows(elements);
  const setColumns = useRecoilValue(setColumnsSelector);
  // Filtering out columns w/ _ removes metadata columns
  const columns = useColumns(['_label', ...([...attributeColumns, ...setColumns].filter((col) => !col.startsWith('_')))]);

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

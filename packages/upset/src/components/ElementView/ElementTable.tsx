import { Box } from '@mui/material';
import { DataGrid, GridRowsProp } from '@mui/x-data-grid';
import { Item } from '@visdesignlab/upset2-core';
import { FC, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { attributeAtom } from '../../atoms/attributeAtom';
import { elementSelector } from '../../atoms/elementsSelectors';

type Props = {
  id: string;
};

function useRows(items: Item[]): GridRowsProp {
  return useMemo(() => {
    const newItems: GridRowsProp = items.map((item) => ({
      ...item,
      id: item._id,
    }));

    return newItems;
  }, [items]);
}

function useColumns(columns: string[]) {
  return useMemo(() => {
    return columns.map((col) => ({
      field: col,
      headerName: col === '_id' ? 'ID' : col === '_label' ? 'Label' : col,
    }));
  }, [columns]);
}

export const ElementTable: FC<Props> = ({ id }) => {
  const attributeColumns = useRecoilValue(attributeAtom);
  const elements = useRecoilValue(elementSelector(id));
  const rows = useRows(elements);
  const columns = useColumns(['_id', '_label', ...attributeColumns]);

  return (
    <Box
      sx={{
        minHeight: 500,
      }}
    >
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
};

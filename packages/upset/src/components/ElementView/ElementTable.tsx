import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { attributeAtom } from '../../atoms/attributeAtom';
import { elementSelector } from '../../atoms/elementsSelectors';

type Props = {
  id: string;
};

export const ElementTable: FC<Props> = ({ id }) => {
  const attributeColumns = useRecoilValue(attributeAtom);

  const elements = useRecoilValue(elementSelector(id));

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Label</TableCell>
          {attributeColumns.map((col) => (
            <TableCell key={col}>{col}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {elements.map((el) => (
          <TableRow key={el._id}>
            <TableCell>{el._label}</TableCell>
            {attributeColumns.map((col) => (
              <TableCell key={col}>{el[col]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

import DownloadIcon from '@mui/icons-material/Download';
import {
  Divider, IconButton, Tooltip, Typography,
} from '@mui/material';
import { Item } from '@visdesignlab/upset2-core';
import { useRecoilValue } from 'recoil';

import { columnsAtom } from '../../atoms/columnAtom';
import {
  selectedElementSelector, selectedItemsCounter,
  selectedItemsSelector,
} from '../../atoms/elementsSelectors';
import { BookmarkChips } from './BookmarkChips';
import { ElementTable } from './ElementTable';
import { ElementVisualization } from './ElementVisualization';
import { QueryInterface } from './QueryInterface';
import { bookmarkSelector, currentIntersectionSelector } from '../../atoms/config/currentIntersectionAtom';
import { Sidebar } from '../custom/Sidebar';

/**
 * Props for the ElementSidebar component
 */
type Props = {
  /** Whether the sidebar is open */
  open: boolean,
  /** Function to close the sidebar */
  close: () => void
}

/**
 * Immediately downloads a csv containing items with the given columns
 * @param items Rows to download
 * @param columns Data attributes to download
 * @param name Name of the file
 */
function downloadElementsAsCSV(items: Item[], columns: string[], name: string) {
  if (items.length < 1 || columns.length < 1) return;

  const saveText: string[] = [];

  saveText.push(columns.map((h) => (h.includes(',') ? `"${h}"` : h)).join(','));

  items.forEach((item) => {
    const row: string[] = [];

    columns.forEach((col) => {
      row.push(item[col]?.toString() || '-');
    });

    saveText.push(row.map((r) => (r.includes(',') ? `"${r}"` : r)).join(','));
  });

  const blob = new Blob([saveText.join('\n')], { type: 'text/csv' });
  const blobUrl = URL.createObjectURL(blob);

  const anchor: any = document.createElement('a');
  anchor.style = 'display: none';
  document.body.appendChild(anchor);
  anchor.href = blobUrl;
  anchor.download = `${name}_${Date.now()}.csv`;
  anchor.click();
  anchor.remove();
}

/** @jsxImportSource @emotion/react */
/**
 * Sidebar component for the Element View
 * @param open Whether the sidebar is open
 * @param close Function to close the sidebar
 */
export const ElementSidebar = ({ open, close }: Props) => {
  const currentElementSelection = useRecoilValue(selectedElementSelector);
  const selectedItems = useRecoilValue(selectedItemsSelector);
  const itemCount = useRecoilValue(selectedItemsCounter);
  const columns = useRecoilValue(columnsAtom);
  const bookmarked = useRecoilValue(bookmarkSelector);
  const currentIntersection = useRecoilValue(currentIntersectionSelector);

  return (
    <Sidebar open={open} close={close}>
      <div style={{ marginBottom: '1em' }}>
        <Typography variant="h2" fontSize="1.4em" fontWeight="inherit" gutterBottom>
          Element View
        </Typography>
        <Divider />
      </div>
      {(bookmarked.length > 0 || currentIntersection || currentElementSelection) && (
        <>
          <Typography variant="h3" fontSize="1.2em">
            Bookmarked Queries
          </Typography>
          <Divider />
          <BookmarkChips />
        </>
      )}
      <Typography variant="h3" fontSize="1.2em">
        Element Visualization
      </Typography>
      <Divider />
      <ElementVisualization />
      <Typography variant="h3" fontSize="1.2em">
        Element Queries
      </Typography>
      <Divider />
      <QueryInterface />
      <Typography variant="h3" fontSize="1.2em">
        Query Result
        <Tooltip title={`Download ${itemCount} elements`}>
          <IconButton
            onClick={() => {
              downloadElementsAsCSV(
                selectedItems,
                columns,
                currentElementSelection?.label ?? 'upset_elements',
              );
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      <Divider />
      <ElementTable />
    </Sidebar>
  );
};

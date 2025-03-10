import DownloadIcon from '@mui/icons-material/Download';
import {
  Alert,
  IconButton, Tooltip,
} from '@mui/material';
import { Item } from '@visdesignlab/upset2-core';
import { useRecoilValue } from 'recoil';

import { useCallback, useMemo, useState } from 'react';
import AddchartIcon from '@mui/icons-material/Addchart';
import { columnsAtom } from '../../atoms/columnAtom';
import {
  elementSelectionSelector, selectedItemsCounter,
  selectedOrBookmarkedItemsSelector,
} from '../../atoms/elementsSelectors';
import { BookmarkChips } from './BookmarkChips';
import { ElementTable } from './ElementTable';
import { ElementVisualization } from './ElementVisualization';
import { QueryInterface } from './QueryInterface';
import { bookmarkSelector, currentIntersectionSelector } from '../../atoms/config/currentIntersectionAtom';
import { Sidebar } from '../custom/Sidebar';
import { UpsetHeading } from '../custom/theme/heading';
import { AddPlotDialog } from './AddPlotDialog';

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

/**
 * Sidebar component for the Element View
 * @param open Whether the sidebar is open
 * @param close Function to close the sidebar
 */
export const ElementSidebar = ({ open, close }: Props) => {
  const [openAddPlot, setOpenAddPlot] = useState(false);
  const currentElementSelection = useRecoilValue(elementSelectionSelector);
  const selectedItems = useRecoilValue(selectedOrBookmarkedItemsSelector);
  const itemCount = useRecoilValue(selectedItemsCounter);
  const columns = useRecoilValue(columnsAtom);
  const bookmarked = useRecoilValue(bookmarkSelector);
  const currentIntersection = useRecoilValue(currentIntersectionSelector);

  /** Whether to show the 'Element Queries' section */
  const showQueries = useMemo(
    () => bookmarked.length > 0 || currentIntersection || currentElementSelection,
    [bookmarked.length, currentIntersection, currentElementSelection],
  );

  /**
   * Closes the AddPlotDialog
   */
  const onClose = useCallback(() => setOpenAddPlot(false), [setOpenAddPlot]);

  return (
    <Sidebar
      open={open}
      close={close}
      label="Element View Sidebar"
      title="Element View"
      buttons={
        <Tooltip title="Add Plot">
          <IconButton onClick={() => setOpenAddPlot(true)}>
            <AddchartIcon />
          </IconButton>
        </Tooltip>
      }
    >
      <UpsetHeading level="h3">
        Selections
      </UpsetHeading>
      {!showQueries && (
        <Alert severity="info" style={{ paddingTop: '2px', paddingBottom: '2px' }}>
          Selected intersections and elements will appear here.
        </Alert>
      )}
      <BookmarkChips />
      <ElementVisualization />
      <AddPlotDialog open={openAddPlot} onClose={onClose} />
      <UpsetHeading level="h2" divStyle={{ marginTop: '1em' }}>
        Element Queries
      </UpsetHeading>
      <QueryInterface />
      <UpsetHeading level="h2" divStyle={{ marginTop: '1em' }}>
        Query Result
        <Tooltip title={`Download ${itemCount} elements`}>
          <IconButton
            onClick={() => {
              downloadElementsAsCSV(
                selectedItems,
                columns,
                'upset_elements',
              );
            }}
            // This needs to stay shorter than the h2 text or the divider spacing gets off
            style={{ height: '1.2em' }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </UpsetHeading>
      <ElementTable />
    </Sidebar>
  );
};

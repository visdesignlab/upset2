import DownloadIcon from '@mui/icons-material/Download';
import {
  Alert,
  IconButton, Tooltip,
  Typography,
} from '@mui/material';
import { Item, querySelectionToString, vegaSelectionToString } from '@visdesignlab/upset2-core';
import { useRecoilValue } from 'recoil';

import { useCallback, useMemo, useState } from 'react';
import AddchartIcon from '@mui/icons-material/Addchart';
import { columnsAtom } from '../../atoms/columnAtom';
import {
  selectedItemsCounter,
  selectedOrBookmarkedItemsSelector,
} from '../../atoms/elementsSelectors';
import { BookmarkChips } from './SelectionChips';
import { ElementTable } from './ElementTable';
import { ElementVisualization } from './ElementVisualization';
import { QueryInterface } from './QueryInterface';
import {
  bookmarkSelector, currentIntersectionSelector, currentQuerySelection, currentSelectionType, currentVegaSelection,
} from '../../atoms/config/selectionAtoms';
import { Sidebar } from '../custom/Sidebar';
import { UpsetHeading } from '../custom/theme/heading';
import { AddPlotDialog } from './AddPlotDialog';
import { totalItemsSelector } from '../../atoms/dataAtom';
import { HelpCircle } from '../custom/HelpCircle';

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
  const vegaSelection = useRecoilValue(currentVegaSelection);
  const querySelection = useRecoilValue(currentQuerySelection);
  const selectionType = useRecoilValue(currentSelectionType);
  const selectedItems = useRecoilValue(selectedOrBookmarkedItemsSelector);
  const itemCount = useRecoilValue(selectedItemsCounter);
  const totalItemCount = useRecoilValue(totalItemsSelector);
  const columns = useRecoilValue(columnsAtom);
  const bookmarked = useRecoilValue(bookmarkSelector);
  const currentIntersection = useRecoilValue(currentIntersectionSelector);

  /** Whether to show the alert message when no bookmark/selection chips are present */
  const showEmptyAlert = useMemo(
    () => bookmarked.length > 0 || currentIntersection || vegaSelection || querySelection,
    [bookmarked.length, currentIntersection, vegaSelection, querySelection],
  );

  /**
   * Closes the AddPlotDialog
   */
  const onClose = useCallback(() => setOpenAddPlot(false), [setOpenAddPlot]);

  const tableHelpText = useMemo(() => {
    if (selectionType === 'vega' && vegaSelection) {
      return `Currently showing elements in visible intersections matching the selection "${vegaSelectionToString(vegaSelection)}."`;
    }
    if (selectionType === 'query' && querySelection) {
      return `Currently showing elements in visible intersections matching the query "${querySelectionToString(querySelection)}."`;
    }
    if (bookmarked.length > 0) {
      return `Currently showing elements in the ${bookmarked.length} bookmarked intersections${currentIntersection ? ' and the selected intersection' : ''}.`;
    }
    if (currentIntersection) {
      return `Currently showing elements in the selected intersection ${currentIntersection.elementName}.`;
    }
    return 'Currently showing all elements in visible intersections.';
  }, [selectionType, vegaSelection, querySelection, bookmarked, currentIntersection]);

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
      {!showEmptyAlert && (
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
        Element Table
        <Typography display="inline" variant="caption" style={{ marginLeft: '0.5em' }}>
          {`${itemCount} of ${totalItemCount} elements`}
        </Typography>
        {/* Size 21 causes the icon to visually match the size of the download icon.
            Additionally, margin & padding move the whole row, so relative positioning is necessary */}
        <HelpCircle text={tableHelpText} style={{ float: 'right', position: 'relative', bottom: '1px' }} size={21} />
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
            style={{ height: '1.2em', float: 'right' }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </UpsetHeading>
      <ElementTable />
    </Sidebar>
  );
};

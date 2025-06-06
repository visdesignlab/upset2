import DownloadIcon from '@mui/icons-material/Download';
import { Alert, Box, IconButton, Tooltip, Typography } from '@mui/material';
import {
  Item,
  querySelectionToString,
  vegaSelectionToString,
} from '@visdesignlab/upset2-core';
import { useRecoilValue } from 'recoil';

import { useCallback, useMemo, useState } from 'react';
import AddchartIcon from '@mui/icons-material/Addchart';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { columnsAtom } from '../../atoms/columnAtom';
import {
  selectedItemsCounter,
  selectedOrBookmarkedItemsSelector,
} from '../../atoms/elementsSelectors';
import { SelectionChips } from './SelectionChips';
import { ElementTable } from './ElementTable';
import { ElementVisualization } from './ElementVisualization';
import { QueryInterface } from './QueryInterface';
import {
  bookmarkSelector,
  currentIntersectionSelector,
  currentQuerySelection,
  currentSelectionType,
  currentVegaSelection,
} from '../../atoms/config/selectionAtoms';
import { Sidebar } from '../custom/Sidebar';
import { UpsetHeading } from '../custom/theme/heading';
import { AddPlotDialog } from './AddPlotDialog';
import { totalItemsSelector } from '../../atoms/dataAtom';
import { HelpCircle } from '../custom/HelpCircle';
import { dataAttributeSelector } from '../../atoms/attributeAtom';

/**
 * Props for the ElementSidebar component
 */
type Props = {
  /** Whether the sidebar is open */
  open: boolean;
  /** Function to close the sidebar */
  close: () => void;
};

/** Default vertical margin between elements */
const DEFAULT_SPACING = '0.5em';

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
  const [queryOpen, setQueryOpen] = useState(false);
  const atts = useRecoilValue(dataAttributeSelector);

  /** Whether the bookmark chips are empty */
  const haveChips = useMemo(
    () => bookmarked.length > 0 || currentIntersection || vegaSelection || querySelection,
    [bookmarked.length, currentIntersection, vegaSelection, querySelection],
  );

  /** Whether this data has any attributes */
  const haveAtts = useMemo(() => atts.length > 0, [atts.length]);

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
    if (selectionType === 'row' && currentIntersection) {
      return `Currently showing elements in the selected intersection ${currentIntersection.elementName}.`;
    }
    return 'Currently showing all elements in visible intersections.';
  }, [selectionType, vegaSelection, querySelection, currentIntersection]);

  return (
    <Sidebar
      open={open}
      close={close}
      label="Element View Sidebar"
      title="Element View"
      buttons={
        <>
          <Tooltip title="Add plot">
            <IconButton onClick={() => setOpenAddPlot(true)} disabled={!haveAtts}>
              <AddchartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={`${queryOpen ? 'Hide' : 'Show'} element query`}>
            <IconButton
              onClick={() => {
                setQueryOpen(!queryOpen);
              }}
              disabled={!haveAtts}
            >
              <ManageSearchIcon />
            </IconButton>
          </Tooltip>
        </>
      }
    >
      <Box
        height={queryOpen ? 140 : 0}
        overflow="hidden"
        style={{
          transition: 'height 0.2s ease-in-out',
          marginBottom: queryOpen ? DEFAULT_SPACING : 0,
        }}
      >
        <QueryInterface />
      </Box>
      {!haveChips && (
        <Alert severity="info" style={{ paddingTop: '2px', paddingBottom: '2px' }}>
          Selected intersections and elements will appear here.
        </Alert>
      )}
      <SelectionChips />
      <Box height={DEFAULT_SPACING} />
      <ElementVisualization />
      <AddPlotDialog open={openAddPlot} onClose={onClose} />
      <UpsetHeading level="h2" divStyle={{ marginTop: '1em' }}>
        Element Table
        <Typography display="inline" variant="caption" style={{ marginLeft: '0.5em' }}>
          {`${itemCount} of ${totalItemCount} elements`}
        </Typography>
        {/* Size 21 causes the icon to visually match the size of the download icon.
            Additionally, margin & padding move the whole row, so relative positioning is necessary */}
        <HelpCircle
          text={tableHelpText}
          style={{ float: 'right', position: 'relative', bottom: '1px' }}
          size={21}
        />
        <Tooltip title={`Download ${itemCount} elements`}>
          <IconButton
            onClick={() => {
              downloadElementsAsCSV(selectedItems, columns, 'upset_elements');
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

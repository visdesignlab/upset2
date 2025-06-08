import { Backdrop, Box, Button, CircularProgress } from '@mui/material';
import { AccessibleDataEntry, CoreUpsetData } from '@visdesignlab/upset2-core';
import { useEffect, useMemo, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { getAccessibleData } from '@visdesignlab/upset2-react';
import DownloadIcon from '@mui/icons-material/Download';
import localforage from 'localforage';
import { useRecoilValue } from 'recoil';
import { rowsSelector } from '../atoms/selectors';

const downloadCSS = {
  m: '4px',
  height: '40%',
};

const headerCSS = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  m: '2px',
};

/**
 * Represents the columns configuration for the data table.
 */
const setColumns: GridColDef[] = [
  /**
   * Represents the column for the set name.
   */
  {
    field: 'setName',
    headerName: 'Set',
    width: 250,
    editable: false,
    description: 'The name of the set.',
  },
  /**
   * Represents the column for the set size.
   */
  {
    field: 'size',
    headerName: 'Size',
    width: 250,
    editable: false,
    description: 'The number of elements within the set.',
  },
];

/**
 * Data for a row in the data table.
 * @private to show up correctly in the DataGrid component, this must be a flat
 */
type RowData = {
  id: string;
  elementName: string;
  size: number;
} & Record<string, string | number | undefined>;

/**
 * Converts an AccessibleDataEntry object into a row data object.
 * @param row - The AccessibleDataEntry object to convert.
 * @param precision - The number of decimal places to round numeric values to (default is 2).
 * @returns The converted row data object.
 */
function getRowData(row: AccessibleDataEntry, precision: number = 2): RowData {
  const name = `${row.type === 'Aggregate' ? 'Aggregate: ' : ''}${row.elementName.replaceAll('~&~', ' & ')}`;
  const retVal = {
    ...Object.fromEntries(
      Object.entries(row.attributes).map(([key, value]) => [
        key,
        typeof value === 'number'
          ? value.toFixed(precision)
          : (value.mean?.toFixed(precision) ?? 0),
      ]),
    ),
    id: row.id ?? name,
    elementName: name,
    size: row.size,
  };

  return retVal;
}

/**
 * Retrieves the aggregated rows from the given row of accessible data.
 * @param row - The row of accessible data.
 * @returns An array of aggregated row data.
 */
function getAggRows(row: AccessibleDataEntry): RowData[] {
  const retVal: RowData[] = [];
  if (row.rows === undefined) return retVal;

  Object.values(row.rows).forEach((r: AccessibleDataEntry) => {
    retVal.push(getRowData(r));

    if (r.type === 'Aggregate') {
      retVal.push(...getAggRows(r));
    }
  });

  return retVal;
}

/**
 * Generates a CSV file and downloads it.
 *
 * @param items - The array of items to be downloaded.
 * @param columns - The array of column names.
 * @param name - The name of the CSV file.
 */
function downloadElementsAsCSV(items: GridRowsProp, columns: string[], name: string) {
  if (items.length < 1 || columns.length < 1) return;

  const saveText: string[] = [];

  saveText.push(columns.map((h) => (h.includes(',') ? `"${h}"` : h)).join(','));

  items.forEach((item) => {
    const row: string[] = [];
    columns.forEach((col) => row.push(item[col]?.toString() || '-'));
    saveText.push(row.map((r) => (r.includes(',') ? `"${r}"` : r)).join(','));
  });

  const blob = new Blob([saveText.join('\n')], { type: 'text/csv' });
  const blobUrl = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.style = 'display: none';
  document.body.appendChild(anchor);
  anchor.href = blobUrl;
  anchor.download = `${name}_${Date.now()}.csv`;
  anchor.click();
  anchor.remove();
}

/**
 * Props for the DownloadButton component.
 */
type DownloadButtonProps = {
  // The click event handler function for the button.
  onClick: () => void;
};

/**
 * DownloadButton component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onClick - The click event handler for the button.
 * @returns {JSX.Element} The DownloadButton component.
 */
const DownloadButton = ({ onClick }: DownloadButtonProps) => (
  <Button
    sx={downloadCSS}
    color="info"
    size="medium"
    variant="contained"
    disableElevation
    onClick={onClick}
    endIcon={<DownloadIcon />}
  >
    Download
  </Button>
);

/**
 * Renders a data table component that displays intersection data, visible sets, and hidden sets.
 * The component fetches data from local storage and populates the table with the retrieved data.
 * If there is an error fetching the data, an error message is displayed.
 *
 * @returns The DataTable component.
 */
export const DataTable = () => {
  const [data, setData] = useState<CoreUpsetData | null>(null);
  const flatRows = useRecoilValue(rowsSelector);
  const [visibleSets, setVisibleSets] = useState<string[] | null>(null);
  const [hiddenSets, setHiddenSets] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(() => getAccessibleData(flatRows, true), [flatRows]);

  /**
   * Fetches data from local storage and sets the state variables.
   * If the data is not found in local storage, an error message is displayed.
   */
  useEffect(() => {
    setLoading(true);
    Promise.all([
      localforage.getItem('data'),
      localforage.getItem('rows'),
      localforage.getItem('visibleSets'),
      localforage.getItem('hiddenSets'),
    ])
      .then(([storedData, storedRows, storedVisibleSets, storedHiddenSets]) => {
        if (
          storedData === null ||
          storedRows === null ||
          storedVisibleSets === null ||
          storedHiddenSets === null
        ) {
          console.error('Data not found in local storage');
          setError('Error: Data not found in local storage');
        } else {
          setData(storedData as CoreUpsetData);
          setVisibleSets(storedVisibleSets as string[]);
          setHiddenSets(storedHiddenSets as string[]);
        }
      })
      .catch((e) => {
        setError(`Error: ${e}`);
      });
    setLoading(false);
  }, []);

  /**
   * Generates an array of data columns for the data table.
   * Each column object contains information such as field name, header name, width, and description.
   * It iterates through the rows and adds any missing attribute columns to the array.
   *
   * @param rows - The rows of data for the table.
   * @returns An array of data columns for the data table.
   */
  const dataColumns: GridColDef[] = useMemo(() => {
    const cols = [
      {
        field: 'elementName',
        headerName: 'Intersection',
        width: 350,
        editable: false,
        description: 'The name of the intersection of sets.',
      },
      {
        field: 'size',
        headerName: 'Size',
        width: 150,
        editable: false,
        description: 'The number of intersections within the subset or aggregate.',
      },
      {
        field: 'deviation',
        headerName: 'Deviation',
        width: 150,
        editable: false,
        description: 'The deviation of the intersection from the expected value.',
      },
    ];

    // add the attributes to the dataColumns object
    if (rows) {
      Object.values(rows.values).forEach((r: AccessibleDataEntry) => {
        for (const key in r.attributes) {
          if (!cols.find((m) => m.field === key)) {
            // skip deviation and degree. Deviation is added above and degree is not needed in the table
            if (key === 'deviation' || key === 'degree') continue;
            cols.push({
              field: key,
              headerName: key,
              width: 150,
              editable: false,
              description: `Attribute: ${key}`,
            });
          }
        }
      });
    }

    return cols;
  }, [rows]);

  /**
   * Returns an array of table rows based on the provided data.
   * If the rows are null, an empty array is returned.
   * For each row, it calls the `getRowData` function to get the row data.
   * If a row has a type of "Aggregate", it also adds additional rows using the `getAggRows` function.
   *
   * @param rows - The data rows to generate the table rows from.
   * @returns An array of table rows.
   */
  const tableRows: RowData[] = useMemo(() => {
    if (rows === null) {
      return [];
    }

    const retVal: RowData[] = [];

    Object.values(rows.values).forEach((r: AccessibleDataEntry) => {
      retVal.push(getRowData(r));

      if (r.type === 'Aggregate') {
        retVal.push(...getAggRows(r));
      }
    });

    return retVal;
  }, [rows]);

  console.log('tableRows', tableRows);

  /**
   * Retrieves an array of objects containing information about the sets.
   * Each object includes the set name and its corresponding size.
   *
   * @param sets - An array of set names.
   * @param data - An object containing the data for the sets.
   * @returns An array of objects with the set name and size.
   */
  function getSetRows(sets: string[], data: CoreUpsetData): GridRowsProp {
    const retVal = sets.map((s: string) => {
      const name = s.replace('Set_', '');
      return {
        id: s,
        setName: name,
        size: data.sets[s].size,
        elementName: name,
      };
    });

    return retVal;
  }

  /**
   * Returns an array of visible set rows.
   *
   * @param visibleSets - The array of visible sets.
   * @param data - The data used to generate the set rows.
   * @returns An array of objects representing the visible set rows.
   */
  const visibleSetRows: GridRowsProp = useMemo(() => {
    if (visibleSets === null || data === null) {
      return [];
    }

    return getSetRows(visibleSets, data);
  }, [visibleSets, data]);

  /**
   * Calculates the hidden set rows based on the provided hidden sets and data.
   * @param hiddenSets - The hidden sets.
   * @param data - The data.
   * @returns An array of objects containing the set name and size.
   */
  const hiddenSetRows: GridRowsProp = useMemo(() => {
    if (hiddenSets === null || data === null) {
      return [];
    }

    return getSetRows(hiddenSets, data);
  }, [hiddenSets, data]);

  return (
    <>
      {error ? (
        <h1>{error}</h1>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Backdrop open={loading} style={{ zIndex: 1000 }}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Box sx={{ width: '50%', margin: '20px' }}>
            <div style={headerCSS}>
              <h2>Intersection Data</h2>
              <DownloadButton
                onClick={() =>
                  downloadElementsAsCSV(
                    tableRows,
                    dataColumns.map((m) => m.field),
                    'upset2_intersection_data',
                  )
                }
              />
            </div>
            <DataGrid
              columns={dataColumns}
              rows={tableRows}
              autoHeight
              disableSelectionOnClick
              initialState={{
                pagination: {
                  // @ts-expect-error page is necessary, not sure why it's not in the type
                  page: 0,
                  pageSize: 10,
                },
              }}
              paginationMode="client"
              rowsPerPageOptions={[5, 10, 20]}
            />
          </Box>
          <Box sx={{ width: '25%', margin: '20px' }}>
            <div style={headerCSS}>
              <h2>Visible Sets</h2>
              <DownloadButton
                onClick={() =>
                  downloadElementsAsCSV(
                    visibleSetRows,
                    ['setName', 'size'],
                    'upset2_visiblesets_table',
                  )
                }
              />
            </div>
            <DataGrid
              columns={setColumns}
              rows={visibleSetRows}
              autoHeight
              disableSelectionOnClick
              initialState={{
                pagination: {
                  // @ts-expect-error page is necessary, not sure why it's not in the type
                  page: 0,
                  pageSize: 10,
                },
              }}
              paginationMode="client"
              rowsPerPageOptions={[5, 10, 20]}
            />
          </Box>
          <Box sx={{ width: '25%', margin: '20px' }}>
            <div style={headerCSS}>
              <h2>Hidden Sets</h2>
              <DownloadButton
                onClick={() =>
                  downloadElementsAsCSV(
                    hiddenSetRows,
                    ['setName', 'size'],
                    'upset2_hiddensets_table',
                  )
                }
              />
            </div>
            <DataGrid
              columns={setColumns}
              rows={hiddenSetRows}
              autoHeight
              disableSelectionOnClick
              initialState={{
                pagination: {
                  // @ts-expect-error page is necessary, not sure why it's not in the type
                  page: 0,
                  pageSize: 10,
                },
              }}
              paginationMode="client"
              rowsPerPageOptions={[5, 10, 20]}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

import { Box, Button } from "@mui/material"
import { CoreUpsetData, Row, Rows, isRowAggregate } from "@visdesignlab/upset2-core";
import { useMemo } from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const getRowData = (row: Row) => {
    return {id: row.id, elementName: `${(isRowAggregate(row)) ? "Aggregate: " : ""}${row.elementName}`, size: row.size}
}

const getAggRows = (row: Row) => {
    const retVal: ReturnType<typeof getRowData>[] = [];

    Object.values(row.items.values).forEach((r: Row) => {
        retVal.push(getRowData(r));

        if (isRowAggregate(r)) {
            retVal.push(...getAggRows(r));
        }
    });

    return retVal;
}

function downloadElementsAsCSV(items: any[], columns: string[], name: string) {
    if (items.length < 1 || columns.length < 1) return;
  
    console.group(name);
    console.log(columns);
    console.table(items.filter((_, idx) => idx < 10));
  
    const saveText: string[] = [];
  
    saveText.push(columns.map(h => (h.includes(',') ? `"${h}"` : h)).join(','));
  
    items.forEach(item => {
      const row: string[] = [];
  
      columns.forEach(col => {
        row.push(item[col]?.toString() || '-');
      });
  
      saveText.push(row.map(r => (r.includes(',') ? `"${r}"` : r)).join(','));
    });
  
    console.log(saveText);
    console.groupEnd();
  
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

export const DataTable = () => {
    const storedData = localStorage.getItem("data");
    const storedRows = localStorage.getItem("rows");
    const storedVisibleSets = localStorage.getItem("visibleSets");
    const storedHiddenSets = localStorage.getItem("hiddenSets");

    const data = storedData ? JSON.parse(storedData) as CoreUpsetData : null;
    const rows = storedRows ? JSON.parse(storedRows) as Rows : null;
    const visibleSets = storedVisibleSets ? JSON.parse(storedVisibleSets) as string[] : null;
    const hiddenSets = storedHiddenSets ? JSON.parse(storedHiddenSets) as string[] : null;

    // fetch subset data and create row objects with subset name and cardinality
    const tableRows: ReturnType<typeof getRowData>[] = useMemo(() => {
        if (rows === null) {
            return [];
        }

        const retVal: ReturnType<typeof getRowData>[] = [];
        
        Object.values(rows.values).forEach((r: Row) => {
            retVal.push(getRowData(r));

            if (isRowAggregate(r)) {
                retVal.push(...getAggRows(r));
            }
        });

        return retVal;
    
    }, [rows]);

    const getSetRows = (sets: string[], data: CoreUpsetData) => {
        const retVal: {setName: string, size: number}[] = [];
        retVal.push(...sets.map((s: string) => {
            return {id: s, setName: s, size: data.sets[s].size};
        }));

        return retVal;
    }

    const visibleSetRows: {setName: string, size: number}[] = useMemo(() => {
        if (visibleSets === null || data === null) {
            return [];
        }

        return getSetRows(visibleSets, data);
    }, [visibleSets, data]);

    const hiddenSetRows: {setName: string, size: number}[] = useMemo(() => {
        if (hiddenSets === null || data === null) {
            return [];
        }

        return getSetRows(hiddenSets, data);
    }, [hiddenSets, data]);

    const dataColumns: GridColDef[] = [
        {
          field: 'elementName',
          headerName: 'Intersection',
          width: 250,
          editable: false,
          description: 'The name of the intersection of sets.',
        },
        {
          field: 'size',
          headerName: 'Size',
          width: 250,
          editable: false,
          description: 'The number of intersections within the subset or aggregate.'
        },
    ]

    const setColumns: GridColDef[] = [
        {
            field: 'setName',
            headerName: 'Set',
            width: 250,
            editable: false,
            description: 'The name of the set.'
        },
        {
            field: 'size',
            headerName: 'Size',
            width: 250,
            editable: false,
            description: 'The number of elements within the set.'
        }
    ]

    if (data === null) {
        return null;
    }

    return (
        <>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Box sx={{width: "50%", margin: "20px"}}>
                    <h2>UpSet Data Table</h2>
                    <DataGrid
                        columns={dataColumns}
                        rows={tableRows}
                        autoHeight
                        disableSelectionOnClick
                        initialState={{
                            pagination: {
                                page: 0,
                                pageSize: 10,
                            },
                        }}
                        paginationMode="client"
                        rowsPerPageOptions={[5, 10, 20]}
                    ></DataGrid>
                    <div style={{display: "flex", justifyContent: "flex-end", margin: "10px"}}>
                        <Button sx={{ margin: "4px", marginRight: "12px" }} color="primary" size="medium" variant="outlined" onClick={() => downloadElementsAsCSV(tableRows, ["elementName", "size"], "upset2_datatable")}>
                            Download
                        </Button>
                    </div>
                </Box>
                <Box sx={{width: "30%", margin: "20px"}}>
                    <h2>Visible Sets</h2>
                    <DataGrid
                        columns={setColumns}
                        rows={visibleSetRows}
                        autoHeight
                        disableSelectionOnClick
                        initialState={{
                            pagination: {
                                page: 0,
                                pageSize: 10,
                            },
                        }}
                        paginationMode="client"
                        rowsPerPageOptions={[5, 10, 20]}
                    ></DataGrid>
                    <div style={{display: "flex", justifyContent: "flex-end", margin: "10px"}}>
                        <Button sx={{ margin: "4px", marginRight: "12px" }} color="primary" size="medium" variant="outlined" onClick={() => downloadElementsAsCSV(visibleSetRows, ["setName", "size"], "upset2_visiblesets_table")}>
                            Download
                        </Button>
                    </div>
                </Box>
                <Box sx={{width: "30%", margin: "20px"}}>
                    <h2>Hidden Sets</h2>
                    <DataGrid
                        columns={setColumns}
                        rows={hiddenSetRows}
                        autoHeight
                        disableSelectionOnClick
                        initialState={{
                            pagination: {
                                page: 0,
                                pageSize: 10,
                            },
                        }}
                        paginationMode="client"
                        rowsPerPageOptions={[5, 10, 20]}
                    ></DataGrid>
                    <div style={{display: "flex", justifyContent: "flex-end", margin: "10px"}}>
                        <Button sx={{ margin: "4px", marginRight: "12px" }} color="primary" size="medium" variant="outlined" onClick={() => downloadElementsAsCSV(hiddenSetRows, ["setName", "size"], "upset2_hiddensets_table")}>
                            Download
                        </Button>
                    </div>
                </Box>
            </Box>
        </>
    )   
}
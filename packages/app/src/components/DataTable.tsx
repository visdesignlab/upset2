import { Box, Button } from "@mui/material"
import { AccessibleDataEntry, CoreUpsetData } from "@visdesignlab/upset2-core";
import { useMemo } from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getAccessibleData } from "@visdesignlab/upset2-react";
import DownloadIcon from '@mui/icons-material/Download';

const getRowData = (row: AccessibleDataEntry) => {
    return {id: row.id, elementName: `${(row.type === "Aggregate") ? "Aggregate: " : ""}${row.elementName}`, size: row.size}
}

const getAggRows = (row: AccessibleDataEntry) => {
    const retVal: ReturnType<typeof getRowData>[] = [];
    if (row.items === undefined) return retVal;

    Object.values(row.items).forEach((r: AccessibleDataEntry) => {
        retVal.push(getRowData(r));

        if (r.type === "Aggregate") {
            console.log("is agg")
            retVal.push(...getAggRows(r));
        }
    });

    return retVal;
}

const downloadCSS = {
    m: "4px",
    height: "40%",
}

const headerCSS = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    m: "2px"
}

function downloadElementsAsCSV(items: any[], columns: string[], name: string) {
    if (items.length < 1 || columns.length < 1) return;
  
    const saveText: string[] = [];
  
    saveText.push(columns.map(h => (h.includes(',') ? `"${h}"` : h)).join(','));
  
    items.forEach(item => {
      const row: string[] = [];
  
      columns.forEach(col => {
        row.push(item[col]?.toString() || '-');
      });
  
      saveText.push(row.map(r => (r.includes(',') ? `"${r}"` : r)).join(','));
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

type DownloadButtonProps = {
    onClick: () => void;
}

const DownloadButton = ({onClick}: DownloadButtonProps) => {
    return (
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
    )
}

export const DataTable = () => {
    const storedData = localStorage.getItem("data");
    const storedRows = localStorage.getItem("rows");
    const storedVisibleSets = localStorage.getItem("visibleSets");
    const storedHiddenSets = localStorage.getItem("hiddenSets");

    const data = storedData ? JSON.parse(storedData) as CoreUpsetData : null;
    const rows = storedRows ? JSON.parse(storedRows) as ReturnType<typeof getAccessibleData> : null;
    const visibleSets = storedVisibleSets ? JSON.parse(storedVisibleSets) as string[] : null;
    const hiddenSets = storedHiddenSets ? JSON.parse(storedHiddenSets) as string[] : null;

    // fetch subset data and create row objects with subset name and size
    const tableRows: ReturnType<typeof getRowData>[] = useMemo(() => {
        if (rows === null) {
            return [];
        }

        const retVal: ReturnType<typeof getRowData>[] = [];
        
        Object.values(rows.values).forEach((r: AccessibleDataEntry) => {
            retVal.push(getRowData(r));

            if (r.type === "Aggregate") {
                retVal.push(...getAggRows(r));
            }
        });

        return retVal;
    
    }, [rows]);

    const getSetRows = (sets: string[], data: CoreUpsetData) => {
        const retVal: {setName: string, size: number}[] = [];
        retVal.push(...sets.map((s: string) => {
            return {id: s, setName: s.replace('Set_', ''), size: data.sets[s].size};
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
          width: 350,
          editable: false,
          description: 'The name of the intersection of sets.',
        },
        {
          field: 'size',
          headerName: 'Size',
          width: 150,
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
                    <div style={headerCSS}>
                        <h2>UpSet Data Table</h2>
                        <DownloadButton onClick={() => downloadElementsAsCSV(tableRows, ["elementName", "size"], "upset2_datatable")} />
                    </div>
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
                </Box>
                <Box sx={{width: "25%", margin: "20px"}}>
                    <div style={headerCSS}>
                        <h2>Visible Sets</h2>
                        <DownloadButton onClick={() => downloadElementsAsCSV(visibleSetRows, ["setName", "size"], "upset2_visiblesets_table")} />
                    </div>
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
                </Box>
                <Box sx={{width: "25%", margin: "20px"}}>
                    <div style={headerCSS}>
                        <h2>Hidden Sets</h2>
                        <DownloadButton onClick={() => downloadElementsAsCSV(hiddenSetRows, ["setName", "size"], "upset2_hiddensets_table")} />
                    </div>
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
                </Box>
            </Box>
        </>
    )   
}
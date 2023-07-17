import { Button } from "@mui/material"
import { CoreUpsetData, Row, Rows, isRowAggregate } from "@visdesignlab/upset2-core";
import { useMemo } from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const getRowData = (row: Row) => {
    return {id: row.id, elementName: `${(isRowAggregate(row)) ? "Aggregate: " : ""}${row.elementName}`, cardinality: row.size}
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

    const data = storedData ? JSON.parse(storedData) as CoreUpsetData : null;
    const rows = storedRows ? JSON.parse(storedRows) as Rows : null;

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

    const columns: GridColDef[] = [
        {
          field: 'elementName',
          headerName: 'Subset',
          width: 250,
          editable: false,
        },
        {
          field: 'cardinality',
          headerName: 'Cardinality',
          width: 250,
          editable: false,
        },
    ]

    if (data === null) {
        return null;
    }

    return (
        <>
            <DataGrid
                columns={columns}
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
                <Button sx={{ margin: "4px", marginRight: "12px" }} color="primary" size="medium" variant="outlined" onClick={() => downloadElementsAsCSV(tableRows, ["elementName", "cardinality"], "upset2_datatable")}>
                    Download
                </Button>
                {/* <Button sx={{ margin: "4px" }} color="inherit" size="medium" variant="outlined" onClick={props.close}>Close</Button> */}
            </div>
        </>
    )   
}
import { Button, Dialog } from "@mui/material"
import { useRecoilValue } from "recoil";
import { dataSelector } from "../atoms/dataAtom";
import { Row, getRows, isRowAggregate } from "@visdesignlab/upset2-core";
import { useContext, useMemo } from "react";
import { ProvenanceContext } from "./Root";
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const getRowData = (row: Row) => {
    return {id: row.id, elementName: `${(isRowAggregate(row)) ? "Aggregate: " : ""}${row.elementName}`, cardinality: row.size}
}

export const DataTable = (props: {close: () => void}) => {
    const { provenance } = useContext(ProvenanceContext);

    const data = useRecoilValue(dataSelector);
    const processedRows = getRows(data, provenance.getState());
    
    // fetch subset data and create row objects with subset name and cardinality
    const tableRows: ReturnType<typeof getRowData>[] = useMemo(() => {
        const retVal: ReturnType<typeof getRowData>[] = [];
        
        Object.values(processedRows.values).forEach((r: Row) => {
            retVal.push(getRowData(r));
            if (isRowAggregate(r)) {
                Object.values(r.items.values).forEach((row: Row) => {
                    retVal.push(getRowData(row));
                });
            }
        });

        return retVal;
    
    }, [processedRows]);

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

    return (
        <Dialog
            open={true}
            onClose={props.close}
            fullWidth
            sx={{height: "100%", width: "100%"}}
        >
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
                <Button color="inherit" size="medium" variant="outlined" onClick={props.close}>Close</Button>
            </div>
        </Dialog>
    )   
}
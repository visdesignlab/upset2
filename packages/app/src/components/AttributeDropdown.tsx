import { 
    // Checkbox, 
    // ListItemButton, 
    // ListItemIcon, 
    // ListItemText, 
    Button, 
    Box, 
    Menu,
    // List,
    // ListItem,
    // Table,
    // TableCell,
    // TableHead,
    // TableRow,
    // TableBody
} from "@mui/material"
import { useContext } from "react"
import { ProvenanceContext } from "./Root"
import { dataSelector } from "../atoms/dataAtom";
import { useRecoilValue } from "recoil";
import { useState } from "react";
import { CoreUpsetData } from "@visdesignlab/upset2-core";
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const getAttributeItemCount = (attribute: string, data: CoreUpsetData) => {
    let count = 0;

    Object.values(data.items).forEach((item) => {
        Object.entries(item).forEach(([key, val]) => {
            if (key === attribute) {
                if (val) {
                    count++;
                }
            }
        })
    })

    return count;
}

export const AttributeDropdown = (props: {anchorEl: HTMLElement, close: () => void}) => {
    const { provenance, actions } = useContext(ProvenanceContext);
    const data = useRecoilValue(dataSelector);
    const [ checked, setChecked ] = useState<any[]>(
        (data) ?
            provenance.getState().visibleAttributes.map(
                (attr) => data?.attributeColumns.indexOf(attr)
            ):
            []
    );

    const attributeItemCount: { [attr: string]: number } = {};

    data?.attributeColumns.forEach((attr) => {
        attributeItemCount[attr] = getAttributeItemCount(attr,data);
    })

    // const handleToggle = (attr: string) => {
    //     const currentIndex = checked.indexOf(attr);
    //     const newChecked = [...checked];
    
    //     if (currentIndex === -1) {
    //         newChecked.push(attr);
    //     } else {
    //         newChecked.splice(currentIndex, 1);
    //     }
    
    //     setChecked(newChecked);
    // }

    const getRows = () => {
        if (data === undefined || data === null) {
            return []
        }
        return data.attributeColumns.map((attr, index) => {
            return {
                id: index,
                attribute: attr,
                itemCount: getAttributeItemCount(attr,data)
            }
        })
    }

    const columns: GridColDef[] = [
        { field: 'attribute', headerName: 'Attribute', width: 150 },
        { field: 'itemCount', headerName: '# of Items', width: 100 },
    ]

    return (
        <Menu 
            open={true}
            onClose={props.close}
            anchorEl={props.anchorEl}
        >
            {/* <List sx={{ width: '100%' }}>
                {data?.attributeColumns.map((attr) => {
                    const labelId = `checkbox-list-label-${attr}`;

                    return (
                        <ListItem
                            key={attr}
                            disablePadding
                        >
                            <ListItemButton dense onClick={() => handleToggle(attr)} disableRipple>
                                <ListItemIcon>
                                    <Checkbox
                                    edge="start"
                                    checked={checked.indexOf(attr) !== -1}
                                    // onClick={() => handleToggle(attr)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={attr} />
                                <Box>
                                    <ListItemText primary={attributeItemCount[attr]} sx={{ margin: "0 0 0 20px", width: "0" }} />
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List> */}
            {/* <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Attribute</TableCell>
                        <TableCell align="right"># Items</TableCell>
                    </TableRow>
                    <TableBody>
                        <List>
                            <TableRow>
                            {getRows()?.map((row) => {
                                const labelId = `checkbox-list-label-${row.attribute}`;
                                return (
                                        <ListItemButton dense onClick={() => handleToggle(row.attribute)} disableRipple>
                                            <TableCell>
                                                <ListItemIcon>
                                                    <Checkbox
                                                    edge="start"
                                                    checked={checked.indexOf(row.attribute) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </ListItemIcon>
                                            </TableCell>
                                            <TableCell>
                                                <ListItemText id={labelId} primary={row.attribute} />
                                            </TableCell>
                                            <TableCell>
                                                <ListItemText primary={row.itemCount} />
                                            </TableCell>
                                        </ListItemButton>
                                    )
                                })
                            }
                            </TableRow>
                        </List>
                    </TableBody>
                </TableHead>
            </Table> */}
            <Box height={`${100 * getRows().length - 20}px`} width={"320px"}>
            <DataGrid
                sx={{height:"100%", width: "100%"}}
                rowHeight={50}
                rows={getRows()}
                columns={columns}
                checkboxSelection
                selectionModel={checked}
                onSelectionModelChange={(selections) => setChecked(selections)}
                showCellRightBorder={false}
                autoPageSize
            />
            </Box>
            <Box sx={{display: 'flex', justifyContent: "space-between"}}>
                <Button color="error" onClick={props.close}>
                    Cancel
                </Button>
                <Button 
                    color="secondary" 
                    onClick={() => {
                        if (data) {
                            const attrToAdd = checked.map((i) => data.attributeColumns[i])
                            actions.addMultipleAttributes(attrToAdd);
                        }
                        props.close();
                    }}
                >
                    Submit
                </Button>
            </Box>
        </Menu>
    )
}
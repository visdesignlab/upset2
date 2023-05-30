import { 
    Button, 
    Box, 
    Menu,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography,
    TableRow,
    Table,
    TableCell,
    TableBody,
    TableHead,
    Container,
    TextField,
} from "@mui/material"
import { useContext } from "react"
import { ProvenanceContext } from "./Root"
import { dataSelector } from "../atoms/dataAtom";
import { useRecoilValue } from "recoil";
import { useState } from "react";
import { CoreUpsetData } from "@visdesignlab/upset2-core";

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
                (attr) => attr
            ):
            []
    );

    const [ searchTerm, setSearchTerm ] = useState<string>("");

    const attributeItemCount: { [attr: string]: number } = {};

    data?.attributeColumns.forEach((attr) => {
        attributeItemCount[attr] = getAttributeItemCount(attr,data);
    })

    const handleToggle = (e: any) => {
        const attr = e.labels[0].textContent;
        let newChecked = [...checked];

        if (checked.includes(attr)) {
            newChecked = checked.filter((a) => a !== attr);
        } else {
            newChecked.push(attr);
        }

        setChecked(newChecked);
    }

    const handleSearchChange = (e: any) => {
        setSearchTerm(e.target.value);
    }

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
        }).filter((row) => row.attribute.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    return (
        <Menu 
            open={true}
            onClose={props.close}
            anchorEl={props.anchorEl}
            sx={{ height: "450px" }}
        >
            <Container maxWidth="md" sx={{ height: "80%" }}>
                <TextField
                    id="search"
                    type="search"
                    label="Search"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ width: "100%" }}
                />
            </Container>
            <FormGroup sx={{ overflow: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Attribute</TableCell>
                            <TableCell align="right"># Items</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                { getRows().map((row) => {
                    return (
                        <TableRow key={row.id}>
                            <TableCell>
                                <FormControlLabel checked={checked.includes(row.attribute)} control={<Checkbox />} label={row.attribute} onChange={(e) => handleToggle(e.target)}/>
                            </TableCell>
                            <TableCell><Typography>{row.itemCount}</Typography></TableCell>
                        </TableRow>
                    )
                    })
                }
                </TableBody>
                </Table>
            </FormGroup>
            <Box sx={{display: 'flex', justifyContent: "space-between"}}>
                <Button color="error" onClick={props.close}>
                    Cancel
                </Button>
                <Button 
                    color="secondary" 
                    onClick={() => {
                        if (data) {
                            const attrToAdd = [...checked];
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
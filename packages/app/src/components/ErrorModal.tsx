import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, FormControl, InputLabel, Checkbox, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Button } from "@mui/material"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { dataSelector, encodedDataAtom } from "../atoms/dataAtom";
import { oneHotEncode } from "../utils/oneHotEncoding";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const ErrorModal = () => {
    const data = useRecoilValue(dataSelector);
    const setEncodedDataAtom = useSetRecoilState(encodedDataAtom);
    const [ encodeList, setEncodeList ] = useState<string[]>([]);

    let needOneHot = false;

    if (data === null) return null;

    if (Object.values(data.columnTypes).includes('category') || Object.values(data.columnTypes).includes('label')) {
        needOneHot = true;
    }

    const handleChange = (e: SelectChangeEvent) => {
        const { target: { value } } = e;
        setEncodeList(typeof value === 'string' ? value.split(',') : value)
    }

    const handleSubmit = (empty = false) => {
        setEncodedDataAtom(oneHotEncode(encodeList, data, empty));
    }
    
    return (
        <Dialog open={true}>
            <DialogTitle>Import Error</DialogTitle>
            <DialogContent>
                <DialogContentText>The provided data is in an incompatible form for visualization with Upset. To visualize this dataset, please upload set-based data or, if compatible, select columns to one-hot encode.</DialogContentText>
                { needOneHot && 
                <div style={{ marginTop: "10px"}}>
                    <DialogContentText style={{fontWeight:'bold'}}>Choose columns to one-hot encode</DialogContentText>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="multiple-checkbox-label">Columns:</InputLabel>
                            <Select
                            labelId="multiple-checkbox-label"
                            id="multiple-checkbox"
                            multiple
                            value={encodeList as any}
                            onChange={handleChange}
                            input={<OutlinedInput label="Columns to encode" />}
                            renderValue={(selected: any) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {Object.entries(data.columnTypes).map(([name, type]) => (
                                <MenuItem key={name} value={name}>
                                <Checkbox checked={encodeList.includes(name)} />
                                <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>

                        <Button style={{ height: "60%" }} color="error" onClick={() => { encodeList.length = 0; handleSubmit(true) }}>Cancel</Button>
                        <Button style={{ height: "60%" }} color="secondary" variant="contained" onClick={() => handleSubmit()}>Submit</Button>
                    </div>
                </div>
                }
            </DialogContent>
        </Dialog>
    )
}

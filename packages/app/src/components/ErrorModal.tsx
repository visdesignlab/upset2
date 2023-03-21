import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, FormControl, InputLabel, Checkbox, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Button } from "@mui/material"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { dataSelector, encodedDataAtom } from "../atoms/dataAtom";
import { CoreUpsetData, process } from "@visdesignlab/upset2-core";

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

    if (Object.values(data.columnTypes).includes('category')) {
        needOneHot = true;
    }

    const handleChange = (e: SelectChangeEvent) => {
        const {
            target: { value },
          } = e;
        setEncodeList(typeof value === 'string' ? value.split(',') : value)
    }

    const oneHotEncode = (empty?: boolean) => {
        // close the error window and rerender screen by updating the atom
        if (empty) {
            setEncodedDataAtom(null);
        }

        const newColNames: string[] = []
        const encodedData: CoreUpsetData = structuredClone(data);

        // get the unique names of every new column to be added. 
        //    ex: group1_a, group1_b, group2_a, group2_b, group3_c, ....
        encodeList.forEach((s) => Object.entries(data.items).forEach(([id, row]) => {
            const names = `${row[s]}`.split(',');
            if (!(names.length === 1 && names[0] === ""))
                newColNames.push(...names.map((val) => `${s}_${val}`))
        }))
        const uniqueColNames: Set<string> = new Set(newColNames);

        // populate the data items group membership
        Object.entries(encodedData.items).forEach(([id, row]) => {
            Array.from(uniqueColNames).forEach((col) => {
                let splitCol = col.split('_');
                row[col] = `${row[splitCol[0]]}`.includes(splitCol[1])
            })
        })

        // fetch the new annotations to pass into process, these are needed to ensure that the columns are added to columnTypes
        const newAnnotations = Array.from(uniqueColNames).map((col) => {return {[col]: "boolean"}})
            .reduce((obj, item) => Object.assign(obj, item), {})
        const annotations = {...encodedData.columnTypes, ...newAnnotations}
        
        setEncodedDataAtom(process(Object.values(encodedData.items) as any, { columns: annotations } as any));
    }
    
    return (
        <Dialog open={true} >
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
                <DialogContentText>The provided data is in an incompatible form for visualization with Upset. To visualize this dataset, please upload set-based data or, if compatible, select columns to one-hot encode.</DialogContentText>
                { needOneHot && 
                <>
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

                        <Button style={{ height: "60%" }} color="error" onClick={() => { encodeList.length = 0; oneHotEncode(true) }}>Cancel</Button>
                        <Button style={{ height: "60%" }} color="secondary" variant="contained" onClick={() => oneHotEncode()}>Submit</Button>
                    </div>
                </>
                }
            </DialogContent>
        </Dialog>
    )
}

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
import { useContext, useMemo } from "react"
import { ProvenanceContext } from "./Root"
import { dataSelector } from "../atoms/dataAtom";
import { useRecoilValue } from "recoil";
import { useState } from "react";
import { CoreUpsetData, DefaultConfig } from "@visdesignlab/upset2-core";

/**
 * Get the count of items that have a specific attribute. 
 * Does not count items with null or undefined values for this attribute.
 * @param attribute - The attribute to count.
 * @param data - The data object containing the items.
 * @returns The count of items with the specified attribute value.
 */
const getAttributeItemCount = (attribute: string, data: CoreUpsetData) => {
  if (DefaultConfig.visibleAttributes.includes(attribute)) {
      return '';
  }
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

/**
 * Dropdown component for selecting attributes.
 * @param props - The component props.
 * @param props.anchorEl - The anchor element for the dropdown.
 * @param props.close - Function to close the dropdown.
 * @returns The AttributeDropdown component.
 */
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

  const attributeItemCount: { [attr: string]: number | string } = {};

  const attributes = data ? [...DefaultConfig.visibleAttributes, ...data.attributeColumns]: [...DefaultConfig.visibleAttributes];
    

  if (data) {
      attributes.forEach((attr) => {
          attributeItemCount[attr] = getAttributeItemCount(attr,data);
      })
  }

  /**
   * Handle checkbox toggle: add or remove the attribute from the visible attributes
   * and update the provenance state and plot.
   * @param e - The event object.
   */
  const handleToggle = (e: any) => {
    const attr = e.labels[0].textContent;
    let newChecked = [...checked];

    if (checked.includes(attr)) {
      newChecked = checked.filter((a) => a !== attr);
    } else {
      newChecked.push(attr);
    }

    // move 'Degree' to the first element if it is selected
    const degreeIndex = newChecked.indexOf('Degree');
    if (degreeIndex !== -1) {
        newChecked.splice(degreeIndex, 1); // Remove 'Degree' from its current position
        newChecked.unshift('Degree'); // Move 'Degree' to the beginning
    }

    setChecked(newChecked);
    actions.addMultipleAttributes(newChecked);
  }

  /**
   * Handle search input change.
   * @param e - The event object.
   */
  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
  }

  /**
   * Get the rows to display in the table.
   * @returns The filtered rows based on the search term.
   */
  const getRows = () => {
    if (data === undefined || data === null) {
      return []
    }
    return attributes.map((attr, index) => {
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
    </Menu>
  )
}
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Slide,
  Typography,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import {
  FC, forwardRef, ReactElement, Ref, useContext, useState,
} from 'react';
import { useRecoilValue } from 'recoil';

import { attributeAtom } from '../atoms/attributeAtom';
import { visibleAttributesSelector } from '../atoms/config/visibleAttributes';
import { ProvenanceContext } from './Root';

const Transition = forwardRef((
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>,
) => <Slide direction="down" ref={ref} {...props} />);

type Props = {
  open: boolean;
  onClose: () => void;
};

export const AttributeDialog: FC<Props> = ({ open, onClose }) => {
  const { actions } = useContext(ProvenanceContext);
  const attributes = useRecoilValue(attributeAtom);
  const visibleAttributes = useRecoilValue(visibleAttributesSelector);
  const [currentlySelectedAttributes, setCurrentlySelectedAttributes] =
    useState(() => visibleAttributes);

  const newlyHiddenAttributes = attributes.filter(
    (attr) => !currentlySelectedAttributes.includes(attr),
  );

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}>
      <DialogTitle>Select Attributes</DialogTitle>
      <DialogContent>
        <DialogContentText>Click to add attributes to</DialogContentText>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          direction="row"
        >
          <Grid item>
            <Paper
              sx={{
                padding: '0.5em',
                width: 150,
                height: 230,
                overflow: 'auto',
              }}
            >
              <Typography align="center">Attributes</Typography>
              <Divider />
              <List dense component="div" role="list">
                {newlyHiddenAttributes.map((attr) => (
                  <ListItem key={attr}>
                    <IconButton
                      color="success"
                      onClick={() => {
                        setCurrentlySelectedAttributes([
                          ...currentlySelectedAttributes,
                          attr,
                        ]);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                    <ListItemText>{attr}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button
                onClick={() => {
                  setCurrentlySelectedAttributes([
                    ...currentlySelectedAttributes,
                    ...newlyHiddenAttributes,
                  ]);
                }}
              >
                Add All
              </Button>
              <Button
                onClick={() => {
                  setCurrentlySelectedAttributes([]);
                }}
              >
                Remove All
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            <Paper
              sx={{
                padding: '0.5em',
                width: 150,
                height: 230,
                overflow: 'auto',
              }}
            >
              <Typography align="center">Added Attributes</Typography>
              <Divider />
              <List dense component="div" role="list">
                {currentlySelectedAttributes.map((attr) => (
                  <ListItem key={attr}>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setCurrentlySelectedAttributes(
                          currentlySelectedAttributes.filter((d) => d !== attr),
                        );
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <ListItemText>{attr}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          disabled={
            visibleAttributes.length === currentlySelectedAttributes.length &&
            JSON.stringify(visibleAttributes) ===
              JSON.stringify(currentlySelectedAttributes)
          }
          onClick={() => {
            actions.addMultipleAttributes(currentlySelectedAttributes);
            onClose();
          }}
        >
          Done
        </Button>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

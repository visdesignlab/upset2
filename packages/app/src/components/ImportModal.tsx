import { useContext, useState } from 'react';
import { Alert, Button, Dialog, DialogContent, DialogTitle, Snackbar } from '@mui/material';
import { ProvenanceContext } from './Root';

export const ImportModal = (props:{open: boolean, close: () => void}) => {
  const [ isError, setIsError ] = useState({isOpen: false, message: "An Error has occurred."});
  const { actions, provenance } = useContext(
    ProvenanceContext,
  );

  async function readFile(file: File) {
    let data = await file.text();
  
    let newState;
    try {
      newState = JSON.parse(data);
    } catch (e) {
      throw new Error("Invalid File Upload. Please upload a .json UpSet state file.");
    }
    const state = provenance.getState();

    // if hiddenSets or visibleSets is undefined, throw error
    if (newState.hiddenSets === undefined) {
      throw new Error("Error: hiddenSets attribute is missing from imported state");
    }
    if (newState.visibleSets === undefined) {
      throw new Error("Error: visibleSets attribute is missing from imported state");
    }

    // if all sets in the imported state exist in the existing state, then the dataset is the same
    const newStateSets = [...newState.visibleSets, ...newState.hiddenSets];
    const stateSets = [...state.visibleSets, ...state.hiddenSets];

    if (JSON.stringify(newStateSets) !== JSON.stringify(stateSets)) {
      throw new Error("Invalid uploaded state: Dataset mismatch")
    }

    actions.replaceState(newState);
    props.close();
  }

  return (
    <Dialog 
        open={props.open}
        onClose={props.close}
    >
        <DialogTitle>Upload Upset State (.json)</DialogTitle>
        <DialogContent>
              <input type="file" id="state-upload-file" />
              <Button 
                variant="contained" 
                size="small"
                onClick={() => {
                  const input: HTMLInputElement | null = document.getElementById('state-upload-file') as HTMLInputElement;
                  
                  input !== null && input.files !== null && 
                  readFile(input.files[0])
                  .catch((e) => { 
                    setIsError({
                      isOpen: true,
                      message: e.message
                    })
                  })
                }}>
                  Submit
              </Button>
        </DialogContent>
          <Snackbar
            open={isError.isOpen} autoHideDuration={6000} onClose={() => setIsError({...isError, isOpen: false})}>
            <Alert severity="error">{isError.message}</Alert>
          </Snackbar>
    </Dialog>
  );
};

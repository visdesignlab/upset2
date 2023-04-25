import { useContext, useState } from 'react';
import { Alert, Button, Dialog, DialogContent, DialogTitle, Snackbar } from '@mui/material';
import { ProvenanceContext } from './Root';

export const ImportModal = (props:{open: boolean, close: () => void}) => {
  const [ isError, setIsError ] = useState(false);
  const { actions } = useContext(
    ProvenanceContext,
  );

  async function readFile(file: File) {
    const data = await file.text();
  
    const newState = JSON.parse(data);
    actions.replaceState(newState);
    props.close();
  }

  return (
    <Dialog 
        open={props.open}
        onClose={props.close}
    >
        <DialogTitle>Upload Upset State</DialogTitle>
        <DialogContent>
              <input type="file" id="state-upload-file" />
              <Button 
                variant="contained" 
                size="small"
                onClick={() => {
                  const input: HTMLInputElement | null = document.getElementById('state-upload-file') as HTMLInputElement;
                  
                  input !== null && input.files !== null && 
                  readFile(input.files[0])
                  .catch(() => setIsError(true))
                }}>
                  Submit
              </Button>
        </DialogContent>
          <Snackbar
            open={isError} autoHideDuration={6000} onClose={() => setIsError(false)}>
            <Alert severity="error">Incompatible File Type! Please import a .json Upset State file.</Alert>
          </Snackbar>
    </Dialog>
  );
};

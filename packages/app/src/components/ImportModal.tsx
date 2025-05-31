import { useContext, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar,
} from '@mui/material';
import { ProvenanceContext } from '../provenance';
import { useSetRecoilState } from 'recoil';
import { importErrorAtom } from '../atoms/importErrorAtom';

export const ImportModal = (props: { open: boolean; close: () => void }) => {
  const [isError, setIsError] = useState({
    isOpen: false,
    message: 'An Error has occurred.',
  });
  const { actions, provenance } = useContext(ProvenanceContext);
  const setImportError = useSetRecoilState(importErrorAtom);

  const isMissingFields = (newState: any) => {
    const state = provenance.getState();
    let isMissing = false;

    Object.keys(state).forEach((key) => {
      if (!Object.keys(newState).includes(key)) {
        // if the newState is missing a field
        isMissing = true;
      }
    });

    return isMissing;
  };

  async function readFile(file: File) {
    const data = await file.text();

    let newState;
    try {
      newState = JSON.parse(data);
    } catch (e) {
      throw new Error('Invalid File Upload. Please upload a .json UpSet state file.');
    }
    const state = provenance.getState();

    if (JSON.stringify(newState.allSets) !== JSON.stringify(state.allSets)) {
      throw new Error('Invalid uploaded state: Dataset mismatch');
    }

    if (isMissingFields(newState)) {
      setImportError(true);
    }

    actions.replaceState(newState);
    props.close();
  }

  return (
    <Dialog open={props.open} onClose={props.close}>
      <DialogTitle>Upload Upset State (.json)</DialogTitle>
      <DialogContent>
        <input type="file" id="state-upload-file" />
        <Button
          variant="contained"
          size="small"
          aria-errormessage="import-error"
          onClick={() => {
            const input: HTMLInputElement | null = document.getElementById(
              'state-upload-file',
            ) as HTMLInputElement;

            input !== null &&
              input.files !== null &&
              readFile(input.files[0]).catch((e) => {
                setIsError({
                  isOpen: true,
                  message: e.message,
                });
              });
          }}
        >
          Submit
        </Button>
      </DialogContent>
      <Snackbar
        open={isError.isOpen}
        autoHideDuration={6000}
        onClose={() => setIsError({ ...isError, isOpen: false })}
      >
        <Alert severity="error">
          <div id="import-error">{isError.message}</div>
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

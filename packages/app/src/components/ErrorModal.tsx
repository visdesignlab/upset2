import { Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material"

export const ErrorModal = () => {
    return (
        <Dialog open={true} >
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
                <DialogContentText>The provided data is in an incompatible form for visualization with Upset. To visualize this dataset, please upload set-based data.</DialogContentText>
            </DialogContent>
        </Dialog>
    )
}
import { Dialog, Box, Typography, Button } from "@mui/material";

type Props = {
    open: boolean;
    close: () => void;
}

export const About = ({open, close}: Props) => {
    return (
        <Dialog open={open} onClose={close} sx={{padding: "20px"}}>
            <Box sx={{ padding: "20px" }}>
                <Typography variant="h5" component="h5">About Visualization Design Lab</Typography>
                <Box>
                    <p>
                        For information about VDL, please visit our <a href="https://vdl.sci.utah.edu/" target="_blank" rel="noreferrer" aria-label="Visualization Design Lab website">website</a>.
                    </p>
                    <p>
                        To contact us, please email <a href="mailto:vdl-faculty@sci.utah.edu" aria-label="Send an email to VDL faculty">vdl-faculty@sci.utah.edu</a>.
                    </p>
                </Box>
                <Typography variant="h5" component="h5">About UpSet 2</Typography>
                <Box>
                    <p>
                        UpSet 2 is an open source tool for visualizing set intersections based on <a href="https://vdl.sci.utah.edu/publications/2014_infovis_upset/" target="_blank" rel="noreferrer" aria-label="Read the 2014 UpSet paper">UpSet: Visualization of Intersecting Sets (2014)</a>.
                        <br />
                        For more information on UpSet 2, see <a href="https://vdl.sci.utah.edu/publications/2019_infovis_upset/" target="_blank" rel="noreferrer" aria-label="Read the 2019 UpSet 2 prototype paper">UpSet 2: From Prototype to Tool (2019)</a>.
                    </p>
                    <p>
                        To make contributions and/or report a bug, please visit our <a href="https://github.com/visdesignlab/upset2" target="_blank" rel="noreferrer" aria-label="open the UpSet 2 github repository">GitHub repository</a>.
                    </p> 
                    <p>
                        Development of UpSet is supported by the <a href="https://vdl.sci.utah.edu/projects/2022-czi-upset/" target="_blank" rel="noreferrer" aria-label="Read more about the Chan Zuckerberg Initiative">Chan Zuckerberg Initiative</a>.
                    </p>
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", margin: "8px" }}>
                <Button color="info" variant="contained" disableElevation onClick={close}>Close</Button>
            </Box>
        </Dialog>
    )
}
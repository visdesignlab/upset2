import { Dialog, Box, Typography, Button, Link } from "@mui/material";

type Props = {
    open: boolean;
    close: () => void;
}

export const About = ({open, close}: Props) => {
    return (
        <Dialog open={open} onClose={close} sx={{padding: "20px"}}>
            <Box sx={{ padding: "20px" }}>
                <Typography variant="h5" component="h5">About Visualization Design Lab (VDL)</Typography>
                <Box>
                    <p>
                        For information about VDL, please visit our <Link href="https://vdl.sci.utah.edu/" target="_blank" rel="noreferrer" aria-label="VDL website">website</Link>.
                    </p>
                    <p>
                        To contact us, please email <Link href="mailto:vdl-faculty@sci.utah.edu" aria-label="VDL faculty email">vdl-faculty@sci.utah.edu</Link>.
                    </p>
                </Box>
                <Typography variant="h5" component="h5">About UpSet 2</Typography>
                <Box>
                    <p>
                        UpSet 2 is an open source tool for visualizing set intersections based on <Link href="https://vdl.sci.utah.edu/publications/2014_infovis_upset/" target="_blank" rel="noreferrer">UpSet: Visualization of Intersecting Sets (2014)</Link>.
                        <br />
                        For more information on UpSet 2, see <Link href="https://vdl.sci.utah.edu/publications/2019_infovis_upset/" target="_blank" rel="noreferrer">UpSet 2: From Prototype to Tool (2019)</Link>.
                    </p>
                    <p>
                        To make contributions and/or report a bug, please visit our <Link href="https://github.com/visdesignlab/upset2" target="_blank" rel="noreferrer">UpSet2 GitHub repository</Link>.
                    </p> 
                    <p>
                        Development of UpSet is supported by the <Link href="https://vdl.sci.utah.edu/projects/2022-czi-upset/" target="_blank" rel="noreferrer">Chan Zuckerberg Initiative</Link>.
                    </p>
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", margin: "8px" }}>
                <Button color="info" variant="contained" disableElevation onClick={close}>Close</Button>
            </Box>
        </Dialog>
    )
}
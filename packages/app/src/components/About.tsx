import { Dialog, Box, Typography, Button } from "@mui/material";

type Props = {
    open: boolean;
    close: () => void;
}
import { Dialog, Box, Typography, Button } from "@mui/material";

type Props = {
    open: boolean;
    close: () => void;
}

export const About = ({open, close}: Props) => {
    return (
        <Dialog open={open} onClose={close} sx={{padding: "20px"}}>
            <Box sx={{ padding: "20px" }}>
                <Typography variant="h5" component="h5">About Visualiation Design Lab</Typography>
                <Box>
                    <p>
                        The Visualization Design Lab (VDL) is a team of visualization researchers at the <a href="https://www.utah.edu/" target="_blank" rel="noreferrer">University of Utah</a>. 
                        Our interests include the process of designing and developing visualizations, visualization for biology, visualization frameworks, and, more generally, visualization of big, heterogeneous, and complex datasets.
                    </p>
                    <p>
                        VDL is part of the <a href="https://www.sci.utah.edu/" target="_blank" rel="noreferrer">Scientific Computing and Imaging Institute</a> and the <a href="https://www.cs.utah.edu/" target="_blank" rel="noreferrer">School of Computing</a>.
                        <br />
                        For more information about VDL, please visit our <a href="https://vdl.sci.utah.edu/" target="_blank" rel="noreferrer">website</a>.
                    </p>
                    <p>
                        To contact us, please email <a href="mailto:vdl-faculty@sci.utah.edu">vdl-faculty@sci.utah.edu</a>.
                    </p>
                </Box>
                <Typography variant="h5" component="h5">About UpSet 2</Typography>
                <Box>
                    <p>
                        UpSet 2 is an open source tool for visualizing set intersections based on <a href="https://vdl.sci.utah.edu/publications/2014_infovis_upset/" target="_blank" rel="noreferrer">UpSet: Visualization of Intersecting Sets (2014)</a>.
                        <br />
                        For more information on UpSet 2, see <a href="https://vdl.sci.utah.edu/publications/2019_infovis_upset/" target="_blank" rel="noreferrer">UpSet 2: From Prototype to Tool (2019)</a>.
                    </p>
                    <p>
                        To make contributions and/or report a bug, please visit our <a href="https://github.com/visdesignlab/upset2" target="_blank" rel="noreferrer">GitHub repository</a>.
                    </p> 
                    <p>
                        Development of UpSet is supported by the <a href="https://vdl.sci.utah.edu/projects/2022-czi-upset/" target="_blank" rel="noreferrer">Chan Zuckerberg Initiative</a>.
                    </p>
                </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", margin: "8px" }}>
                <Button color="info" variant="contained" disableElevation onClick={close}>Close</Button>
            </Box>
        </Dialog>
    )
}
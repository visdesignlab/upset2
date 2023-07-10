import { Box, Dialog, Typography } from "@mui/material";

// MUI dialog to display accessibility statement
// https://www.w3.org/WAI/planning/statements/
export const AccessibilityStatement = () => {
    return (
        <Dialog open={true} onClose={() => {}} sx={{padding: "20px"}}>
            <Box sx={{ padding: "20px" }}>
                <Typography variant="h4" component="h4">UpSet 2 Accessibility Statement</Typography>
                <p>
                    The Visualization Design Lab at the University of Utah is committed to ensuring accessibility for all individuals, including those with disabilities. 
                    We strive to make our software user-friendly, accessible, and compliant with the <a href="https://www.w3.org/TR/WCAG21/" target="_blank">Web Content Accessibility Guidelines (WCAG)</a> 2.1 Level AA.
                </p>
                <p>
                    Despite our ongoing efforts to provide an inclusive experience, we would like to acknowledge that certain aspects of our website may currently pose accessibility challenges. 
                    We are actively working to improve the accessibility of the following features:
                </p>
                <ol>
                    <li>
                        UpSet2 Visualization:
                        <p>The UpSet2 Visualization is currently not accessible to all users. We understand the importance of making this feature accessible and are actively implementing measures to make UpSet2 accessible for all users.</p>
                    </li>
                    <li>
                        Provenance History:
                        <p>The "History" sidebar is not currently accessible to all users. We are diligently working to address this issue to ensure that everyone can access and utilize this feature.</p>
                    </li>
                    <li>
                        Data Table:
                        <p>The current data table is keyboard navigable and screen-reader accessible; however, the current data is not comprehensive. We are actively working on improving the data coverage included in the data table in an effort to make this feature more useful for all users.</p>
                    </li>
                </ol>
                <p>
                    We sincerely apologize for any difficulties you may encounter while using these specific features. 
                    Please be assured that we have plans in place to address these accessibility limitations and make UpSet2 fully inclusive.
                </p>
                <p>
                    To report any accessibility issues you may encounter or to provide suggestions for improvement, please contact us at <a type="email" href="vdl-faculty@sci.utah.edu">vdl-faculty@sci.utah.edu</a>. 
                    We value your feedback and are committed to continuously enhancing the accessibility and usability of our software.
                </p>
                <p>
                    Thank you for your understanding and support as we work towards creating software that is accessible to all individuals, regardless of ability.
                </p>
            </Box>
        </Dialog>
    )
};

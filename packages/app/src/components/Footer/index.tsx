import { AccessibilityNew, BugReport } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import vdl_logo from "../../assets/vdl_logo.svg";
import { accessibilityStatementAtom } from "../../atoms/accessibilityStatementAtom";
import { useRecoilState } from "recoil";
import { AccessibilityStatement } from "../AccessiblityStatement";
import { About } from "../About";
import { aboutAtom } from "../../atoms/aboutAtom";

const Footer = () => {

    const categoryCSS = {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
    }

    const [ accessibilityStatement, setAccessibilityStatement ] = useRecoilState(accessibilityStatementAtom);
    const [ aboutModal, setAboutModal ] = useRecoilState(aboutAtom);

    type FooterButtonProps = {
        icon: JSX.Element,
        label?: string,
        href?: string,
        onClick?: () => void,
        tabIndex?: number,
    }
    
    const FooterButton = ({ href, onClick, label, icon, tabIndex }: FooterButtonProps) => {
        return (
            <a href={href} target="_blank" rel="noreferrer" style={{textDecoration: "none", color: "inherit"}}>
                <Button
                    sx={categoryCSS}
                    variant="contained"
                    color="inherit"
                    size="medium"
                    disableElevation
                    startIcon={icon}
                    tabIndex={tabIndex ? tabIndex : 0}
                    onClick={onClick}
                >
                    { label &&
                        <Typography variant="button" align="center">{label}</Typography>
                    }
                </Button>
            </a>
        )
    }

    return (
        <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
            <footer>
                <Box sx={{backgroundColor: "#e0e0e0", width: "100%", display: "flex", justifyContent: "space-around", padding: "5px 0"}}>
                    <FooterButton onClick={() => setAboutModal(true)} aria-label="Open About Us modal" aria-haspopup="dialog" icon={<img src={vdl_logo} alt="About Us" height="32px" width="100%" />} />
                    <FooterButton href={"https://github.com/visdesignlab/upset2/issues"} aria-label="Open GitHub issues for this project" label={"Report a Bug"} icon={<BugReport />} />
                    <FooterButton onClick={() => setAccessibilityStatement(true)} label={"Accessibility"} aria-label="Open Accessibility Statement modal" aria-haspopup="dialog" icon={<AccessibilityNew />} tabIndex={1} />

                    {/* Accessibility Statement dialog */}
                    <AccessibilityStatement open={accessibilityStatement} close={() => setAccessibilityStatement(false)} />
                    {/* "About" dialog */}
                    <About open={aboutModal} close={() => setAboutModal(false)} />
                </Box>
            </footer>
        </Box>
    )
}

export default Footer;

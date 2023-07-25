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

    const openAccessibilityStatement = () => {
        setAccessibilityStatement(true);
    }

    const closeAccessibilityStatement = () => {
        setAccessibilityStatement(false);
    }

    const openAboutModal = () => {
        setAboutModal(true);
    }

    const closeAboutModal = () => {
        setAboutModal(false);
    }

    type FooterButtonProps = {
        icon: JSX.Element,
        label?: string,
        href?: string,
        onClick?: () => void,
        tabIndex?: number,
    }
    const FooterButton = ({ href, onClick, label, icon, tabIndex }: FooterButtonProps) => {
        return (
            <Button
                sx={categoryCSS}
                variant="contained"
                color="inherit"
                size="medium"
                disableElevation
                onClick={onClick ? onClick 
                    : () => { 
                        const x = window.open(href, "_blank");
                        if (href && x && href.includes("mailto")) {
                            x.close();
                        }
                    }}
                startIcon={icon}
                tabIndex={tabIndex ? tabIndex : 0}
            >
                { label &&
                    <Typography variant="button" align="center">{label}</Typography>
                }
            </Button>
        )
    }

    return (
        <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
            <footer>
                <Box sx={{backgroundColor: "#e0e0e0", width: "100%", display: "flex", justifyContent: "space-around", padding: "5px 0"}}>
                    {/* <FooterButton href={"https://visdesignlab.github.io/"} label={"VDL"} icon={<img src={vdl_logo} alt="VDL Logo" height="24px" width="24px" />} />
                    <FooterButton href={"https://github.com/visdesignlab/upset2"} label={"GitHub"} icon={<GitHub />} />
                    <FooterButton href={"https://upset.app/"} label={"UpSet Info"} icon={<img src={upset_logo} alt="UpSet Logo" height="24px" width="24px" />} />
                    <FooterButton href={"mailto:vdl-faculty@sci.utah.edu"} label={"Contact Us"} icon={<Mail />} /> */}
                    <FooterButton onClick={openAboutModal} icon={<img src={vdl_logo} alt="About Us" height="32px" width="100%" />} />
                    <FooterButton href={"https://github.com/visdesignlab/upset2/issues"} label={"Report a Bug"} icon={<BugReport />} />
                    <FooterButton onClick={openAccessibilityStatement} label={"Accessibility"} icon={<AccessibilityNew />} tabIndex={1} />

                    {/* Accessibility Statement dialog */}
                    <AccessibilityStatement open={accessibilityStatement} close={closeAccessibilityStatement} />
                    {/* "About" dialog */}
                    <About open={aboutModal} close={closeAboutModal} />
                </Box>
            </footer>
        </Box>
    )
}

export default Footer;

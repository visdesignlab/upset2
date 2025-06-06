import { AccessibilityNew, BugReport } from '@mui/icons-material';
import { Box, Button, Link } from '@mui/material';
import { useRecoilState } from 'recoil';
import { CoreUpsetData } from '@visdesignlab/upset2-core';
import { FC } from 'react';
// @ts-expect-error TS does not understand SVG imports
import vdlLogo from '../../assets/vdl_logo.svg';
import { accessibilityStatementAtom } from '../../atoms/accessibilityStatementAtom';
import { AccessibilityStatement } from '../AccessiblityStatement';
import { About } from '../About';
import { aboutAtom } from '../../atoms/aboutAtom';
import { FOOTER_HEIGHT } from '../Root';

/**
 * Props for the Footer component
 */
type Props = {
  /** The data for this plot */
  data: CoreUpsetData;
};

/**
 * The footer below the plot
 */
const Footer: FC<Props> = ({ data }) => {
  const categoryCSS = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  };

  const [accessibilityStatement, setAccessibilityStatement] = useRecoilState(
    accessibilityStatementAtom,
  );
  const [aboutModal, setAboutModal] = useRecoilState(aboutAtom);

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: `${FOOTER_HEIGHT}px`,
        zIndex: 2,
      }}
    >
      <footer>
        <Box
          sx={{
            backgroundColor: '#e0e0e0',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            padding: '5px 0',
          }}
        >
          <Button
            sx={categoryCSS}
            variant="contained"
            color="inherit"
            size="medium"
            disableElevation
            aria-label="About Us"
            aria-haspopup="dialog"
            onClick={() => setAboutModal(true)}
            // 2px is exactly the max amount of vertical padding you can have
            // without getting a scrollbar on the whole page
            style={{ padding: '2px 20px' }}
          >
            <img src={vdlLogo} alt="About Us" height="32px" width="100%" />
          </Button>
          <Link
            sx={categoryCSS}
            href="https://github.com/visdesignlab/upset2/issues"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub issues for this project"
          >
            <Button
              variant="contained"
              color="inherit"
              size="medium"
              disableElevation
              startIcon={<BugReport />}
            >
              Report a Bug
            </Button>
          </Link>

          <Button
            sx={categoryCSS}
            variant="contained"
            color="inherit"
            size="medium"
            disableElevation
            startIcon={<AccessibilityNew />}
            aria-label="Accessibility Statement"
            aria-haspopup="dialog"
            tabIndex={1}
            onClick={() => setAccessibilityStatement(true)}
          >
            Accessibility Statement
          </Button>

          {/* Accessibility Statement dialog */}
          <AccessibilityStatement
            data={data}
            open={accessibilityStatement}
            close={() => setAccessibilityStatement(false)}
          />
          {/* About dialog */}
          <About open={aboutModal} close={() => setAboutModal(false)} />
        </Box>
      </footer>
    </Box>
  );
};

export default Footer;

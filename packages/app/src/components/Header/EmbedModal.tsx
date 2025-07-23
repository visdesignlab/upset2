import {
  Dialog,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Radio,
  RadioGroup,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LEFT_SETTINGS_URL_PARAM,
  RIGHT_SIDEBAR_URL_PARAM,
  RightSidebar,
  RightSidebarType,
} from '@visdesignlab/upset2-core';

type Props = {
  open: boolean;
  onClose: () => void;
};

const COPY_ICON_REVERT_TIMEOUT = 5000;

const FORM_CONTROL_STYLE = {
  marginLeft: 0,
  width: '100%',
  justifyContent: 'space-between',
};

/**
 * The modal displayed when the user clicks "Get Embed Link" in the hamburger menu.
 */
export const EmbedModal = ({ open, onClose }: Props) => {
  const [copySuccess, setCopySuccess] = useState<boolean | null>(null);
  // Whether to show left sidebar settings in the embedded plot
  const [showSettings, setShowSettings] = useState(false);
  // Sidebar to show in the embedded plot: TD is Text Descriptions Sidebar, EV is Element View Sidebar
  const [sidebar, setSidebar] = useState<RightSidebarType>(RightSidebar.NONE);
  const copySuccessTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // CAUTION: Using embedLink directly in a hook dependency array can lead to issues with HMR (Hot Module Replacement),
  // since the embedLink is derived from window.location and can update outside of react's state management.
  // To avoid this, hooks that don't need the value of embedLink should depend on [showSettings, sidebar] instead
  const embedLink = useMemo(() => {
    return (
      window.location.href.split('?')[0] +
      'embed' +
      window.location.search +
      `&${LEFT_SETTINGS_URL_PARAM}=${showSettings ? 1 : 0}&${RIGHT_SIDEBAR_URL_PARAM}=${sidebar}`
    );
  }, [showSettings, sidebar]);

  // Reset copy success state when the embed link changes
  useEffect(() => {
    setCopySuccess(null);
    if (copySuccessTimeout.current) {
      clearTimeout(copySuccessTimeout.current);
      copySuccessTimeout.current = null;
    }
  }, [showSettings, sidebar]); // Instead of embedLink, we use showSettings and sidebar to avoid HMR issues

  const copyEmbedLink = useCallback(() => {
    navigator.clipboard
      .writeText(embedLink)
      .then(() => {
        setCopySuccess(true);
        copySuccessTimeout.current = setTimeout(
          () => setCopySuccess(null),
          COPY_ICON_REVERT_TIMEOUT,
        );
      })
      .catch(() => {
        alert('Failed to copy embed link: Permission denied');
        setCopySuccess(false);
        copySuccessTimeout.current = setTimeout(
          () => setCopySuccess(null),
          COPY_ICON_REVERT_TIMEOUT,
        );
      });
  }, [embedLink]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Embed Link
        <Tooltip
          title={
            copySuccess === null
              ? 'Copy embed link'
              : copySuccess
                ? 'Copied to clipboard'
                : 'Failed to copy'
          }
        >
          <IconButton
            style={{ position: 'absolute', right: 40, top: 8 }}
            onClick={copyEmbedLink}
          >
            {copySuccess === null ? (
              <ContentCopyIcon />
            ) : copySuccess ? (
              <DoneIcon color="success" />
            ) : (
              <ErrorOutlineIcon color="error" />
            )}
          </IconButton>
        </Tooltip>
        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <FormGroup style={{ padding: '0 32px' }}>
        <FormControlLabel
          style={FORM_CONTROL_STYLE}
          label="Show Left Settings Sidebar"
          control={
            <Switch
              checked={showSettings}
              onChange={() => setShowSettings(!showSettings)}
            />
          }
          labelPlacement="start"
        />
        <FormControl>
          <RadioGroup
            value={sidebar}
            onChange={(e) => setSidebar(e.target.value as RightSidebarType)}
          >
            <FormControlLabel
              style={FORM_CONTROL_STYLE}
              value="TD"
              control={<Radio size="small" />}
              label="Show Text Descriptions Sidebar"
              labelPlacement="start"
            />
            <FormControlLabel
              style={FORM_CONTROL_STYLE}
              value="EV"
              control={<Radio size="small" />}
              label="Show Element View Sidebar"
              labelPlacement="start"
            />
            <FormControlLabel
              style={FORM_CONTROL_STYLE}
              value={RightSidebar.NONE}
              control={<Radio size="small" />}
              label="No Right Sidebar"
              labelPlacement="start"
            />
          </RadioGroup>
        </FormControl>
      </FormGroup>
      <Divider style={{ margin: '0 auto', width: '90%' }} />
      <Typography
        onClick={copyEmbedLink}
        variant="body1"
        style={{
          padding: '32px',
          cursor: 'copy',
          paddingTop: '16px',
          wordBreak: 'break-all',
        }}
      >
        <code>{embedLink}</code>
      </Typography>
    </Dialog>
  );
};

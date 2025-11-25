import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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
import { useRecoilValue } from 'recoil';
import { MAINTAINER_PERMISSION_LEVEL } from '../../utils/const';
import { queryParamAtom } from '../../atoms/queryParamAtom';
import { getUserPermissions } from '../../api/getUserInfo';
import { SingleUserWorkspacePermissionSpec } from 'multinet';
import { setWorkspacePrivacy } from '../../api/session';

type Props = {
  open: boolean;
  onClose: () => void;
};

const COPY_ICON_REVERT_TIMEOUT = 5000;
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
  const { workspace } = useRecoilValue(queryParamAtom);
  const [userPerms, setUserPerms] = useState<SingleUserWorkspacePermissionSpec | null>(
    null,
  );
  /** Boolean toggle that's used to force a re-check of the user permissions */
  const [recheckUserPerms, setRecheckUserPerms] = useState(false);

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

  /** Whether the user has permissions to publish this workspace */
  const canPublish = useMemo(
    () =>
      userPerms &&
      userPerms.permission &&
      userPerms.permission >= MAINTAINER_PERMISSION_LEVEL,
    [userPerms],
  );

  /** User permissions for the current workspace */
  useEffect(() => {
    getUserPermissions(workspace ?? '').then((r) => setUserPerms(r));
  }, [workspace, recheckUserPerms]);

  // Reset copy success state when the embed link changes
  useEffect(() => {
    setCopySuccess(null);
    if (copySuccessTimeout.current) {
      clearTimeout(copySuccessTimeout.current);
      copySuccessTimeout.current = null;
    }
  }, [showSettings, sidebar]); // Instead of embedLink, we use showSettings and sidebar to avoid HMR issues

  /** Copies the current version of the embed link to clipboard and updates the copy button to a success icon */
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

  /** Makes the current workspace public */
  const makePublic = useCallback(() => {
    if (workspace && canPublish)
      setWorkspacePrivacy(workspace, true).then((success) => {
        if (!success) console.error('Unable to make workspace public!');
        else setRecheckUserPerms(!recheckUserPerms); // Force re-check of user permissions
      });
  }, [workspace, canPublish, recheckUserPerms]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle style={{ minWidth: '500px' }}>
        Embed Link
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
      {userPerms === null ? (
        <CircularProgress />
      ) : userPerms.public ? (
        <>
          <FormGroup style={{ padding: '0 32px' }}>
            <FormControl>
              <InputLabel id="sidebar-picker-label">Right Sidebar</InputLabel>
              <Select
                labelId="sidebar-picker-label"
                id="sidebar-picker-select"
                value={sidebar}
                label="Right Sidebar"
                onChange={(e) => setSidebar(e.target.value as RightSidebarType)}
              >
                <MenuItem value={RightSidebar.ALTTEXT}>Text Descriptions</MenuItem>
                <MenuItem value={RightSidebar.ELEMENT}>Element View Sidebar</MenuItem>
                <MenuItem value={RightSidebar.NONE}>None</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              style={{ marginLeft: 0, width: '100%', justifyContent: 'space-between' }}
              label="Show Left Settings Sidebar"
              control={
                <Switch
                  checked={showSettings}
                  onChange={() => setShowSettings(!showSettings)}
                />
              }
              labelPlacement="start"
            />
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
            <code style={{ display: 'inline-block' }}>
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
                  style={{ float: 'right', paddingTop: 4 }}
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
              {embedLink}
            </code>
          </Typography>
        </>
      ) : (
        <>
          <Alert severity="error">
            Unable to generate embed link: Only public workspaces can be embedded.
          </Alert>
          <Alert severity="warning">
            Caution: Publishing this workspace allows anyone on the internet to access
            your data.
          </Alert>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              padding: '16px',
            }}
          >
            <Button variant="outlined" color="info" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={makePublic}
              disabled={!canPublish}
            >
              Make Workspace Public
            </Button>
          </div>
        </>
      )}
    </Dialog>
  );
};

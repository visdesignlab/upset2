import { Dialog, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useCallback, useMemo, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

const COPY_ICON_REVERT_TIMEOUT = 3000;

export const EmbedModal = ({ open, onClose }: Props) => {
  const [copySuccess, setCopySuccess] = useState<boolean | null>(null);
  const embedLink = useMemo(() => {
    return window.location.href.split('?')[0] + 'embed' + window.location.search;
  }, []);

  const copyEmbedLink = useCallback(() => {
    navigator.clipboard
      .writeText(embedLink)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(null), COPY_ICON_REVERT_TIMEOUT);
      })
      .catch(() => {
        alert('Failed to copy embed link: Permission denied');
        setCopySuccess(false);
        setTimeout(() => setCopySuccess(null), COPY_ICON_REVERT_TIMEOUT);
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
      <Typography
        onClick={copyEmbedLink}
        variant="body1"
        style={{
          padding: '2em',
          cursor: 'pointer',
          paddingTop: 0,
        }}
      >
        <code>{embedLink}</code>
      </Typography>
    </Dialog>
  );
};

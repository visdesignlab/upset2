import {
  Divider, Drawer, IconButton, TextField, Typography, css,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';

type Props = {
  open: boolean,
  close: () => void,
  generateAltText: () => Promise<string>,
}

const initialDrawerWidth = 450;

export const AltTextSidebar = ({ open, close, generateAltText }: Props) => {
  const [altText, setAltText] = useState<string>('');

  useEffect(() => {
    async function generate() {
      const resp = await generateAltText();
      setAltText(resp);
    }

    if (open) {
      generate();
    }
  }, [open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={close}
      variant="persistent"
      sx={{
        width: (open) ? initialDrawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          padding: '1em',
          marginTop: '2em',
          width: (open) ? initialDrawerWidth : 0,
          boxSizing: 'border-box',
          zIndex: 0,
        },
      }}
    >
      <div css={css`width:${initialDrawerWidth}`}>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 95%;
          `}
        >
          <Typography variant="button" fontSize="1em">
            Alternative Text
          </Typography>
          <IconButton onClick={close}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider
          css={css`
            width: 95%;
            margin: auto;
            margin-bottom: 1em;
          `}
        />
        <TextField multiline InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} label="Generated" defaultValue={altText} fullWidth maxRows={8} />
      </div>
    </Drawer>
  )
};

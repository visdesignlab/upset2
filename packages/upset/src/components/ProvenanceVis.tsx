import {
  useContext, useState, useEffect, useMemo,
} from 'react';
import { ProvVis } from '@trrack/vis-react';
import {
  Divider, Drawer, IconButton, css,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ProvenanceContext } from './Root';
import { UpsetHeading } from './custom/theme/heading';

type Props = {
  open: boolean,
  close: () => void
}

const initialDrawerWidth = 450;

export const ProvenanceVis = ({ open, close }: Props) => {
  const { provenance } = useContext(ProvenanceContext);
  const [currentNodeId, setCurrentNodeId] = useState(provenance.current.id);

  useEffect(() => {
    provenance.currentChange(() => setCurrentNodeId(provenance.current.id));
  }, [provenance]);

  const provVis = useMemo(() => {
    if (Object.keys(provenance.graph.backend.nodes).includes(currentNodeId)) {
      return (<ProvVis
        root={provenance.root.id}
        config={{
          changeCurrent: (node) => provenance.to(node),
        }}
        nodeMap={provenance.graph.backend.nodes}
        currentNode={currentNodeId}
      />);
    }
    return null;
  }, [provenance.root.id, provenance.to, provenance.graph.backend.nodes, currentNodeId]);

  return (
    <Drawer
      aria-hidden={!open}
      anchor="right"
      open={open}
      onClose={close}
      variant="persistent"
      aria-label="History Sidebar"
      sx={{
        width: (open) ? initialDrawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          padding: '1em',
          marginTop: '3em',
          width: (open) ? initialDrawerWidth : 0,
          boxSizing: 'border-box',
          zIndex: 0,
          maxHeight: 'calc(100% - 3em)',
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
          <UpsetHeading level="h2">
            History
          </UpsetHeading>
          <IconButton onClick={close}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider
          css={css`
            width: 95%;
            margin: auto;
          `}
        />
        {provVis}
      </div>
    </Drawer>
  );
};

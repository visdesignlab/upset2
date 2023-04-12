import { useContext, useState, useEffect } from 'react';
import { ProvenanceContext } from './Root';
import { ProvVis } from '@trrack/vis-react';
import { Divider, Drawer, IconButton, Typography, css } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  yOffset: number,
  open: boolean,
  close: () => void
}

const initialDrawerWidth = 450;

export const ProvenanceVis = ({ yOffset, open, close }: Props) => {
  const { provenance } = useContext(ProvenanceContext);
  const [currentNodeId, setCurrentNodeId] = useState(provenance.current.id);

  useEffect(() => {
    provenance.currentChange(() => setCurrentNodeId(provenance.current.id));
  }, [provenance]);

  return (
    <Drawer anchor={'right'} open={open} onClose={close} variant="persistent">
      <div css={css`width:${initialDrawerWidth}`}>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            margin: ${yOffset}px 12px 0;
            align-items: center;
            width: 95%;
          `}
        >
          <Typography variant="button" fontSize="1em">
            History
          </Typography>
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
        <ProvVis
          root={provenance.root.id}
          config={{
            changeCurrent: node => provenance.to(node),
          }}
          nodeMap={provenance.graph.backend.nodes}
          currentNode={currentNodeId}
        />
      </div>
    </Drawer>
  );
};

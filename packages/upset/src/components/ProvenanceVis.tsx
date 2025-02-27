import {
  useContext, useState, useEffect, useMemo,
} from 'react';
import { ProvVis } from '@trrack/vis-react';
import { ProvenanceContext } from './Root';
import { Sidebar } from './custom/Sidebar';

type Props = {
  open: boolean,
  close: () => void
}

/**
 * Sidebar containing the Trrack provenance visualization.
 */
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
    <Sidebar
      aria-hidden={!open}
      open={open}
      close={close}
      label="History Sidebar"
      title="History"
    >
      {provVis}
    </Sidebar>
  );
};

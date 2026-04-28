import {
  useContext, useState, useEffect, useMemo,
} from 'react';
import { ProvenanceContext } from '../provenance/context';
import { Sidebar } from './custom/Sidebar';
import { ProvenanceVisComponent } from '../types';

type Props = {
  open: boolean;
  close: () => void;
  ProvVisComponent?: ProvenanceVisComponent;
};

/**
 * Sidebar containing the Trrack provenance visualization.
 * Host apps can provide a provenance visualization component when available.
 */
export function ProvenanceVis({ open, close, ProvVisComponent }: Props) {
  const { provenance } = useContext(ProvenanceContext);
  const [currentNodeId, setCurrentNodeId] = useState(provenance.current.id);

  useEffect(() => {
    provenance.currentChange(() => setCurrentNodeId(provenance.current.id));
  }, [provenance]);

  const provVis = useMemo(() => {
    if (!ProvVisComponent) {
      return (
        <p style={{ padding: '1rem', color: 'gray' }}>
          Install
          {' '}
          <code>@trrack/vis-react</code>
          {' '}
          to view the provenance history.
        </p>
      );
    }
    if (Object.keys(provenance.graph.backend.nodes).includes(currentNodeId)) {
      const nodeMap = provenance.graph.backend.nodes;
      return (
        <ProvVisComponent
          root={provenance.root.id}
          config={{
            changeCurrent: (node: string) => provenance.to(node),
          }}
          nodeMap={nodeMap}
          currentNode={currentNodeId}
        />
      );
    }
    return null;
  }, [
    ProvVisComponent,
    provenance,
    currentNodeId,
  ]);

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
}

import { useContext, useState, useEffect, useMemo } from 'react';
import type { ComponentType } from 'react';
import { ProvenanceContext } from './Root';
import { Sidebar } from './custom/Sidebar';

type Props = {
  open: boolean;
  close: () => void;
  // Use a loose type so consumers can provide @trrack/vis-react without the library importing it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ProvVisComponent?: ComponentType<any>;
};

/**
 * Sidebar containing the Trrack provenance visualization.
 * Host apps can provide a provenance visualization component when available.
 */
export const ProvenanceVis = ({ open, close, ProvVisComponent }: Props) => {
  const { provenance } = useContext(ProvenanceContext);
  const [currentNodeId, setCurrentNodeId] = useState(provenance.current.id);

  useEffect(() => {
    provenance.currentChange(() => setCurrentNodeId(provenance.current.id));
  }, [provenance]);

  const provVis = useMemo(() => {
    if (!ProvVisComponent) {
      return (
        <p style={{ padding: '1rem', color: 'gray' }}>
          Install <code>@trrack/vis-react</code> to view the provenance history.
        </p>
      );
    }
    if (Object.keys(provenance.graph.backend.nodes).includes(currentNodeId)) {
      return (
        <ProvVisComponent
          root={provenance.root.id}
          config={{
            changeCurrent: (node: string) => provenance.to(node),
          }}
          nodeMap={provenance.graph.backend.nodes}
          currentNode={currentNodeId}
        />
      );
    }
    return null;
  }, [
    ProvVisComponent,
    provenance.root.id,
    provenance.to,
    provenance.graph.backend.nodes,
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
};

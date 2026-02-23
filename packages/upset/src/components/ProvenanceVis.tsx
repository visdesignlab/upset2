import { useContext, useState, useEffect, useMemo } from 'react';
import type { ProvVis as ProvVisType } from '@trrack/vis-react';
import { ProvenanceContext } from './Root';
import { Sidebar } from './custom/Sidebar';

type Props = {
  open: boolean;
  close: () => void;
};

/**
 * Sidebar containing the Trrack provenance visualization.
 * Requires @trrack/vis-react to be installed; renders nothing if unavailable.
 */
export const ProvenanceVis = ({ open, close }: Props) => {
  const { provenance } = useContext(ProvenanceContext);
  const [currentNodeId, setCurrentNodeId] = useState(provenance.current.id);
  const [ProvVis, setProvVis] = useState<typeof ProvVisType | null>(null);

  useEffect(() => {
    let isMounted = true;

    import('@trrack/vis-react')
      .then((mod) => {
        if (!isMounted) return;
        setProvVis(() => mod.ProvVis);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err?.code !== 'MODULE_NOT_FOUND') {
          // eslint-disable-next-line no-console
          console.error('Failed to load @trrack/vis-react:', err);
        }
        setProvVis(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    provenance.currentChange(() => setCurrentNodeId(provenance.current.id));
  }, [provenance]);

  const provVis = useMemo(() => {
    if (ProvVis && Object.keys(provenance.graph.backend.nodes).includes(currentNodeId)) {
      return (
        <ProvVis
          root={provenance.root.id}
          config={{
            changeCurrent: (node) => provenance.to(node),
          }}
          nodeMap={provenance.graph.backend.nodes}
          currentNode={currentNodeId}
        />
      );
    }
    return null;
  }, [ProvVis, provenance.root.id, provenance.to, provenance.graph.backend.nodes, currentNodeId]);

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

import { useContext, useState, useEffect, useMemo } from 'react';
import { ProvenanceContext } from './Root';
import { Sidebar } from './custom/Sidebar';

type Props = {
  open: boolean;
  close: () => void;
};

// Use a loose type so we don't reference @trrack/vis-react at compile time
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProvVisComponent = React.ComponentType<any>;

/**
 * Sidebar containing the Trrack provenance visualization.
 * Requires @trrack/vis-react to be installed; renders nothing if unavailable.
 */
export const ProvenanceVis = ({ open, close }: Props) => {
  const { provenance } = useContext(ProvenanceContext);
  const [currentNodeId, setCurrentNodeId] = useState(provenance.current.id);
  // null = loading, false = unavailable, Component = ready
  const [ProvVis, setProvVis] = useState<ProvVisComponent | null | false>(null);

  useEffect(() => {
    let isMounted = true;
    const provVisModule = '@trrack/vis-react';

    // Keep this runtime-optional for consumers that do not install the peer dependency.
    try {
      import(/* @vite-ignore */ provVisModule)
        .then((mod) => {
          if (!isMounted) return;
          setProvVis(() => mod.ProvVis ?? false);
        })
        .catch((error) => {
          console.error(
            'Failed to load @trrack/vis-react. Please ensure it is installed to view the provenance visualization.',
            error,
          );
          if (isMounted) setProvVis(false);
        });
    } catch {
      setProvVis(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    provenance.currentChange(() => setCurrentNodeId(provenance.current.id));
  }, [provenance]);

  const provVis = useMemo(() => {
    if (ProvVis === false) {
      return (
        <p style={{ padding: '1rem', color: 'gray' }}>
          Install <code>@trrack/vis-react</code> to view the provenance history.
        </p>
      );
    }
    if (ProvVis && Object.keys(provenance.graph.backend.nodes).includes(currentNodeId)) {
      return (
        <ProvVis
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
    ProvVis,
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

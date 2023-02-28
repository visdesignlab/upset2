import { useContext } from 'react';
import { ProvenanceContext } from './Root';
import { ProvVis } from '@trrack/vis-react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { provenanceVisAtom } from '../atoms/provenanceVisAtom';
import { Divider, Drawer, Fab, Typography, css } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { elementSidebarAtom } from '../atoms/elementSidebarAtom';

export const ProvenanceVis = () => {
const { provenance } = useContext(ProvenanceContext);
const [ provenanceVis, setProvenanceVis ] = useRecoilState(provenanceVisAtom);
const setHideElementSidebar = useSetRecoilState(elementSidebarAtom);

return (
    <Drawer
        anchor={'right'}
        open={provenanceVis}
        variant='persistent'
    >
        <div css={css`
            margin-top: 30px;
        `}>
            <div css={css`
                display: flex;
                justify-content: space-between;
                margin: 30px 10px 10px;
                align-items: center;
            `}>
                <Typography variant="button" fontSize="1em">
                    Provenance Tree
                </Typography>
                <Fab size="small" color="primary" sx={{ boxShadow: 0 }} 
                    onClick={() => { 
                        setProvenanceVis(false);
                        setHideElementSidebar(false); 
                    }}
                ><CloseIcon /></Fab>
            </div>
            <Divider />
            <ProvVis
                root={provenance.root.id}
                config={{
                    changeCurrent: (node) => provenance.to(node),
                }}
                nodeMap={provenance.graph.backend.nodes}
                currentNode={provenance.current.id}
            />
        </div>
    </Drawer>
)
}
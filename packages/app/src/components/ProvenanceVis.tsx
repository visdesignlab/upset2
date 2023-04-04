import { useContext } from 'react';
import { ProvenanceContext } from './Root';
import { ProvVis } from '@trrack/vis-react';
import { useRecoilState } from 'recoil';
import { Divider, Drawer, IconButton, Typography, css } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { provenanceVisAtom } from '../atoms/provenanceVisAtom';
// import { elementSidebarAtom } from '@visdesignlab/upset2-react';

export const ProvenanceVis = ({ yOffset }: { yOffset: number }) => {
const { provenance } = useContext(ProvenanceContext);
const [ provenanceVis, setProvenanceVis ] = useRecoilState(provenanceVisAtom);
// const setHideElementSidebar = useSetRecoilState(elementSidebarAtom);

return (
    <Drawer
        anchor={'right'}
        open={provenanceVis}
        variant='persistent'
    >
        <div>
            <div css={css`
                display: flex;
                justify-content: space-between;
                margin: ${yOffset}px 12px 0;
                align-items: center;
                width: 95%;
            `}>
                <Typography variant="button" fontSize="1em">
                    Provenance Tree
                </Typography>
                <IconButton 
                    onClick={() => { 
                        setProvenanceVis(false);
                        // setHideElementSidebar(false); 
                    }}
                ><CloseIcon /></IconButton>
            </div>
            <Divider css={css`width:95%; margin:auto;`}/>
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
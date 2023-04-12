import { UpsetActions, UpsetProvenance } from "@visdesignlab/upset2-react"
import { UpsetConfig } from "@visdesignlab/upset2-core"
import { Box, css } from "@mui/material"
import { Body } from "./Body"
import Header from "./Header"
import { useRef, useState, useEffect, createContext } from "react"
import React from "react"

type Props = {
    provenance: UpsetProvenance,
    actions: UpsetActions,
    data: any,
    config?: UpsetConfig
}

const AppCss = css`
  overflow: hidden;
  height: 100vh;
  display: grid;
  grid-template-rows: min-content auto;
`;

export const ProvenanceContext = createContext<{
    provenance: UpsetProvenance;
    actions: UpsetActions;
    isAtLatest: boolean;
    isAtRoot: boolean;
  }>(undefined!);

export const Root = ({provenance, actions, data, config}: Props) => {
    const headerDiv = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(-1);
  
    const [trrackPosition, setTrrackPosition] = useState({
        isAtLatest: true,
        isAtRoot: true
    })

    useEffect(()=>{
        provenance.currentChange(() => {
            setTrrackPosition({
                isAtLatest: provenance.current.children.length === 0,
                isAtRoot: provenance.current.id === provenance.root.id,
            })
        })
    }, [provenance])
  

    useEffect(() => {
      const { current } = headerDiv;
      if (!current) return;
  
      if (headerHeight > 0) return;
  
      setHeaderHeight(current.clientHeight);
    }, [headerHeight, headerDiv]);

    return (
        <ProvenanceContext.Provider
            value={{
                provenance,
                actions,
                isAtLatest: trrackPosition.isAtLatest,
                isAtRoot: trrackPosition.isAtRoot
            }}
        >
            <div css={AppCss}>
                <Box
                    sx={{
                        zIndex: theme => theme.zIndex.drawer + 1,
                        position: 'relative',
                    }}
                    ref={headerDiv}
                >
                    <Header />
                </Box>
                {data === null && <div>Please click Load Data button to go to data interface.</div>}
                <Body yOffset={headerHeight} data={data} config={config}/>
            </div>
        </ProvenanceContext.Provider>
    )
}
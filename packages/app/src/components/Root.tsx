import { UpsetActions, UpsetProvenance } from "@visdesignlab/upset2-react"
import { UpsetConfig } from "@visdesignlab/upset2-core"
import { Box, css } from "@mui/material"
import { Body } from "./Body"
import Header from "./Header"
import { useRef, useState, useEffect, createContext, useMemo } from "react"
import React from "react"
import Footer from "./Footer"
import { useRecoilValue } from "recoil"
import { api } from "../atoms/authAtoms"
import { queryParamAtom } from "../atoms/queryParamAtom"

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

    const isAtLatest = useMemo(() => {
        return provenance.current.children.length === 0
    }, [provenance]);

    const isAtRoot = useMemo(() => {
        return provenance.current.id === provenance.root.id
    }, [provenance]);


    useEffect(() => {
      const { current } = headerDiv;
      if (!current) return;
  
      if (headerHeight > 0) return;
  
      setHeaderHeight(current.clientHeight);
    }, [headerHeight, headerDiv]);

    const { workspace, sessionId } = useRecoilValue(queryParamAtom);
  
    async function restoreSession() {
      if (sessionId) {
        const session = await api.getSession(workspace || '', parseInt(sessionId), 'table');
  
        // If the session is empty, the API will be an empty object
        // Only attempt to import if we have a string
        if (typeof session.state === 'string') {
          provenance.import(session.state);
        }
      }
    }
  
    useEffect(() => {
      restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ProvenanceContext.Provider
            value={{
                provenance,
                actions,
                isAtLatest: isAtLatest,
                isAtRoot: isAtRoot
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
                    <Header data={data}/>
                </Box>
                {data === null && <div>Please either log in or click the "Load Data" button to go to data interface.</div>}
                <Body yOffset={headerHeight} data={data} config={config}/>
                <Footer />
            </div>
        </ProvenanceContext.Provider>
    )
}
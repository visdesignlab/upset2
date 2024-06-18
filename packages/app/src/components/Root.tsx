import { UpsetActions, UpsetProvenance } from "@visdesignlab/upset2-react"
import { UpsetConfig } from "@visdesignlab/upset2-core"
import { Box, css } from "@mui/material"
import { Body } from "./Body"
import Header from "./Header"
import { useRef, useState, useEffect, createContext } from "react"
import React from "react"
import Footer from "./Footer"
import { useRecoilValue } from "recoil"
import { queryParamAtom } from "../atoms/queryParamAtom"
import { Home } from "./Home"
import { getMultinetSession } from "../api/session"

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
  }>(undefined!);

export const Root = ({provenance, actions, data, config}: Props) => {
    const headerDiv = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(-1);

    useEffect(() => {
      const { current } = headerDiv;
      if (!current) return;
  
      if (headerHeight > 0) return;
  
      setHeaderHeight(current.clientHeight);
    }, [headerHeight, headerDiv]);

    const { workspace, sessionId } = useRecoilValue(queryParamAtom);
  
    async function restoreSession() {
      if (sessionId) {
        const session = await getMultinetSession(workspace || '', sessionId);
  
        // Load the session if the object is not empty
        if (typeof session.state === 'object' && Object.keys(session.state).length !== 0) {
          provenance.importObject(session.state);
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
                {data === null && <Home />}
                <Body yOffset={headerHeight} data={data} config={config}/>
                <Footer />
            </div>
        </ProvenanceContext.Provider>
    )
}
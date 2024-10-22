import { UpsetActions, UpsetProvenance } from "@visdesignlab/upset2-react"
import { UpsetConfig } from "@visdesignlab/upset2-core"
import { Box, css } from "@mui/material"
import { Body } from "./Body"
import Header from "./Header"
import { useRef, useState, useEffect, useMemo } from "react"
import Footer from "./Footer"
import { Home } from "./Home"

type Props = {
    provenance: UpsetProvenance,
    actions: UpsetActions,
    data: any,
    config?: UpsetConfig
}

export const Root = ({provenance, actions, data, config}: Props) => {
    const headerDiv = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(-1);

    const AppCss = useMemo(() => {
      return css`
        overflow: ${data === null ? "auto" : "hidden"};
        height: 100vh;
        display: grid;
        grid-template-rows: min-content auto;
      `;
    }, [data]);

    useEffect(() => {
      const { current } = headerDiv;
      if (!current) return;
  
      if (headerHeight > 0) return;
  
      setHeaderHeight(current.clientHeight);
    }, [headerHeight, headerDiv]);
  
    return (
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
          <Body data={data} config={config}/>
          <Footer />
      </div>
    )
}
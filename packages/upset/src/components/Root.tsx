import { css } from '@emotion/react';
import { CoreUpsetData, UpsetConfig } from '@visdesignlab/upset2-core';
import { createContext, FC, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { attributeAtom } from '../atoms/attributeAtom';
import { columnsAtom } from '../atoms/columnAtom';
import { itemsAtom } from '../atoms/itemsAtoms';
import { setsAtom } from '../atoms/setsAtoms';
import { dataAtom } from '../atoms/dataAtom';
import { upsetConfigAtom } from '../atoms/config/upsetConfigAtoms';
import { getActions, initializeProvenanceTracking, UpsetActions, UpsetProvenance } from '../provenance';
import { Body } from './Body';
import { ElementSidebar } from './ElementView/ElementSidebar';
import { Header } from './Header/Header';
import { Sidebar } from './Sidebar';
import { SvgBase } from './SvgBase';
import { ContextMenu } from './ContextMenu';
import { ProvenanceVis } from './ProvenanceVis';

/** @jsxImportSource @emotion/react */
export const ProvenanceContext = createContext<{
  provenance: UpsetProvenance;
  actions: UpsetActions;
  isAtLatest: boolean;
  isAtRoot: boolean;
}>(undefined!);

const baseStyle = css`
  padding: 0.25em;
`;

type Props = {
  data: CoreUpsetData;
  config: UpsetConfig;
  extProvenance?: {
    provenance: UpsetProvenance;
    actions: UpsetActions;
  };
  yOffset: number;
  provVis?: {
    open: boolean;
    close: () => void;
  };
  elementSidebar?: {
    open: boolean;
    close: () => void;
  };
};

export const Root: FC<Props> = ({ data, config, extProvenance, yOffset, provVis, elementSidebar }) => {
  // Get setter for recoil config atom
  const setState = useSetRecoilState(upsetConfigAtom);

  const [trrackPosition, setTrrackPosition] = useState({
    isAtLatest: true,
    isAtRoot: true
})

  useEffect(() => {
    setState(config);
    setData(data);
  }, []);

  // Initialize Provenance and pass it setter to connect
  const { provenance, actions } = useMemo(() => {
    if (extProvenance) {
      const { provenance, actions } = extProvenance;

      provenance.currentChange(() => {
        setState(provenance.getState());
      });

      provenance.done();
      return { provenance, actions };
    }

    const provenance = initializeProvenanceTracking(config, setState);
    const actions = getActions(provenance);
    return { provenance, actions };
  }, [config]);

  useEffect(()=>{
      provenance.currentChange(() => {
          setTrrackPosition({
              isAtLatest: provenance.current.children.length === 0,
              isAtRoot: provenance.current.id === provenance.root.id,
          })
      })
  }, [provenance])

  const [sets, setSets] = useRecoilState(setsAtom);
  const [items, setItems] = useRecoilState(itemsAtom);
  const setAttributeColumns = useSetRecoilState(attributeAtom);
  const setAllColumns = useSetRecoilState(columnsAtom);
  const setData = useSetRecoilState(dataAtom);

  // This hook will populate initial sets, items, attributes
  useEffect(() => {
    setSets(data.sets);
    setItems(data.items);
    setAttributeColumns(data.attributeColumns);
    setAllColumns(data.columns);
    setData(data)
  }, [data]);

  if (Object.keys(sets).length === 0 || Object.keys(items).length === 0)
    return null;

  return (
    <ProvenanceContext.Provider
      value={{
        provenance,
        actions,
        isAtLatest: trrackPosition.isAtLatest,
        isAtRoot: trrackPosition.isAtRoot
      }}
    >
      <div
        css={css`
          flex: 0 0 auto;
          overflow: auto;
          ${baseStyle};
        `}
      >
        <Sidebar />
      </div>
      <div
        css={css`
          flex: 1 1 auto;
          overflow: auto;
          ${baseStyle};
        `}
      >
        <SvgBase>
          <Header />
          <Body />
        </SvgBase>
      </div>
      <ContextMenu />
      {elementSidebar && <ElementSidebar yOffset={yOffset} open={elementSidebar.open} close={elementSidebar.close}/>}
      {provVis && <ProvenanceVis yOffset={yOffset} open={provVis.open} close={provVis.close} />}
    </ProvenanceContext.Provider>
  );
};

/* eslint-disable no-shadow */
import { css } from '@emotion/react';
import { CoreUpsetData, UpsetConfig } from '@visdesignlab/upset2-core';
import React, {
  createContext, FC, useEffect, useMemo,
} from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { attributeAtom } from '../atoms/attributeAtom';
import { columnsAtom } from '../atoms/columnAtom';
import { itemsAtom } from '../atoms/itemsAtoms';
import { setsAtom } from '../atoms/setsAtoms';
import { dataAtom } from '../atoms/dataAtom';
import { columnHoverAtom, columnSelectAtom } from '../atoms/highlightAtom';
import { contextMenuAtom } from '../atoms/contextMenuAtom';
import { upsetConfigAtom } from '../atoms/config/upsetConfigAtoms';
import { currentIntersectionAtom } from '../atoms/config/currentIntersectionAtom';
import {
  getActions, initializeProvenanceTracking, UpsetActions, UpsetProvenance,
} from '../provenance';
import { Body } from './Body';
import { ElementSidebar } from './ElementView/ElementSidebar';
import { Header } from './Header/Header';
import { Sidebar } from './Sidebar';
import { SvgBase } from './SvgBase';
import { ContextMenu } from './ContextMenu';
import { ProvenanceVis } from './ProvenanceVis';
import { AltTextSidebar } from './AltTextSidebar';

export const ProvenanceContext = createContext<{
  provenance: UpsetProvenance;
  actions: UpsetActions;
} | any>({});

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
  provVis?: {
    open: boolean;
    close: () => void;
  };
  elementSidebar?: {
    open: boolean;
    close: () => void;
  };
  altTextSidebar?: {
    open: boolean;
    close: () => void;
  };
  generateAltText?: () => Promise<string>;
};

export const Root: FC<Props> = ({
  data, config, extProvenance, provVis, elementSidebar, altTextSidebar, generateAltText,
}) => {
  // Get setter for recoil config atom
  const setState = useSetRecoilState(upsetConfigAtom);

  const [sets, setSets] = useRecoilState(setsAtom);
  const [items, setItems] = useRecoilState(itemsAtom);
  const setAttributeColumns = useSetRecoilState(attributeAtom);
  const setAllColumns = useSetRecoilState(columnsAtom);
  const setData = useSetRecoilState(dataAtom);
  const setCurrentIntersection = useSetRecoilState(currentIntersectionAtom);
  const setColumnHover = useSetRecoilState(columnHoverAtom);
  const setColumnSelect = useSetRecoilState(columnSelectAtom);
  const setContextMenu = useSetRecoilState(contextMenuAtom);

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

  // This hook will populate initial sets, items, attributes
  useEffect(() => {
    setSets(data.sets);
    setItems(data.items);
    setAttributeColumns(data.attributeColumns);
    setAllColumns(data.columns);
    setData(data);
  }, [data]);

  // remove column hover state
  const removeHover = () => {
    setColumnHover([]);
  };

  // close all open context menus
  const removeContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    document.addEventListener('contextmenu', removeContextMenu, false);
    document.addEventListener('mousemove', removeHover, false);

    return function removeListeners() {
      document.removeEventListener('mousemove', removeHover, false);
      document.removeEventListener('contextmenu', removeContextMenu, false);
    };
  }, []);

  if (Object.keys(sets).length === 0 || Object.keys(items).length === 0) return null;

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ProvenanceContext.Provider value={{ provenance, actions }}>
      <div
        css={css`
          flex: 0 0 auto;
          overflow: auto;
          ${baseStyle};
        `}
      >
        <Sidebar />
      </div>
      <h2
        id="desc"
        css={css`
          position: absolute; 
          width: 1px; 
          height: 1px; 
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          border: 0;
        `}
      >
        The UpSet 2 interactive plot is currently not screen reader accessible. We are actively working on this and apologize for any inconvenience.
      </h2>
      <div
        css={css`
          flex: 1 1 auto;
          overflow: auto;
          ${baseStyle};
        `}
        aria-hidden
        aria-describedby="desc"
      >
        <SvgBase>
          <Header />
          <Body />
        </SvgBase>
      </div>
      <ContextMenu />
      {elementSidebar && <ElementSidebar open={elementSidebar.open} close={elementSidebar.close} />}
      {provVis && <ProvenanceVis open={provVis.open} close={provVis.close} />}
      {(altTextSidebar && generateAltText) && <AltTextSidebar open={altTextSidebar.open} close={altTextSidebar.close} generateAltText={generateAltText} />}
    </ProvenanceContext.Provider>
  );
};

/* eslint-disable no-shadow */
import { css } from '@emotion/react';
import { convertConfig, CoreUpsetData, UpsetConfig } from '@visdesignlab/upset2-core';
import {
  createContext, FC, useEffect, useMemo,
} from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { attributeAtom } from '../atoms/attributeAtom';
import { columnsAtom } from '../atoms/columnAtom';
import { itemsAtom } from '../atoms/itemsAtoms';
import { setsAtom } from '../atoms/setsAtoms';
import { dataAtom } from '../atoms/dataAtom';
import { allowAttributeRemovalAtom } from '../atoms/config/allowAttributeRemovalAtom';
import { contextMenuAtom } from '../atoms/contextMenuAtom';
import { upsetConfigAtom } from '../atoms/config/upsetConfigAtoms';
import { canEditPlotInformationAtom } from '../atoms/config/canEditPlotInformationAtom';
import {
  getActions, initializeProvenanceTracking, UpsetActions, UpsetProvenance,
} from '../provenance';
import { Body } from './Body';
import { ElementSidebar } from './ElementView/ElementSidebar';
import { Header } from './Header/Header';
import { SettingsSidebar } from './SettingsSidebar';
import { SvgBase } from './SvgBase';
import { ContextMenu } from './ContextMenu';
import { ProvenanceVis } from './ProvenanceVis';
import { AltTextSidebar } from './AltTextSidebar';
import { AltText } from '../types';
import { footerHeightAtom } from '../atoms/dimensionsAtom';

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
  allowAttributeRemoval?: boolean;
  hideSettings?: boolean;
  canEditPlotInformation?: boolean;
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
  footerHeight?: number;
  generateAltText?: () => Promise<AltText>;
};

export const Root: FC<Props> = ({
  data, config, allowAttributeRemoval, hideSettings, canEditPlotInformation, extProvenance, provVis, elementSidebar, altTextSidebar, footerHeight, generateAltText,
}) => {
  // Get setter for recoil config atom
  const setState = useSetRecoilState(upsetConfigAtom);
  const [sets, setSets] = useRecoilState(setsAtom);
  const [items, setItems] = useRecoilState(itemsAtom);
  const setcanEditPlotInformation = useSetRecoilState(canEditPlotInformationAtom);
  const setAttributeColumns = useSetRecoilState(attributeAtom);
  const setAllColumns = useSetRecoilState(columnsAtom);
  const setData = useSetRecoilState(dataAtom);
  const setContextMenu = useSetRecoilState(contextMenuAtom);
  const setAllowAttributeRemoval = useSetRecoilState(allowAttributeRemovalAtom);

  useEffect(() => {
    if (!extProvenance) setState(convertConfig(config));
    setData(data);
  }, []);

  useEffect(() => {
    if (canEditPlotInformation !== undefined) {
      setcanEditPlotInformation(canEditPlotInformation);
    }
  }, [canEditPlotInformation]);

  // Initialize Provenance and pass it setter to connect
  const { provenance, actions } = useMemo(() => {
    if (extProvenance) {
      const { provenance, actions } = extProvenance;

      // This syncs all linked atoms with the provenance state
      provenance.currentChange(() => {
        // Old provenance nodes may be using a different config version, so convert it if need be
        const converted = convertConfig(provenance.getState());
        setState(converted);
      });

      provenance.done();
      return { provenance, actions };
    }

    const provenance = initializeProvenanceTracking(config, setState);
    const actions = getActions(provenance);
    return { provenance, actions };
  }, [config]);

  useEffect(() => setState(convertConfig(provenance.getState())), []);

  // This hook will populate initial sets, items, attributes
  useEffect(() => {
    setSets(data.sets);
    setItems(data.items);
    setAttributeColumns(['Degree', 'Deviation', ...data.attributeColumns]);
    setAllColumns(data.columns);
    setData(data);
    // if it is defined, pass through the provided value, else, default to true
    setAllowAttributeRemoval(allowAttributeRemoval !== undefined ? allowAttributeRemoval : true);
  }, [data]);

  // close all open context menus
  const removeContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    document.addEventListener('contextmenu', removeContextMenu, false);

    return function removeListeners() {
      document.removeEventListener('contextmenu', removeContextMenu, false);
    };
  }, []);

  // Sets the footer height atom if provided as an argument
  const setFooterHeight = useSetRecoilState(footerHeightAtom);
  // Footer height needs to be doubled to work right... idk why that is!
  useEffect(() => { if (footerHeight) setFooterHeight(2 * footerHeight); }, [footerHeight]);

  if (Object.keys(sets).length === 0 || Object.keys(items).length === 0) return null;

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ProvenanceContext.Provider value={{ provenance, actions }}>
      {!hideSettings &&
      <div
        css={css`
          flex: 0 0 auto;
          overflow: auto;
          ${baseStyle};
        `}
      >
        <SettingsSidebar />
      </div>}
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
      {elementSidebar && elementSidebar.open && <ElementSidebar open={elementSidebar.open} close={elementSidebar.close} />}
      {provVis && <ProvenanceVis open={provVis.open} close={provVis.close} />}
      {(altTextSidebar && generateAltText) && <AltTextSidebar open={altTextSidebar.open} close={altTextSidebar.close} generateAltText={generateAltText} />}
    </ProvenanceContext.Provider>
  );
};

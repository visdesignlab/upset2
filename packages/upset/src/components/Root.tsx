import { css } from '@emotion/react';
import {
  AltText,
  convertConfig,
  CoreUpsetData,
  deepCopy,
  LEFT_SETTINGS_URL_PARAM,
  populateConfigDefaults,
  ShowSettings,
  UPSET_ATTS,
  UpsetConfig,
} from '@visdesignlab/upset2-core';
import {
  useCallback, useEffect, useMemo,
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
import { footerHeightAtom } from '../atoms/dimensionsAtom';
import { canEditPlotInformationAtom } from '../atoms/config/canEditPlotInformationAtom';
import {
  getActions,
  initializeProvenanceTracking,
  UpsetActions,
  UpsetProvenance,
} from '../provenance';
import { ProvenanceContext } from '../provenance/context';
import { Body } from './Body';
import { ElementSidebar } from './ElementView/ElementSidebar';
import { Header } from './Header/Header';
import { SettingsSidebar } from './SettingsSidebar';
import { SvgBase } from './SvgBase';
import { ContextMenu } from './ContextMenu';
import { ProvenanceVis } from './ProvenanceVis';
import { AltTextSidebar } from './AltTextSidebar';
import { CustomOrderModal } from './CustomOrderModal';
import { ProvenanceVisComponent, SidebarProps } from '../types';

const baseStyle = css`
  padding: 0.25em;
  padding-left: 0;
`;

type Props = {
  data: CoreUpsetData;
  config: Partial<UpsetConfig>;
  visibleDatasetAttributes?: string[];
  visualizeUpsetAttributes?: boolean;
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
  provVisComponent?: ProvenanceVisComponent;
  elementSidebar?: SidebarProps;
  altTextSidebar?: SidebarProps;
  footerHeight?: number;
  generateAltText?: () => Promise<AltText>;
};

export function Root({
  data,
  config,
  visibleDatasetAttributes,
  visualizeUpsetAttributes,
  allowAttributeRemoval,
  hideSettings,
  canEditPlotInformation,
  extProvenance,
  provVis,
  provVisComponent,
  elementSidebar,
  altTextSidebar,
  footerHeight,
  generateAltText,
}: Props) {
  // Get setter for recoil config atom
  const setState = useSetRecoilState(upsetConfigAtom);
  const [sets, setSets] = useRecoilState(setsAtom);
  const [items, setItems] = useRecoilState(itemsAtom);
  const setCanEditPlotInformation = useSetRecoilState(canEditPlotInformationAtom);
  const setAttributeColumns = useSetRecoilState(attributeAtom);
  const setAllColumns = useSetRecoilState(columnsAtom);
  const setData = useSetRecoilState(dataAtom);
  const setContextMenu = useSetRecoilState(contextMenuAtom);
  const setAllowAttributeRemoval = useSetRecoilState(allowAttributeRemovalAtom);
  const setFooterHeight = useSetRecoilState(footerHeightAtom);

  // This might not work on Edge or iOS Safari
  const urlParams = new URLSearchParams(window.location.search);

  // Set the initial state of canEditPlotInformation
  useEffect(() => {
    if (canEditPlotInformation !== undefined) setCanEditPlotInformation(canEditPlotInformation);
  }, [canEditPlotInformation, setCanEditPlotInformation]);

  // Initialize provenance & config state & set up listeners
  const { provenance, actions } = useMemo(() => {
    const nextProvenance: UpsetProvenance = extProvenance?.provenance
      ?? initializeProvenanceTracking(
        // Populate config defaults if not already set (this is only done if extProvenance is not provided)
        populateConfigDefaults(
          config,
          data,
          visualizeUpsetAttributes ?? true,
          visibleDatasetAttributes,
        ),
        setState,
      );
    const nextActions = extProvenance?.actions ?? getActions(nextProvenance);
    const provenanceWithGetState = nextProvenance as UpsetProvenance & {
      _getState?: typeof nextProvenance.getState;
    };

    // This syncs all linked atoms with the provenance state
    provenanceWithGetState.currentChange(() => {
      // Old provenance nodes may be using a different config version, so convert it if need be
      const converted = convertConfig(provenanceWithGetState.getState());
      setState(converted);
    });

    // Ensure that the provenance state is always in the correct format
    const originalGetState = provenanceWithGetState.getState.bind(provenanceWithGetState);
    provenanceWithGetState.getState = () => convertConfig(originalGetState());

    provenanceWithGetState.done();
    return { provenance: provenanceWithGetState, actions: nextActions };
  }, [
    config,
    extProvenance,
    setState,
    data,
    visibleDatasetAttributes,
    visualizeUpsetAttributes,
  ]);

  const provenanceContextValue = useMemo(
    () => ({ provenance, actions }),
    [provenance, actions],
  );

  /**
   * We don't want to populate the config defaults if the provenance is already set externally
   */
  useEffect(() => {
    if (!extProvenance) {
      setState(
        populateConfigDefaults(
          Object.entries(config).length > 0 ? deepCopy(convertConfig(config)) : {},
          data,
          visualizeUpsetAttributes ?? false,
          visibleDatasetAttributes,
        ),
      );
    } else setState(convertConfig(provenance.getState()));
  }, [
    config,
    data,
    setState,
    visibleDatasetAttributes,
    visualizeUpsetAttributes,
    extProvenance,
    provenance,
  ]);

  // This hook is for atoms that are not directly linked to the provenance state
  useEffect(() => {
    setSets(data.sets);
    setItems(data.items);
    setAttributeColumns([...UPSET_ATTS, ...data.attributeColumns]);
    setAllColumns(data.columns);
    setData(data);
    // if it is defined, pass through the provided value, else, default to true
    setAllowAttributeRemoval(
      allowAttributeRemoval !== undefined ? allowAttributeRemoval : true,
    );
  }, [
    data,
    allowAttributeRemoval,
    setAllColumns,
    setAttributeColumns,
    setData,
    setItems,
    setSets,
    setAllowAttributeRemoval,
  ]);

  // Footer height needs to be doubled to work right... idk why that is!
  useEffect(() => {
    if (footerHeight) setFooterHeight(2 * footerHeight);
  }, [footerHeight, setFooterHeight]);

  // close all open context menus
  const removeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, [setContextMenu]);

  useEffect(() => {
    document.addEventListener('contextmenu', removeContextMenu, false);

    return function removeListeners() {
      document.removeEventListener('contextmenu', removeContextMenu, false);
    };
  }, [removeContextMenu]);

  if (Object.keys(sets).length === 0 || Object.keys(items).length === 0) return null;
  return (
    <ProvenanceContext.Provider value={provenanceContextValue}>
      {!hideSettings && (
        <div
          css={css`
            flex: 0 0 auto;
            overflow: auto;
            ${baseStyle};
          `}
        >
          {urlParams.get(LEFT_SETTINGS_URL_PARAM) !== ShowSettings.FALSE && (
            <SettingsSidebar />
          )}
        </div>
      )}
      <h2
        id="desc"
        css={css`
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        `}
      >
        The UpSet 2 interactive plot is currently not screen reader accessible. We are
        actively working on this and apologize for any inconvenience.
      </h2>
      <CustomOrderModal />
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
      {elementSidebar && elementSidebar.open && (
        <ElementSidebar
          open={elementSidebar.open}
          close={elementSidebar.close}
          embedded={elementSidebar.embedded}
        />
      )}
      {provVis && (
        <ProvenanceVis
          open={provVis.open}
          close={provVis.close}
          ProvVisComponent={provVisComponent}
        />
      )}
      {altTextSidebar && generateAltText && (
        <AltTextSidebar
          open={altTextSidebar.open}
          close={altTextSidebar.close}
          embedded={altTextSidebar.embedded}
          generateAltText={generateAltText}
        />
      )}
    </ProvenanceContext.Provider>
  );
}

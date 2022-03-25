import { css } from '@emotion/react';
import { CoreUpsetData, UpsetConfig } from '@visdesignlab/upset2-core';
import { createContext, FC, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { attributeAtom } from '../atoms/attributeAtom';
import { upsetConfigAtom } from '../atoms/config/upsetConfigAtoms';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { itemsAtom } from '../atoms/itemsAtoms';
import { setsAtom } from '../atoms/setsAtoms';
import { getActions, initializeProvenanceTracking, UpsetActions, UpsetProvenance } from '../provenance';
import { Body } from './Body';
import { ElementSidebar } from './ElementView/ElementSidebar';
import { Header } from './Header/Header';
import { Sidebar } from './Sidebar';
import { SvgBase } from './SvgBase';

/** @jsxImportSource @emotion/react */
export const ProvenanceContext = createContext<{
  provenance: UpsetProvenance;
  actions: UpsetActions;
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
};

export const Root: FC<Props> = ({ data, config, extProvenance, yOffset }) => {
  // Get setter for recoil config atom
  const setState = useSetRecoilState(upsetConfigAtom);

  useEffect(() => {
    setState(config);
  }, []);

  // Initialize Provenance and pass it setter to connect
  const { provenance, actions } = useMemo(() => {
    if (extProvenance) {
      const { provenance, actions } = extProvenance;

      provenance.addGlobalObserver(() => setState(provenance.state));

      provenance.done();
      return { provenance, actions };
    }

    const provenance = initializeProvenanceTracking(config, setState);
    const actions = getActions(provenance);
    return { provenance, actions };
  }, [config]);

  const [sets, setSets] = useRecoilState(setsAtom);
  const [items, setItems] = useRecoilState(itemsAtom);
  const setAttributeColumns = useSetRecoilState(attributeAtom);

  // This hook will populate initial sets, items, attributes
  useEffect(() => {
    setSets(data.sets);
    setItems(data.items);
    setAttributeColumns(data.attributeColumns);
  }, [data]);

  const dimensions = useRecoilValue(dimensionsSelector);

  const { height, width, margin } = dimensions;

  if (Object.keys(sets).length === 0 || Object.keys(items).length === 0)
    return null;

  return (
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
      <div
        css={css`
          flex: 1 1 auto;
          overflow: auto;
          ${baseStyle};
        `}
      >
        <SvgBase defaultSettings={{ height, width, margin }}>
          <Header />
          <Body />
        </SvgBase>
      </div>
      <ElementSidebar yOffset={yOffset} />
    </ProvenanceContext.Provider>
  );
};

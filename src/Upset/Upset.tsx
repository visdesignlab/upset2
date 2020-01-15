import React, { createContext } from 'react';
import Navbar from './Components/Navbar';
import { setupProvenance } from './Provenance/Setup';
import { Provider } from 'mobx-react';
import { upsetStore } from './Store/UpsetStore';
import UpsetProvenance from './Interfaces/UpsetProvenance';
import { DatasetInfo, SetInfo } from './Interfaces/DatasetInfo';
import { style } from 'typestyle';
import Sidebar from './Components/SideBar/Sidebar';
import MainUpsetView from './Components/Main/MainUpsetView';
import { SizeContextShape, getSizeContextValue } from './Interfaces/SizeContext';

export type DatasetOption = {
  info: DatasetInfo;
  key: string;
  text: string;
  value: string;
  description: string;
};

export type DatasetOptions = DatasetOption[];

export type CardinalityContextType = {
  notifyCardinalityChange: (limit: number) => void;
  localCardinalityLimit: number;
};

export function getSetCount(sets: SetInfo[]) {
  let setCount = 0;

  sets.forEach(set => {
    setCount += set.end - set.start + 1;
  });

  return setCount;
}

export const ProvenanceContext = createContext<UpsetProvenance>({} as any);
export const CardinalityContext = createContext<CardinalityContextType>(null as any);
export const SizeContext = createContext<SizeContextShape>(getSizeContextValue(0, 0, 0));
export const fileServer = 'https://us-central1-upset2-eaf80.cloudfunctions.net/api';

const Upset: React.FC = () => {
  const { provenance, actions } = setupProvenance();

  return (
    <div>
      <Provider store={upsetStore}>
        <ProvenanceContext.Provider value={{ provenance, actions }}>
          <div className={layoutDiv}>
            <div className={navBar}>
              <Navbar></Navbar>
            </div>
            <div className={controlSideBar}>
              <Sidebar></Sidebar>
            </div>
            <div className={upsetView}>
              <MainUpsetView></MainUpsetView>
            </div>
            <div className={elementView}>Details</div>
            <div className={nothing}></div>
          </div>
        </ProvenanceContext.Provider>
      </Provider>
    </div>
  );
};

export default Upset;

const layoutDiv = style({
  height: '100vh',
  width: '100vw',
  display: 'grid',
  gridTemplateRows: 'min-content auto  1em',
  gridTemplateColumns: '2fr 7fr 2fr',
  gridTemplateAreas: `"nav nav nav"
  "controls upset element"
"nothing nothing nothing"
  `
});

const nothing = style({
  gridArea: 'nothing'
});

const navBar = style({
  gridArea: 'nav'
});

const controlSideBar = style({
  gridArea: 'controls',
  padding: '1em'
});

const upsetView = style({
  gridArea: 'upset',
  padding: '1em',
  overflow: 'auto',
  display: 'grid',
  gridTemplateRows: 'min-content 0.25em auto',
  gridTemplateColumns: 'min-content auto',
  gridTemplateAreas: `"sets header"
  "padding padding"
    "matrix rows"
  `
});

const elementView = style({
  gridArea: 'element'
});

import React, { FC, useState, useEffect, useMemo, useContext } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { style } from 'typestyle';
import {
  Data,
  createData,
  getRenderRows,
  applyHideEmpty,
  applyMinMaxDegree,
  applySort,
  applyAggregation,
  updateVisibleSets
} from '../../Interfaces/UpsetDatasStructure/Data';
import SelectedSets from './SelectedSets';
import Matrix from './Matrix';
import HeaderBar from './HeaderBar';
import Body from './Body';
import { CardinalityContext, SizeContext, ProvenanceContext } from '../../Upset';
import { getSizeContextValue } from '../../Interfaces/SizeContext';
import { DatasetInfo } from '../../Interfaces/DatasetInfo';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
  store?: UpsetStore;
}

const MainUpsetView: FC<Props> = ({ store }: Props) => {
  const { actions } = useContext(ProvenanceContext);
  const [isLoading, setIsLoading] = useState(false);

  const {
    selectedDataset,
    hideEmpty,
    minDegree,
    maxDegree,
    sortBy,
    sortBySetName,
    firstAggregation,
    secondAggregation,
    firstOverlap,
    secondOverlap,
    visibleSets
  } = store!;
  const [data, setData] = useState<Data>(null as any);

  const stringifiedData = JSON.stringify(data);

  useEffect(() => {
    if (selectedDataset) {
      setIsLoading(true);
      createData(selectedDataset)
        .then(d => {
          const info: DatasetInfo = JSON.parse(stringifiedData)
            ? JSON.parse(stringifiedData).info
            : ({ file: '' } as any);
          if (info.file !== d.info.file) {
            setData(d);
            actions.setVisibleSets(d.usedSets.map(s => s.elementName));
          }
        })
        .finally(() => {
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          throw new Error(err);
        });
    }
  }, [stringifiedData, selectedDataset, actions]);

  useEffect(() => {
    setIsLoading(true);
    const newData = updateVisibleSets(JSON.parse(stringifiedData), visibleSets);
    if (JSON.stringify(newData) !== stringifiedData) {
      setData(newData);
    }
    setIsLoading(false);
  }, [stringifiedData, visibleSets]);

  const hideEmptyResults = useMemo(() => {
    return applyHideEmpty(JSON.parse(stringifiedData), hideEmpty);
  }, [stringifiedData, hideEmpty]);

  const degreeResults = useMemo(() => {
    return applyMinMaxDegree(hideEmptyResults, minDegree, maxDegree);
  }, [hideEmptyResults, minDegree, maxDegree]);

  const aggregationResults = useMemo(() => {
    return applyAggregation(
      JSON.parse(stringifiedData),
      degreeResults,
      firstAggregation,
      secondAggregation,
      firstOverlap,
      secondOverlap
    );
  }, [
    stringifiedData,
    degreeResults,
    firstAggregation,
    secondAggregation,
    firstOverlap,
    secondOverlap
  ]);

  const sortResults = useMemo(() => {
    return applySort(
      JSON.parse(stringifiedData),
      aggregationResults,
      sortBy,
      sortBySetName,
      firstAggregation,
      secondAggregation
    );
  }, [
    stringifiedData,
    sortBy,
    sortBySetName,
    aggregationResults,
    firstAggregation,
    secondAggregation
  ]);

  const renderRows = useMemo(() => {
    return getRenderRows(sortResults, firstAggregation, secondAggregation);
  }, [sortResults, firstAggregation, secondAggregation]);

  const [cardinalityDomainLimit, setCardinalityDomainLimit] = useState(-1);

  if (!data) return null;

  const sizes = renderRows.map(r => r.element.size);

  const maxSize = sizes.length > 0 ? Math.max(...sizes) : 0;

  if (cardinalityDomainLimit === -1 || cardinalityDomainLimit >= data.items.length) {
    setCardinalityDomainLimit(Math.max(maxSize));
  }

  function setNewCardinalityLimit(newLimit: number) {
    setCardinalityDomainLimit(newLimit);
  }

  const sizeValue = getSizeContextValue(data.usedSets.length, renderRows.length, 3);

  return (
    <SizeContext.Provider value={sizeValue}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            height: sizeValue.usedSetsHeader.totalHeaderHeight + sizeValue.matrixHeight,
            width: sizeValue.matrix.totalMatrixWidth + sizeValue.attributes.totalHeaderWidth
          }}
        >
          <Dimmer inverted active>
            <Loader size="massive">Computing</Loader>
          </Dimmer>
        </div>
      )}
      <SelectedSets
        key={sortBySetName}
        usedSets={data.usedSets}
        className={sets}
        maxSetSize={Math.max(...data.sets.map(d => d.size))}
        unusedSets={data.unusedSets}
        sortedSetName={sortBySetName}
      ></SelectedSets>
      <Matrix className={matrix} renderRows={renderRows} usedSets={data.usedSets}></Matrix>
      <CardinalityContext.Provider
        value={{
          notifyCardinalityChange: setNewCardinalityLimit,
          localCardinalityLimit: cardinalityDomainLimit
        }}
      >
        <HeaderBar className={header} maxSize={data.items.length}></HeaderBar>
        <Body className={rows} renderRows={renderRows} maxSize={data.items.length}></Body>
      </CardinalityContext.Provider>
    </SizeContext.Provider>
  );
};

export default inject('store')(observer(MainUpsetView));

const sets = style({
  gridArea: 'sets'
});
const header = style({
  gridArea: 'header'
});
const matrix = style({
  gridArea: 'matrix',
  overflowY: 'auto'
});
const rows = style({
  gridArea: 'rows'
});

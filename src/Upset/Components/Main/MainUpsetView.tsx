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
  updateVisibleSets,
  updateVisibleAttribute
} from '../../Interfaces/UpsetDatasStructure/Data';
import SelectedSets from './SelectedSets';
import Matrix from './Matrix';
import HeaderBar from './HeaderBar';
import Body from './Body';
import { CardinalityContext, SizeContext, ProvenanceContext } from '../../Upset';
import { getSizeContextValue } from '../../Interfaces/SizeContext';
import { DatasetInfo } from '../../Interfaces/DatasetInfo';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Subset } from '../../Interfaces/UpsetDatasStructure/Subset';
import { Group } from '../../Interfaces/UpsetDatasStructure/Group';

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
    visibleSets,
    visibleAttributes
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
            actions.setVisibleAttributes(d.selectedAttributes.map(s => s.name));
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

  const updatedSets = useMemo(() => {
    setIsLoading(true);
    const newData = updateVisibleSets(JSON.parse(stringifiedData), visibleSets);
    setIsLoading(false);
    return newData;
  }, [stringifiedData, visibleSets]);

  const attrList = JSON.stringify(Object.keys(visibleAttributes));

  const updatedAttributes = useMemo(() => {
    setIsLoading(true);
    console.log('Called');
    const newData = updateVisibleAttribute(updatedSets, JSON.parse(attrList));
    setIsLoading(false);
    return newData;
  }, [updatedSets, attrList]);

  const hideEmptyResults = useMemo(() => {
    return applyHideEmpty(updatedAttributes, hideEmpty);
  }, [updatedAttributes, hideEmpty]);

  const degreeResults = useMemo(() => {
    return applyMinMaxDegree(hideEmptyResults, minDegree, maxDegree);
  }, [hideEmptyResults, minDegree, maxDegree]);

  const aggregationResults = useMemo(() => {
    return applyAggregation(
      updatedAttributes,
      degreeResults,
      firstAggregation,
      secondAggregation,
      firstOverlap,
      secondOverlap
    );
  }, [
    updatedAttributes,
    degreeResults,
    firstAggregation,
    secondAggregation,
    firstOverlap,
    secondOverlap
  ]);

  const sortResults = useMemo(() => {
    return applySort(
      updatedAttributes,
      aggregationResults,
      sortBy,
      sortBySetName,
      firstAggregation,
      secondAggregation
    );
  }, [
    updatedAttributes,
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

  const deviationLimit = useMemo(() => {
    const deviations = renderRows
      .map(r => r.element as any)
      .map((r: Subset | Group) => Math.abs(r.disproportionality) * 100);
    const deviationLimit = Math.max(...deviations);
    const devLimitRoundedTo5 = (Math.ceil(deviationLimit / 5) * 5) / 100;
    return devLimitRoundedTo5;
  }, [renderRows]);

  if (!data) return null;

  const sizes = renderRows.map(r => r.element.size);

  const maxSize = sizes.length > 0 ? Math.max(...sizes) : 0;

  if (cardinalityDomainLimit === -1 || cardinalityDomainLimit >= updatedAttributes.items.length) {
    setCardinalityDomainLimit(Math.max(maxSize));
  }

  function setNewCardinalityLimit(newLimit: number) {
    setCardinalityDomainLimit(newLimit);
  }

  const sizeValue = getSizeContextValue(
    updatedAttributes.usedSets.length,
    renderRows.length,
    updatedAttributes.selectedAttributes.length + 2
  );

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
        usedSets={updatedAttributes.usedSets}
        className={sets}
        maxSetSize={Math.max(...updatedAttributes.sets.map(d => d.size))}
        unusedSets={updatedAttributes.unusedSets}
        sortedSetName={sortBySetName}
      ></SelectedSets>
      <Matrix
        className={matrix}
        renderRows={renderRows}
        usedSets={updatedAttributes.usedSets}
      ></Matrix>
      <CardinalityContext.Provider
        value={{
          notifyCardinalityChange: setNewCardinalityLimit,
          localCardinalityLimit: cardinalityDomainLimit
        }}
      >
        <HeaderBar
          deviationLimit={deviationLimit}
          className={header}
          maxSize={updatedAttributes.items.length}
          attributes={updatedAttributes.selectedAttributes}
          unSelectedAttributes={updatedAttributes.unSelectedAttributes.map(d => d.name)}
        ></HeaderBar>
        <Body
          deviationLimit={deviationLimit}
          className={rows}
          renderRows={renderRows}
          maxSize={updatedAttributes.items.length}
          attributes={updatedAttributes.selectedAttributes}
          dataset={data.dataset}
        ></Body>
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

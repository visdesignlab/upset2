import React, { FC, useState, useEffect, useMemo } from 'react';
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
import { CardinalityContext, SizeContext, actions } from '../../Upset';
import { getSizeContextValue } from '../../Interfaces/SizeContext';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Subset } from '../../Interfaces/UpsetDatasStructure/Subset';
import { Group } from '../../Interfaces/UpsetDatasStructure/Group';

interface Props {
  store?: UpsetStore;
}

const MainUpsetView: FC<Props> = ({ store }: Props) => {
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

  useEffect(() => {
    if (selectedDataset) {
      setIsLoading(true);
      createData(selectedDataset)
        .then(d => {
          setData(d);
          actions.setVisibleSetsAndAttributes(
            d.usedSets.map(s => s.elementName),
            d.selectedAttributes.map(s => s.name)
          );
        })
        .finally(() => {
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          throw new Error(err);
        });
    }
  }, [selectedDataset]);

  let updatedData = data;

  const currentSets = data ? data.usedSets.map(d => d.elementName) : [];

  if (JSON.stringify(currentSets) !== JSON.stringify(visibleSets)) {
    updatedData = updateVisibleSets(updatedData, visibleSets);
  }

  const currentAttributes = data ? data?.selectedAttributes.map(d => d.name) : [];

  const attrList = Object.keys(visibleAttributes);

  if (JSON.stringify(currentAttributes.sort()) !== JSON.stringify(attrList.sort())) {
    updatedData = updateVisibleAttribute(updatedData, attrList);
  }

  const stringifiedData = JSON.stringify(updatedData);

  const hideEmptyResults = useMemo(() => {
    return applyHideEmpty(JSON.parse(stringifiedData), hideEmpty);
  }, [stringifiedData, hideEmpty]);

  const degreeResults = useMemo(() => {
    return applyMinMaxDegree(hideEmptyResults, minDegree, maxDegree);
  }, [hideEmptyResults, minDegree, maxDegree]);

  const aggregationResults = useMemo(() => {
    const agg = applyAggregation(
      JSON.parse(stringifiedData),
      degreeResults,
      firstAggregation,
      secondAggregation,
      firstOverlap,
      secondOverlap
    );

    return agg;
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

  if (cardinalityDomainLimit === -1 || cardinalityDomainLimit >= updatedData.items.length) {
    setCardinalityDomainLimit(Math.max(maxSize));
  }

  function setNewCardinalityLimit(newLimit: number) {
    setCardinalityDomainLimit(newLimit);
  }

  const sizeValue = getSizeContextValue(
    updatedData.usedSets.length,
    renderRows.length,
    updatedData.selectedAttributes.length + 2
  );

  const sizeValueString = JSON.stringify(sizeValue);

  return (
    <SizeContext.Provider value={sizeValueString}>
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
        usedSets={updatedData.usedSets}
        className={sets}
        maxSetSize={Math.max(...updatedData.sets.map(d => d.size))}
        unusedSets={updatedData.unusedSets}
        sortedSetName={sortBySetName}
      />
      <Matrix className={matrix} renderRows={renderRows} usedSets={updatedData.usedSets} />
      <CardinalityContext.Provider
        value={{
          notifyCardinalityChange: setNewCardinalityLimit,
          localCardinalityLimit: cardinalityDomainLimit
        }}
      >
        <HeaderBar
          deviationLimit={deviationLimit}
          className={header}
          maxSize={updatedData.items.length}
          attributes={updatedData.selectedAttributes}
          unSelectedAttributes={updatedData.unSelectedAttributes.map(d => d.name)}
        />
        <Body
          deviationLimit={deviationLimit}
          className={rows}
          renderRows={renderRows}
          maxSize={updatedData.items.length}
          attributes={updatedData.selectedAttributes}
          dataset={data.dataset}
        />
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

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
  applyAggregation
} from '../../Interfaces/UpsetDatasStructure/Data';
import SelectedSets from './SelectedSets';
import Matrix from './Matrix';
import HeaderBar from './HeaderBar';
import { BaseElement } from '../../Interfaces/UpsetDatasStructure/BaseElement';

interface Props {
  store?: UpsetStore;
}

const MainUpsetView: FC<Props> = ({ store }: Props) => {
  const {
    selectedDataset,
    hideEmpty,
    minDegree,
    maxDegree,
    sortBy,
    sortBySetName,
    firstAggregation,
    secondAggregation
  } = store!;
  const [data, setData] = useState<Data>(null as any);
  const stringifiedData = JSON.stringify(data);

  useEffect(() => {
    if (selectedDataset) {
      createData(selectedDataset)
        .then(d => {
          if (stringifiedData !== JSON.stringify(d)) {
            setData(d);
          }
        })
        .catch(err => {
          console.error(err);
          throw new Error(err);
        });
    }
  }, [stringifiedData, selectedDataset]);

  const hideEmptyResults = useMemo(() => {
    return applyHideEmpty(JSON.parse(stringifiedData), hideEmpty);
  }, [stringifiedData, hideEmpty]);

  const degreeResults = useMemo(() => {
    return applyMinMaxDegree(hideEmptyResults, minDegree, maxDegree);
  }, [hideEmptyResults, minDegree, maxDegree]);

  const aggregationResults = useMemo(() => {
    return applyAggregation(degreeResults, firstAggregation, secondAggregation);
  }, [degreeResults, firstAggregation, secondAggregation]);

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

  if (cardinalityDomainLimit === -1) {
    setCardinalityDomainLimit(
      Math.max(...renderRows.map(d => d.element).map(d => (d as BaseElement).size))
    );
  }

  function setNewCardinalityLimit(newLimit: number) {
    setCardinalityDomainLimit(newLimit);
  }

  const setSizeHeight = 75;
  const setLabelHeight = 100;
  const headerHeight = setSizeHeight + setLabelHeight;
  const angle = 45;
  const columnWidth = 20;
  const totalMatrixWidth = setLabelHeight + data.usedSets.length * columnWidth;
  const rowHeight = 20;
  const matrixHeight = renderRows.length * rowHeight;
  const attributeWidth = 200;
  const padding = 10;
  const totalHeaderWidth = (attributeWidth + padding) * 2;

  return (
    <>
      <SelectedSets
        key={sortBySetName}
        totalWidth={totalMatrixWidth}
        totalHeight={headerHeight}
        usedSets={data.usedSets}
        className={sets}
        headerBarHeight={setSizeHeight}
        headerLabelHeight={setLabelHeight}
        columnWidth={columnWidth}
        maxSetSize={Math.max(...data.sets.map(d => d.size))}
        angle={angle}
        sortedSetName={sortBySetName}
      ></SelectedSets>
      <HeaderBar
        className={header}
        width={totalHeaderWidth}
        height={headerHeight}
        padding={padding}
        attributeWidth={attributeWidth}
        maxSize={data.items.length}
        localDomainLimit={cardinalityDomainLimit}
        notifyCardinalityChange={setNewCardinalityLimit}
      ></HeaderBar>
      <Matrix
        className={matrix}
        totalHeight={matrixHeight}
        totalWidth={totalMatrixWidth}
        offset={setLabelHeight}
        matrixColWidth={totalMatrixWidth - setLabelHeight}
        renderRows={renderRows}
        rowHeight={rowHeight}
        usedSets={data.usedSets}
      ></Matrix>
      <svg className={rows}></svg>
    </>
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

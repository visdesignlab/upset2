import React, { FC, useState, useEffect, useMemo } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { style } from 'typestyle';
import { Data, createData, getRenderRows } from '../../Interfaces/UpsetDatasStructure/Data';
import SelectedSets from './SelectedSets';
import Matrix from './Matrix';

interface Props {
  store?: UpsetStore;
}

const MainUpsetView: FC<Props> = ({ store }: Props) => {
  const { selectedDataset, hideEmpty, minDegree, maxDegree, sortBy } = store!;
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

  const renderRows = useMemo(() => {
    return getRenderRows(JSON.parse(stringifiedData), hideEmpty, minDegree, maxDegree, sortBy);
  }, [stringifiedData, hideEmpty, maxDegree, minDegree, sortBy]);

  if (!data) return null;

  const setSizeHeight = 75;
  const setLabelHeight = 100;
  const headerHeight = setSizeHeight + setLabelHeight;
  const angle = 45;
  const columnWidth = 20;
  const totalMatrixWidth = setLabelHeight + data.usedSets.length * columnWidth;
  const rowHeight = 20;
  const matrixHeight = renderRows.length * rowHeight;

  return (
    <>
      <SelectedSets
        totalWidth={totalMatrixWidth}
        totalHeight={headerHeight}
        usedSets={data.usedSets}
        className={sets}
        headerBarHeight={setSizeHeight}
        headerLabelHeight={setLabelHeight}
        columnWidth={columnWidth}
        maxSetSize={Math.max(...data.sets.map(d => d.size))}
        angle={angle}
      ></SelectedSets>
      <svg height={headerHeight} className={header}></svg>
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

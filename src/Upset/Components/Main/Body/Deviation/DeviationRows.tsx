import React, { FC, useMemo } from 'react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { RenderRows } from '../../../../Interfaces/UpsetDatasStructure/Data';
import { getRowTransitions } from '../../RowTransitions';
import { scaleLinear } from 'd3';
import { NodeGroup } from 'react-move';
import { BaseElement } from '../../../../Interfaces/UpsetDatasStructure/BaseElement';
import translate from '../../../ComponentUtils/Translate';
import DeviationRow from './DeviationRow';

interface DeviationRowsProps {
  store?: UpsetStore;
  width: number;
  rows: RenderRows;
  rowHeight: number;
  padding: number;
  deviationLimit: number;
}

const DeviationRows: FC<DeviationRowsProps> = ({
  width,
  rows,
  rowHeight,
  padding,
  deviationLimit
}: DeviationRowsProps) => {
  const { enter, leave, start, update } = getRowTransitions(rowHeight);

  const scale = useMemo(() => {
    const scale = scaleLinear()
      .domain([0, deviationLimit])
      .range([0, width / 2]);

    return scale;
  }, [width, deviationLimit]);

  return (
    <NodeGroup
      keyAccessor={row => row.id}
      data={rows}
      start={start}
      update={update}
      leave={leave}
      enter={enter}
    >
      {renderRows => {
        return (
          <g>
            {renderRows.map(row => {
              const { data, key, state } = row;
              const element = data.element as BaseElement;
              return (
                <g key={key} transform={translate(0, state.y)}>
                  <DeviationRow
                    id={key}
                    element={element}
                    elementType={element.type}
                    width={width}
                    height={rowHeight}
                    padding={padding}
                    scale={scale}
                  ></DeviationRow>
                </g>
              );
            })}
          </g>
        );
      }}
    </NodeGroup>
  );
};

export default inject('store')(observer(DeviationRows));

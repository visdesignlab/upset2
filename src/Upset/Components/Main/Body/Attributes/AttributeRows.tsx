import React, { FC, useMemo } from 'react';
import { inject, observer } from 'mobx-react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { AttributeRenderRows } from '../../../../Interfaces/UpsetDatasStructure/Data';
import { getRowTransitions } from '../../RowTransitions';
import { Attribute } from '../../../../Interfaces/UpsetDatasStructure/Attribute';
import { scaleLinear } from 'd3';
import { NodeGroup } from 'react-move';
import translate from '../../../ComponentUtils/Translate';
import AttributeRow, { AttributeVisualizationType } from './AttributeRow';

interface AttributeRowsProps {
  store?: UpsetStore;
  width: number;
  rows: AttributeRenderRows;
  rowHeight: number;
  padding: number;
  attribute: Attribute;
  renderType: AttributeVisualizationType;
}

const AttributeRows: FC<AttributeRowsProps> = ({
  width,
  rows,
  rowHeight,
  padding,
  attribute,
  renderType
}: AttributeRowsProps) => {
  const { enter, leave, update, start } = getRowTransitions(rowHeight);

  const { max = 0, min = 0 } = attribute;

  const scale = useMemo(() => {
    const scale = scaleLinear()
      .domain([min, max])
      .range([0, width])
      .nice();
    return scale;
  }, [max, min, width]);

  return (
    <g>
      <NodeGroup
        keyAccessor={row => row.id}
        data={rows}
        start={start}
        enter={enter}
        leave={leave}
        update={update}
      >
        {renderRows => {
          return (
            <g>
              {renderRows.map(row => {
                const { data, key, state } = row;

                return (
                  <g key={key} transform={translate(0, state.y)}>
                    <AttributeRow
                      id={key}
                      renderRow={data}
                      width={width}
                      height={rowHeight}
                      padding={padding}
                      scale={scale}
                      renderType={renderType}
                    ></AttributeRow>
                  </g>
                );
              })}
            </g>
          );
        }}
      </NodeGroup>
    </g>
  );
};

export default inject('store')(observer(AttributeRows));

import React, { FC, useContext, useMemo } from 'react';
import { UpsetStore } from '../../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { RenderRows } from '../../../Interfaces/UpsetDatasStructure/Data';
import { NodeGroup } from 'react-move';
import { scaleLinear } from 'd3';
import CardinalityRow from './CardinalityRow';
import { BaseElement } from '../../../Interfaces/UpsetDatasStructure/BaseElement';
import { CardinalityContext } from '../../../Upset';
import { getRowTransitions } from '../RowTransitions';

interface Props {
  store?: UpsetStore;
  width: number;
  rows: RenderRows;
  rowHeight: number;
  padding: number;
}

const CardinalityRows: FC<Props> = ({ width, rows, rowHeight, padding }: Props) => {
  const { enter, leave, update, start } = getRowTransitions(rowHeight);

  const { localCardinalityLimit } = useContext(CardinalityContext);

  const cardinalityScale = useMemo(() => {
    const scale = scaleLinear()
      .domain([0, localCardinalityLimit])
      .range([0, width]);

    return scale;
  }, [localCardinalityLimit, width]);

  return (
    <g>
      <NodeGroup
        keyAccessor={row => row.id}
        data={rows}
        start={start}
        enter={enter}
        update={update}
        leave={leave}
      >
        {rendRows => {
          return (
            <g>
              {rendRows.map(row => {
                const { data, key, state } = row;
                const element = data.element as BaseElement;
                return (
                  <g key={key} transform={`translate(0, ${state.y})`}>
                    <CardinalityRow
                      id={key}
                      element={element}
                      elementType={element.type}
                      width={width}
                      height={rowHeight}
                      padding={padding}
                      scale={cardinalityScale}
                    ></CardinalityRow>
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

export default inject('store')(observer(CardinalityRows));

import React, { FC, useMemo, useContext } from 'react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { RenderRows } from '../../../../Interfaces/UpsetDatasStructure/Data';
import { NodeGroup } from 'react-move';
import { getRowTransitions } from '../../RowTransitions';
import { BaseElement } from '../../../../Interfaces/UpsetDatasStructure/BaseElement';
import SurpriseCardinalityRow from './SurpriseCardinalityRow';
import { scaleLinear } from 'd3';
import { ProvenanceContext } from '../../../../Upset';

interface Props {
  store?: UpsetStore;
  rows: RenderRows;
  rowHeight: number;
  width: number;
  padding: number;
  globalCardinalityLimit: number;
}

const SurpriseCardinalityRows: FC<Props> = ({
  rows,
  rowHeight,
  width,
  padding,
  globalCardinalityLimit
}: Props) => {
  const { enter, leave, update, start } = getRowTransitions(rowHeight);

  const { provenance } = useContext(ProvenanceContext);

  const scale = useMemo(() => {
    const scale = scaleLinear()
      .domain([0, globalCardinalityLimit])
      .range([0, width])
      .nice();

    return scale;
  }, [globalCardinalityLimit, width]);

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
                    <SurpriseCardinalityRow
                      id={key}
                      element={element}
                      elementType={element.type}
                      width={width}
                      height={rowHeight}
                      padding={padding}
                      scale={scale}
                    ></SurpriseCardinalityRow>
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

export default inject('store')(observer(SurpriseCardinalityRows));

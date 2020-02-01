import React, { FC } from 'react';
import { inject, observer } from 'mobx-react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { RenderRows } from '../../../../Interfaces/UpsetDatasStructure/Data';
import { Attributes } from '../../../../Interfaces/UpsetDatasStructure/Attribute';
import { DSVParsedArray, DSVRowString, selectAll } from 'd3';
import { NodeGroup } from 'react-move';
import { getRowTransitions } from '../../RowTransitions';
import { BaseElement } from '../../../../Interfaces/UpsetDatasStructure/BaseElement';
import translate from '../../../ComponentUtils/Translate';
import groupRow from '../../GroupStyle';
import highlight from '../../HighlightedStyle';
import AttributeRow from './AttributeRow';

export interface AttributeRowsProps {
  store?: UpsetStore;
  rows: RenderRows;
  rowHeight: number;
  padding: number;
  attributes: Attributes;
  attributeWidth: number;
  dataset: DSVParsedArray<DSVRowString>;
}

const AttributeRows: FC<AttributeRowsProps> = ({
  rows,
  rowHeight,
  padding,
  attributes,
  dataset,
  attributeWidth
}: AttributeRowsProps) => {
  const { enter, leave, start, update } = getRowTransitions(rowHeight);

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
          <>
            {renderRows.map(row => {
              const { data, key, state } = row;
              const element = data.element as BaseElement;

              return (
                <g key={key} transform={translate(0, state.y)}>
                  <rect
                    className={element.type === 'Group' ? groupRow : `R_${key}`}
                    height={rowHeight}
                    width={(padding + attributeWidth) * attributes.length}
                    fill="none"
                    pointerEvents="all"
                    onMouseOver={() => {
                      selectAll(`.R_${key}`).classed(highlight, true);
                    }}
                    onMouseLeave={() => {
                      selectAll(`.R_${key}`).classed(highlight, false);
                    }}
                  />
                  <AttributeRow
                    attributes={attributes}
                    element={element}
                    width={attributeWidth}
                    padding={padding}
                    height={rowHeight}
                    dataset={dataset}
                  />
                </g>
              );
            })}
          </>
        );
      }}
    </NodeGroup>
  );
};

export default inject('store')(observer(AttributeRows));

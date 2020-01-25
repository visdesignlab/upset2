import React, { FC, useContext } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import CardinalityHeader from './Header/CardinalityHeader';
import { SizeContext, ProvenanceContext } from '../../Upset';
import SurpriseCardinalityHeader from './Header/SurpriseCardinalityHeader';
import translate from '../ComponentUtils/Translate';
import DeviationHeader from './Header/DeviationHeader';
import { Attributes } from '../../Interfaces/UpsetDatasStructure/Attribute';
import AttributeHeader from './Header/Attributes/AttributeHeader';
import { style } from 'typestyle';
import { Dropdown } from 'semantic-ui-react';

interface Props {
  className: string;
  store?: UpsetStore;
  maxSize: number;
  deviationLimit: number;
  attributes: Attributes;
  unSelectedAttributes: string[];
}

const HeaderBar: FC<Props> = ({
  className,
  maxSize,
  deviationLimit,
  attributes,
  unSelectedAttributes
}: Props) => {
  const {
    attributes: { totalHeaderWidth: width, attributePadding: padding, attributeWidth },
    usedSetsHeader: { totalHeaderHeight: height }
  } = useContext(SizeContext);

  const { actions } = useContext(ProvenanceContext);

  const cardinalityHeader = (
    <CardinalityHeader
      globalDomainLimit={maxSize}
      height={height}
      width={attributeWidth}
    ></CardinalityHeader>
  );

  const surpriseCardinality = (
    <SurpriseCardinalityHeader
      height={height}
      width={attributeWidth}
      globalDomainLimit={maxSize}
    ></SurpriseCardinalityHeader>
  );

  const deviationHeader = (
    <DeviationHeader
      height={height}
      width={attributeWidth}
      deviationLimit={deviationLimit}
    ></DeviationHeader>
  );

  const headers: JSX.Element[] = [];

  const attributeHeaders = attributes.map((attr, idx) => {
    return (
      <g key={attr.name} transform={translate((padding + attributeWidth) * idx, 0)}>
        <AttributeHeader
          name={attr.name}
          height={height}
          width={attributeWidth}
          minScale={attr.min || 0}
          maxScale={attr.max || 0}
        ></AttributeHeader>
      </g>
    );
  });

  // const headersToAdd = { cardinalityHeader, surpriseCardinality, deviationHeader };
  const headersToAdd = { cardinalityHeader, deviationHeader, attributeHeaders };

  Object.entries(headersToAdd).forEach((header, idx) => {
    const [key, val] = header;
    headers.push(
      <g key={key} transform={translate(padding * (idx + 1) + attributeWidth * idx, 0)}>
        {val}
      </g>
    );
  });

  const options = unSelectedAttributes.map(attr => ({
    key: attr,
    text: attr,
    value: attr
  }));

  return (
    <div className={parentDiv}>
      <svg className={className} width={width} height={height}>
        {headers}
      </svg>
      {unSelectedAttributes.length !== 0 && (
        <div key={unSelectedAttributes.length} className={addAttributesDiv}>
          <Dropdown
            text="Add Attribute"
            search
            options={options}
            onChange={(_, data) => {
              const selection = data.value;
              if (selection) {
                actions.addAttribute(selection as string);
              }
            }}
            selectOnBlur={false}
          ></Dropdown>
        </div>
      )}
    </div>
  );
};

export default inject('store')(observer(HeaderBar));

const addAttributesDiv = style({
  position: 'absolute',
  top: 0,
  left: 0
});

const parentDiv = style({
  position: 'relative'
});

import React, { FC, useContext } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import CardinalityHeader from './Header/CardinalityHeader';
import { SizeContext } from '../../Upset';
import SurpriseCardinalityHeader from './Header/SurpriseCardinalityHeader';
import translate from '../ComponentUtils/Translate';
import DeviationHeader from './Header/DeviationHeader';

interface Props {
  className: string;
  store?: UpsetStore;
  maxSize: number;
  deviationLimit: number;
}

const HeaderBar: FC<Props> = ({ className, maxSize, deviationLimit }: Props) => {
  const {
    attributes: { totalHeaderWidth: width, attributePadding: padding, attributeWidth },
    usedSetsHeader: { totalHeaderHeight: height }
  } = useContext(SizeContext);

  return (
    <svg className={className} width={width} height={height}>
      <g transform={`translate(${padding}, 0)`}>
        <CardinalityHeader
          globalDomainLimit={maxSize}
          height={height}
          width={attributeWidth}
        ></CardinalityHeader>
      </g>
      <g transform={`translate(${padding + attributeWidth + padding}, 0)`}>
        <SurpriseCardinalityHeader
          height={height}
          width={attributeWidth}
          globalDomainLimit={maxSize}
        ></SurpriseCardinalityHeader>
      </g>
      <g transform={translate((padding + attributeWidth) * 2 + padding, 0)}>
        <DeviationHeader
          height={height}
          width={attributeWidth}
          deviationLimit={deviationLimit}
        ></DeviationHeader>
      </g>
    </svg>
  );
};

export default inject('store')(observer(HeaderBar));

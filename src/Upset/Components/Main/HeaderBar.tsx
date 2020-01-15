import React, { FC, useContext } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import CardinalityHeader from './Header/CardinalityHeader';
import { SizeContext } from '../../Upset';
import SurpriseCardinalityHeader from './Header/SurpriseCardinalityHeader';

interface Props {
  className: string;
  store?: UpsetStore;
  maxSize: number;
}

const HeaderBar: FC<Props> = ({ className, maxSize }: Props) => {
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
      <g transform={`translate(${padding + attributeWidth + padding})`}>
        <SurpriseCardinalityHeader
          height={height}
          width={attributeWidth}
          globalDomainLimit={maxSize}
        ></SurpriseCardinalityHeader>
      </g>
    </svg>
  );
};

export default inject('store')(observer(HeaderBar));

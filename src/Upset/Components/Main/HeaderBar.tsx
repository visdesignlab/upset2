import React, { FC } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import CardinalityHeader from './Header/CardinalityHeader';

interface Props {
  className: string;
  store?: UpsetStore;
  height: number;
  width: number;
  padding: number;
  attributeWidth: number;
  maxSize: number;
}

const HeaderBar: FC<Props> = ({
  className,
  height,
  width,
  padding,
  attributeWidth,
  maxSize
}: Props) => {
  return (
    <svg className={className} width={width} height={height}>
      <g transform={`translate(${padding}, 0)`}>
        <CardinalityHeader
          globalDomainLimit={maxSize}
          height={height}
          width={attributeWidth}
        ></CardinalityHeader>
      </g>
    </svg>
  );
};

export default inject('store')(observer(HeaderBar));

import { useMemo } from 'react';

const margin = 5;

const barWidth = 20;
const matrixColumnBarHeight = 75;
const matrixLabelHeight = 100;
const matrixAngle = 45;
const attributeWidth = 200;

export function calculateDimensions(
  nVisibleSets: number = 0,
  nIntersections: number = 0,
) {
  const header = {
    matrixColumn: {
      barWidth: barWidth,
      width: nVisibleSets * barWidth + matrixLabelHeight,
      height: matrixColumnBarHeight,
      labelHeight: matrixLabelHeight,
      angle: matrixAngle,
    },
    margin: 20,
    cardinality: {
      width: attributeWidth,
      scaleHeight: 30,
      gap: 3,
      buttonHeight: 25,
      height: function () {
        return 2 * this.scaleHeight + 2 * this.gap + this.buttonHeight;
      },
    },
    height: function () {
      return this.matrixColumn.height + this.matrixColumn.labelHeight;
    },
    width: function () {
      return (
        this.matrixColumn.width +
        this.margin +
        this.cardinality.width +
        this.margin
      );
    },
  };

  const body = {
    rowHeight: 20,
    rowWidth:
      nVisibleSets * barWidth +
      header.margin +
      header.cardinality.width +
      header.margin,
    height: function () {
      return nIntersections * this.rowHeight;
    },
    width: function () {
      return this.rowWidth;
    },
  };

  return {
    barWidth,
    header,
    body,
    height: header.height() + 5 + body.height(),
    width: header.width(),
    margin,
  };
}

export function useUpsetDimensions(
  nVisibleSets: number,
  nIntersections: number,
) {
  const dimensions = useMemo(() => {
    return calculateDimensions(nVisibleSets, nIntersections);
  }, [nVisibleSets, nIntersections]);

  return dimensions;
}

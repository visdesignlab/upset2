import convertToRadian from '../Utils/convertToRadian';

export interface SizeContextShape {
  usedSetsHeader: {
    setSizeBarHeight: number;
    setLabelsHeight: number;
    totalHeaderHeight: number;
    setLabelAngleDegrees: number;
    setLabelAngleRadians: number;
  };
  matrix: {
    columnWidth: number;
    totalMatrixWidth: number;
  };
  attributes: {
    attributeWidth: number;
    attributePadding: number;
    totalHeaderWidth: number;
  };
  rowHeight: number;
  matrixHeight: number;
}

export function getSizeContextValue(
  usedSetsCount: number,
  rowCount: number,
  attributeCount: number
): SizeContextShape {
  const setSizeBarHeight = 75;
  const setLabelsHeight = 100;
  const totalHeaderHeight = setSizeBarHeight + setLabelsHeight;
  const setLabelAngleDegrees = 45;
  const setLabelAngleRadians = convertToRadian(setLabelAngleDegrees);
  const columnWidth = 20;
  const totalMatrixWidth = setLabelsHeight + usedSetsCount * columnWidth;
  const rowHeight = 20;
  const matrixHeight = rowCount * rowHeight;
  const attributeWidth = 200;
  const attributePadding = 10;
  const totalHeaderWidth = (attributeWidth + attributePadding) * attributeCount;

  return {
    usedSetsHeader: {
      setSizeBarHeight,
      setLabelsHeight,
      totalHeaderHeight,
      setLabelAngleDegrees,
      setLabelAngleRadians
    },
    matrix: {
      columnWidth,
      totalMatrixWidth
    },
    attributes: {
      attributeWidth,
      attributePadding,
      totalHeaderWidth
    },
    rowHeight,
    matrixHeight
  };
}

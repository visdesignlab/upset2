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
      barWidth,
      width: nVisibleSets * barWidth + matrixLabelHeight,
      height: matrixColumnBarHeight,
      labelHeight: matrixLabelHeight,
      angle: matrixAngle,
    },
    margin: 20,
    cardinality: {
      width: attributeWidth,
      scaleHeight: 30,
      plotHeight: 18,
      gap: 3,
      buttonHeight: 25,
      textMargin: 70,
      height() {
        return 2 * this.scaleHeight + 2 * this.gap + this.buttonHeight;
      },
    },
    attribute: {
      width: attributeWidth,
      scaleHeight: 30,
      buttonHeight: 25,
      gap: 3,
      plotHeight: 18,
      height() {
        return this.scaleHeight + this.gap + this.buttonHeight;
      },
    },
    height() {
      return this.matrixColumn.height + this.matrixColumn.labelHeight;
    },
    width() {
      return (
        this.matrixColumn.width +
        this.margin +
        this.cardinality.width +
        this.cardinality.textMargin +
        this.attribute.width +
        this.margin
      );
    },
  };

  const body = {
    rowHeight: 24,
    rowWidth: header.width(),
    height() {
      return nIntersections * this.rowHeight;
    },
    width() {
      return this.rowWidth;
    },
    aggregateOffset: 15,
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

export function calculateDimensions(
  nVisibleSets: number = 0,
  nHiddenSets: number = 0,
  nIntersections: number = 0,
  nAttributes: number = 0,
) {
  const gap = 20;

  const margin = 5;

  const xOffset = 30;

  const attribute = {
    width: 200,
    labelHeight: 20,
    vGap: 25,
    gap: 5,
    scaleHeight: 30,
    buttonHeight: 25,
    plotHeight: 18,
    get height() {
      return this.scaleHeight + this.gap + this.buttonHeight;
    },
  };

  const set = {
    width: 20,
    size: {
      height: 100,
    },
    label: {
      height: 100,
      skew: 45,
    },
  };

  const matrixColumn = {
    visibleSetsWidth: set.width * nVisibleSets,
    setManagementWidth: 230,
    hiddenSetsWidth: (set.width + 2) * nHiddenSets,
    width: xOffset + set.width * nVisibleSets,
    get totalWidth() {
      return this.width + gap + this.setManagementWidth + gap;
    },
  };

  const size = {
    scaleHeight: 26,
    buttonHeight: 25,
    gap: 3,
    textMargin: 30,
    plotHeight: attribute.plotHeight,
    get height() {
      return 2 * this.scaleHeight + 2 * this.gap + this.buttonHeight;
    },
    get width() {
      return attribute.width + this.textMargin;
    },
  };

  const bookmarkStar = {
    width: 20,
    height: 24,
    gap: 10,
  };

  const sidebar = {
    width: 250,
  };

  const header = {
    totalWidth:
      set.label.height + // Label Height === Label Width
      set.width * nVisibleSets + // Offset for total sets
      gap + // Add margin
      size.width + // Size
      bookmarkStar.gap +
      bookmarkStar.width + // Bookmark Star
      bookmarkStar.gap +
      attribute.width + // Deviation
      attribute.vGap +
      (attribute.vGap + attribute.width) * nAttributes, // Show all attributes
    totalHeight: set.size.height + set.label.height,
  };

  const body = {
    rowHeight: 24,
    rowWidth: header.totalWidth,
    aggregateOffset: 15,
    get height() {
      return nIntersections * this.rowHeight;
    },
  };

  const totalWidth =
    matrixColumn.totalWidth > header.totalWidth
      ? matrixColumn.totalWidth
      : header.totalWidth;

  return {
    height: header.totalHeight / 4 + body.height,
    width: totalWidth,
    xOffset,
    size,
    bookmarkStar,
    body,
    matrixColumn,
    margin,
    gap,
    attribute,
    set,
    header,
    sidebar,
  };
}

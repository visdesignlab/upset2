/**
 * Calculates the dimensions of the plot
 * @param nVisibleSets Number of visible sets
 * @param nHiddenSets Number of hidden sets
 * @param nIntersections TOTAL Number of intersections, including aggregates
 * @param nAttributes Number of visible attributes, excluding Degree
 * @param nTallRows Number of rows that require additional height (e.g., aggregate rows with types defined in TALL_ROW_TYPES)
 * @param degree Whether to show the Degree column
 * @returns The dimensions of the plot, in an object with a variety of fields
 */
export function calculateDimensions(
  nVisibleSets = 0,
  nHiddenSets = 0,
  nIntersections = 0,
  nTallRows = 0,
  nAttributes = 0,
  degree = false,
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
    dotSize: 5,
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

  const degreeColumn = {
    width: 40,
    gap: 10,
  };

  const sidebar = {
    width: 250,
  };

  const header = {
    totalWidth:
      matrixColumn.width + // Matrix Column
      bookmarkStar.gap +
      bookmarkStar.width + // Bookmark Star
      bookmarkStar.gap +
      size.width + // Size
      gap + // Gap for size labels
      (degree ? degreeColumn.width + // Degree Column
      degreeColumn.gap : 0) + // Add margin
      (attribute.width + attribute.vGap) * nAttributes, // Attributes
    totalHeight: set.size.height + set.label.height,
    buttonXOffset: 5,
  };

  const body = {
    rowHeight: 24,
    /** Height for a 'Sets' or 'Overlaps' type aggregate row, which needs to be taller to show set membership. */
    aggRowHeight: 44,
    rowWidth: header.totalWidth,
    aggregateOffset: 15,
    get height() {
      return (nIntersections - nTallRows) * this.rowHeight + nTallRows * this.aggRowHeight;
    },
  };

  const totalWidth =
    matrixColumn.totalWidth > header.totalWidth
      ? matrixColumn.totalWidth
      : header.totalWidth;

  const setQuery = {
    width: body.rowWidth,
    height: body.rowHeight * 5,
    spacer: 5,
  };

  return {
    height: header.totalHeight / 4 + body.height,
    width: totalWidth,
    xOffset,
    size,
    bookmarkStar,
    degreeColumn,
    body,
    matrixColumn,
    margin,
    gap,
    attribute,
    set,
    header,
    sidebar,
    setQuery,
  };
}

/** Types of aggregate row requiring additional height. These should use body.aggRowHeight */
export const TALL_ROW_TYPES = ['Sets', 'Overlaps'];

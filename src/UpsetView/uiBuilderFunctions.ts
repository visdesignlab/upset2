import { AggregateBy } from "./../DataStructure/AggregateAndFilters";
import { UnusedSetViewModel } from "./../UnusedSetsView/UnusedSetViewModel";
import { Attribute } from "./../DataStructure/Attribute";
import { Data } from "./../DataStructure/Data";
import { Group } from "./../DataStructure/Group";
import { SubSet } from "./../DataStructure/SubSet";
import { d3Selection, RenderRow, d3Scale } from "./../type_declarations/types";
import { Set } from "./../DataStructure/Set";
import params, { deg2rad } from "./ui_params";
import * as d3 from "d3";
import { Mitt, Application } from "provenance_mvvm_framework";
import { RowType } from "../DataStructure/RowType";
import { BaseType } from "d3";
import { EmbedConfig } from "../DataStructure/EmbedConfig";
import { UnusedSetView } from "../UnusedSetsView/UnusedSetView";
import html from "./closeicon.view.html";

export const excludeSets = ["Name", "Set Count", "Sets"];
const attributeName = "data-attribute-name";

// ################################################################################################
export function usedSetsHeader(
  data: Set[],
  el: d3Selection,
  maxSetSize: number,
  comm: Mitt
) {
  addHeaderBars(data, el, maxSetSize, comm);
  addConnectors(data, el, comm);
}

function addHeaderBars(
  data: Set[],
  el: d3Selection,
  maxSetSize: number,
  comm: Mitt
) {
  let headerBarGroup: d3Selection = el.selectAll(".header-bar-group").data([1]);

  headerBarGroup.exit().remove();

  let _headers: d3Selection = headerBarGroup
    .enter()
    .append("g")
    .attr("class", "header-bar-group")
    .merge(headerBarGroup)
    .selectAll(".header")
    .data(data);
  _headers
    .exit()
    .transition()
    .duration(100)
    .remove();

  let headers = _headers
    .enter()
    .append("g")
    .merge(_headers)
    .html("")
    .attr("class", "header delete-cursor");

  headers
    .transition()
    .duration(100)
    .attr("transform", (d, i) => {
      return `translate(${params.column_width * i}, 0)`;
    });

  headers
    .on("click", (d, i) => {
      comm.emit("remove-set-trigger", d);
    })
    .on("mouseover", (d, i) => {
      d3.selectAll(`.S_${i}`).classed("highlight", true);
    })
    .on("mouseout", (d, i) => {
      d3.selectAll(`.S_${i}`).classed("highlight", false);
    });

  addBackgroundBars(headers);
  addForegroundBars(headers, maxSetSize);
}

function addBackgroundBars(headers: d3Selection) {
  headers
    .append("rect")
    .attr("height", params.used_set_header_height)
    .attr("width", params.column_width)
    .attr("class", (d, i) => {
      return `used-set-background S_${i}`;
    });
}

function addForegroundBars(headers: d3Selection, maxSetSize: number) {
  let scale = d3
    .scaleLinear()
    .domain([0, maxSetSize])
    .nice()
    .range([0, params.used_set_header_height]);

  headers
    .append("rect")
    .attr("height", (d, i) => {
      return scale(d.setSize);
    })
    .attr("width", params.column_width)
    .attr("class", "used-set-foreground")
    .attr("transform", (d, i) => {
      return `translate(0, ${params.used_set_header_height -
        scale(d.setSize)})`;
    });
}

function addConnectors(data: Set[], el: d3Selection, comm: Mitt) {
  let connectorGroup: d3Selection = el.selectAll(".connector-group").data([1]);
  connectorGroup.exit().remove();

  let _connectors: d3Selection = connectorGroup
    .enter()
    .append("g")
    .merge(connectorGroup)
    .attr("class", "connector-group")
    .attr("transform", `translate(0, ${params.used_set_header_height})`)
    .selectAll(".connector")
    .data(data);
  _connectors
    .exit()
    .transition()
    .duration(100)
    .remove();

  let connectors: d3Selection = _connectors
    .enter()
    .append("g")
    .merge(_connectors)
    .html("")
    .attr("class", "connector")
    .on("mouseover", (d, i) => {
      d3.selectAll(`.S_${i}`).classed("highlight", true);
    })
    .on("mouseout", (d, i) => {
      d3.selectAll(`.S_${i}`).classed("highlight", false);
    });

  connectors
    .transition()
    .duration(100)
    .attr("transform", (d, i) => {
      return `translate(${params.column_width * i}, 0)`;
    });

  connectors.on("click", (d, i) => {
    comm.emit("sort-by-set", i);
  });

  addConnectorBars(connectors);
  addConnectorLabels(connectors);
}

function addConnectorBars(connectors: d3Selection) {
  connectors
    .append("rect")
    .attr("class", (d, i) => {
      return `connector-rect S_${i}`;
    })
    .attr("width", params.column_width)
    .attr("height", params.used_set_connector_height)
    .attr("transform", `skewX(${params.used_set_connector_skew})`);
}

function addConnectorLabels(connectors: d3Selection) {
  connectors
    .append("text")
    .text((d: Set) => {
      return d.elementName;
    })
    .attr("class", "set-label")
    .attr("text-anchor", "end")
    .attr(
      "transform",
      `translate(${params.skew_offset +
        (params.column_width *
          Math.sin(deg2rad(params.used_set_connector_skew))) /
          2},${params.used_set_connector_height})rotate(${
        params.used_set_connector_skew
      })`
    );
}

// ################################################################################################
export function addCardinalityHeader(
  totalSize: number,
  maxSetSize: number,
  el: d3Selection,
  comm: Mitt
) {
  el.attr(
    "transform",
    `translate(${params.skew_offset +
      params.combinations_width +
      params.column_width}, ${params.header_height -
      params.header_body_padding -
      params.cardinality_scale_group_height})`
  );

  el.html("");
  let overviewAxis = el.append("g").attr("class", "overview-axis");
  let detailsAxis = el.append("g").attr("class", "details-axis");
  let cardinalitySlider = el.append("g").attr("class", "cardinality-slider");
  let sliderBrush = el.append("g").attr("class", "slider-brush-group");
  let cardinalityLabel = el
    .append("g")
    .attr("class", "cardinality-label-group")
    .on("click", () => {
      comm.emit("sort-by-cardinality");
    });

  let scaleOverview = getCardinalityScale(totalSize, params.cardinality_width);
  addOverviewAxis(overviewAxis, scaleOverview, totalSize);

  addCardinalitySlider(cardinalitySlider, maxSetSize, scaleOverview, comm);
  addBrush(sliderBrush, scaleOverview(maxSetSize));
  addCardinalityLabel(cardinalityLabel);
  let scaleDetails = getCardinalityScale(maxSetSize, params.cardinality_width);
  addDetailAxis(detailsAxis, scaleDetails, maxSetSize);
}

function addOverviewAxis(el: d3Selection, scale: d3Scale, totalSize: number) {
  el.attr("transform", "translate(0,0)");

  let top = el.append("g").attr("class", "top-axis");
  top
    .append("path")
    .attr("class", "axis")
    .attr("d", "M0,6 V0 h200 v6");

  let ticksArr = calculateTicksToShow(totalSize);
  let ticksG = addTicks(top, ticksArr, scale, 0);
  addTickLabels(ticksG);

  let bottom = el.append("g").attr("class", "bottom-axis");
  bottom
    .append("path")
    .attr("class", "axis")
    .attr("d", `M0,${params.axis_offset} H200`);
  addTicks(bottom, ticksArr, scale, params.axis_offset - 6);
}

function addCardinalitySlider(
  el: d3Selection,
  maxSetSize: number,
  scale: d3Scale,
  comm: Mitt
) {
  el.attr(
    "transform",
    `translate(${scale(maxSetSize)},${params.axis_offset / 2 - 7})`
  );

  addDragEvents(el, scale, comm);

  let slider = el
    .append("rect")
    .attr("class", "cardinality-slider-rect")
    .attr("transform", "rotate(45)")
    .attr("height", params.cardinality_slider_dims)
    .attr("width", params.cardinality_slider_dims);
}

function addBrush(el: d3Selection, pos: number) {
  el.append("rect")
    .attr("class", "slider-brush")
    .attr("height", params.axis_offset)
    .attr("width", pos);
}

function addCardinalityLabel(el: d3Selection) {
  let textGroup = el
    .append("g")
    .attr("class", "inner-text-group")
    .attr(
      "transform",
      `translate(0, ${params.cardinality_scale_group_height / 2 -
        params.cardinality_label_height / 2})`
    );
  let sliderInfluence = el.append("g").attr("class", "slider-influence hide");
  textGroup
    .append("rect")

    .attr("class", "cardinality-label-rect")
    .attr("width", params.cardinality_width)
    .attr("height", params.cardinality_label_height);

  textGroup
    .append("text")
    .text("Cardinality")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      `translate(${params.cardinality_width / 2},${
        params.cardinality_bar_height
      })`
    );

  sliderInfluence.append("path").attr("class", "slider-brush-path");
}

function updateBrushAndSlider(pos: number) {
  d3.select(".slider-brush").attr("width", pos);
  d3.select(".slider-influence")
    .select(".slider-brush-path")
    .attr(
      "d",
      `M ${params.cardinality_width} ${params.cardinality_scale_group_height -
        params.axis_offset} H0 V ${params.axis_offset} H${pos}`
    );
}

function addDragEvents(el: d3Selection, scale: d3Scale, comm: Mitt) {
  comm.on("slider-moved", (d: number) => {
    adjustCardinalityBars(d);
    updateDetailsScale(d);
    updateBrushAndSlider(scale(d));
  });

  el.call(
    d3
      .drag()
      .on("start", dragStart)
      .on("drag", dragged)
      .on("end", dragEnd)
  );

  function dragStart() {
    d3.select(this)
      .raise()
      .classed("active", true);
    d3.select(".inner-text-group").classed("hide", true);
    d3.select(".slider-influence").classed("hide", false);
  }
  function dragged() {
    let x = d3.event.x;
    if (x > scale(6) && x <= params.cardinality_width) {
      if (Math.abs(x - 0) <= 0.9) x = 1;
      if (Math.abs(x - params.cardinality_width) <= 0.9)
        x = params.cardinality_width;
      d3.select(this).attr(
        "transform",
        `translate(${x}, ${params.axis_offset / 2 - 7})`
      );
      comm.emit("slider-moved", scale.invert(x));
    }
  }
  function dragEnd() {
    d3.select(this).classed("active", false);
    d3.select(".slider-influence").classed("hide", true);
    d3.select(".inner-text-group").classed("hide", false);
  }
}

function updateDetailsScale(setSize: number) {
  let el = d3.select(".details-axis");
  let scale = getCardinalityScale(setSize, params.cardinality_width);
  addDetailAxis(el, scale, Math.floor(setSize));
}

function addDetailAxis(el: d3Selection, scale: d3Scale, size: number) {
  el.attr(
    "transform",
    `translate(0,${params.cardinality_scale_group_height - params.axis_offset})`
  );

  el.html("");

  let top = el.append("g").attr("class", "top-axis");
  top
    .append("path")
    .attr("class", "axis")
    .attr("d", "M0,6 V0 h200 v6");

  let ticksArr = calculateTicksToShow(size);
  let ticksG = addTicks(top, ticksArr, scale, 0);
  addTickLabels(ticksG);

  let bottom = el.append("g").attr("class", "bottom-axis");
  bottom
    .append("path")
    .attr("class", "axis")
    .attr("d", `M0,${params.axis_offset} H200 `);
  addTicks(bottom, ticksArr, scale, params.axis_offset - 6);
}

function addTicks(
  el: d3Selection,
  ticksArr: number[],
  scale: d3Scale,
  y_offset: number,
  x_offset: number = 0
): d3Selection {
  let g: d3Selection = el.selectAll(".tick-group").data([1]);
  g.exit().remove();

  let _g = g
    .enter()
    .append("g")
    .merge(g)
    .attr("class", "tick-group")
    .attr("transform", `translate(${x_offset}, 0)`);

  let ticksG: d3Selection = _g.selectAll(".tick-g").data(ticksArr);
  ticksG.exit().remove();
  let ticks = ticksG
    .enter()
    .append("g")
    .attr("class", "tick-g")
    .merge(ticksG)
    .attr("transform", (d, i) => {
      return `translate(${scale(d)}, ${y_offset})`;
    });

  ticks
    .append("path")
    .attr("class", "tick")
    .attr("d", "M0,6 V0");
  return ticks;
}

function addTickLabels(
  ticks: d3Selection,
  skipDenominator: number = 2,
  offset: number = 20
) {
  ticks
    .append("text")
    .attr("class", "tick-label")
    .text((d, i) => {
      if (i % skipDenominator === 0) return d;
    })
    .attr("text-anchor", "middle")
    .attr("dy", offset);
}

function calculateTicksToShow(setSize: number): number[] {
  if (setSize <= 10) return [...Array(setSize).keys(), setSize];
  else if (setSize <= 25)
    return [
      ...[...Array(setSize).keys()].filter(n => {
        return n % 2 === 0;
      }),
      setSize
    ];
  else if (setSize <= 100)
    return [
      ...[...Array(setSize).keys()].filter(n => {
        return n % 20 === 0;
      }),
      setSize
    ];
  else if (setSize <= 300)
    return [
      ...[...Array(setSize).keys()].filter(n => {
        return n % 40 === 0;
      }),
      setSize
    ];
  else if (setSize <= 1000)
    return [
      ...[...Array(setSize).keys()].filter(n => {
        return n % 100 === 0;
      }),
      setSize
    ];
  else if (setSize <= 2000)
    return [
      ...[...Array(setSize).keys()].filter(n => {
        return n % 200 === 0;
      }),
      setSize
    ];
  else if (setSize <= 6000)
    return [
      ...[...Array(setSize).keys()].filter(n => {
        return n % 500 === 0;
      }),
      setSize
    ];
  else
    return [
      ...[...Array(setSize).keys()].filter(n => {
        return n % 2000 === 0;
      }),
      setSize
    ];
}
// ################################################################################################

export function addDeviationHeaders(
  el: d3Selection,
  maxDisprop: number,
  comm: Mitt
) {
  el.html("");
  el.attr(
    "transform",
    `translate(${params.skew_offset +
      params.combinations_width +
      params.cardinality_width +
      params.column_width * 3}, ${params.header_height -
      params.header_body_padding -
      params.deviation_scale_group_height +
      3})`
  );

  addDeviationLabel(el, comm);
  addDeviationScale(el, Math.ceil((maxDisprop * 100) / 5) * 5);
}

function addDeviationLabel(el: d3Selection, comm: Mitt) {
  el.append("rect")
    .attr("height", params.deviation_label_height)
    .attr("width", params.deviation_width)
    .attr("class", "deviation-label")
    .on("click", () => {
      comm.emit("sort-by-deviation");
    });

  el.append("text")
    .text("Deviation")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      `translate(${params.deviation_width / 2}, ${params.deviation_bar_height})`
    );
}

function addDeviationScale(el: d3Selection, maxSize: number) {
  let scale = d3
    .scaleLinear()
    .domain([-maxSize, maxSize])
    .range([-params.deviation_width / 2, params.deviation_width / 2]);

  let domain: number[] = [];
  let start = -maxSize;
  while (start <= maxSize) {
    domain.push(start);
    start += 5;
  }

  let g = el.append("g").attr("class", "scale-group");
  g.attr(
    "transform",
    `translate(0, ${params.deviation_scale_group_height - params.axis_offset})`
  );

  g.append("path")
    .attr("class", "axis")
    .attr(
      "d",
      `M0,${params.deviation_scale_group_height -
        params.axis_offset -
        params.header_body_padding} H${params.deviation_width}`
    );

  let ticks = addTicks(
    g,
    domain,
    scale,
    params.axis_offset - params.header_body_padding - 6,
    params.deviation_width / 2
  );

  addTickLabels(ticks, 1, -2);
}

// ################################################################################################
function addChildrenToShowList(rowsToShow: RenderRow[], row: RenderRow) {
  if ((row.data as Group).nestedGroups.length > 0) {
    rowsToShow.push(row);
    (row.data as Group).nestedGroups.forEach(ng => {
      addChildrenToShowList(rowsToShow, {
        id: ng.id.toString(),
        data: ng
      });
    });
  } else {
    rowsToShow.push(row);
    if (!(row.data as Group).isCollapsed) {
      let children = (row.data as Group).visibleSets.map(_ => {
        return {
          id: _.id.toString(),
          data: _
        };
      });
      rowsToShow.push(...children);
    }
  }
}

export function addRenderRows(
  data: Data,
  el: d3Selection,
  usedSetCount: number,
  config: EmbedConfig,
  comm: Mitt
) {
  let rowsToShow: RenderRow[] = [];
  if (data.renderRows.filter(_ => _.data.type === RowType.GROUP).length > 0) {
    data.renderRows.forEach(row => {
      addChildrenToShowList(rowsToShow, row);
    });
  } else {
    rowsToShow = data.renderRows;
  }
  params.row_group_height = params.row_height * rowsToShow.length;
  setupColumnBackgrounds(el, usedSetCount);
  el.attr("transform", `translate(0, ${params.used_set_group_height})`);
  params.combinations_width = params.column_width * usedSetCount;
  params.used_sets = usedSetCount;
  let rows: d3Selection;
  let groups: d3Selection;
  let subsets: d3Selection;

  if (config && !config.CardinalityBars) params.cardinality_width = 0;
  if (config && !config.DeviationBars) params.deviation_width = 0;

  [rows, groups, subsets] = addRows(rowsToShow, el, comm);

  setupSubsets(subsets, comm);
  setupGroups(data, groups, comm);
  collapseGroups(groups, subsets, comm);

  if (!config || config.CardinalityBars) {
    addCardinalityBars(rows, data.renderRows);
  }

  if (!config || config.DeviationBars) {
    addDeviationBars(rows, data.renderRows);
  }

  comm.on("update-attributes", () => {
    updateBackgroundAndAddAttributes(rows, groups, subsets, data);
  });

  comm.on("add-attribute", attr => {
    data.selectedAttributes = addAttributeToSelected(
      data.selectedAttributes,
      attr
    );
    comm.emit("update-attributes");
  });

  comm.on("remove-attribute", attr => {
    data.selectedAttributes = removeAttributeFromSelected(
      data.selectedAttributes,
      attr
    );
    comm.emit("update-attributes");
  });

  comm.emit("update-attributes");
}

function collapseGroups(
  groups: d3Selection,
  subsets: d3Selection,
  comm: Mitt
) {}

function addAttributeToSelected(selected: Attribute[], attr: Attribute) {
  if (attr && selected.indexOf(attr) < 0) selected.push(attr);
  return selected;
}

function removeAttributeFromSelected(selected: Attribute[], attr: Attribute) {
  if (attr && selected.indexOf(attr) >= 0)
    selected.splice(selected.indexOf(attr), 1);
  return selected;
}

/** ************* */
function setupColumnBackgrounds(el: d3Selection, usedSets: number) {
  let _bg: d3Selection = el.selectAll(".column-background-group").data([1]);
  _bg.exit().remove();
  let backgroundGroup = _bg
    .enter()
    .append("g")
    .merge(_bg)
    .html("")
    .attr("class", "column-background-group")
    .attr("transform", `translate(${params.skew_offset}, 0)`);

  let arr = [...Array(usedSets).keys()];
  let rects: d3Selection = backgroundGroup
    .selectAll(".vert-set-rect")
    .data(arr);
  rects.exit().remove();
  rects
    .enter()
    .append("rect")
    .merge(rects)
    .attr("class", (d, i) => {
      return `vert-set-rect S_${i}`;
    })
    .attr("width", params.column_width)
    .attr("height", params.row_group_height)
    .attr("transform", (d, i) => {
      return `translate(${params.column_width * i}, 0)`;
    });
}

function addRows(
  data: RenderRow[],
  el: d3Selection,
  comm: Mitt
): d3Selection[] {
  let _rows: d3Selection = el
    .selectAll(".row")
    .data(data, function(d: RenderRow, i: number) {
      return d.id;
    });
  _rows.exit().remove();

  let rows: d3Selection = _rows
    .enter()
    .append("g")
    .style("opacity", 0)
    .attr("transform", (d: RenderRow, i) => {
      if (d.data.type === RowType.GROUP)
        return `translate(0, ${params.row_height * i})`;
      return `translate(${params.skew_offset}, ${params.row_height * i})`;
    })
    .merge(_rows)
    .html("")
    .attr("class", (d: any, i) => {
      return `row ${d.data.type}`;
    });

  rows
    .transition()
    .duration(300)
    .attr("transform", (d: RenderRow, i) => {
      if (d.data.type === RowType.GROUP)
        return `translate(0, ${params.row_height * i})`;
      return `translate(${params.skew_offset}, ${params.row_height * i})`;
    })
    .style("opacity", 1);

  setupElementGroups(rows, comm);

  let groups = rows.filter((d: RenderRow, i) => {
    return d.data.type === RowType.GROUP;
  });
  groups.append("g").attr("class", "group-collapse-g");
  groups.append("g").attr("class", "group-label-g");

  let subsets = rows.filter((d: RenderRow, i) => {
    return d.data.type === RowType.SUBSET;
  });

  return [rows, groups, subsets];
}

function setupElementGroups(rows: d3Selection, comm: Mitt) {
  rows.on("click", d => {
    comm.emit("add-selection-trigger", d);
  });

  rows.append("g").attr("class", "background-rect-g");

  rows
    .append("g")
    .attr("class", "cardinality-bar-group")
    .attr("transform", (d, i) => {
      if (d.data.type === RowType.GROUP)
        return `translate(${params.skew_offset +
          params.combinations_width +
          params.column_width}, ${(params.row_height -
          params.cardinality_bar_height) /
          2})`;
      return `translate(${params.combinations_width +
        params.column_width}, ${(params.row_height -
        params.cardinality_bar_height) /
        2})`;
    });

  rows
    .append("g")
    .attr("class", "deviation-bar-group")
    .attr("transform", (d, i) => {
      if (d.data.type === RowType.GROUP)
        return `translate(${params.skew_offset +
          params.combinations_width +
          params.cardinality_width +
          params.column_width * 3},${(params.row_height -
          params.deviation_bar_height) /
          2})`;
      else
        return `translate(${params.combinations_width +
          params.column_width +
          params.cardinality_width +
          params.column_width * 2},${(params.row_height -
          params.deviation_bar_height) /
          2})`;
    });

  rows
    .append("g")
    .attr("class", "attribute-group")
    .attr("transform", d => {
      if (d.data.type === RowType.GROUP)
        return `translate(${params.skew_offset +
          params.combinations_width +
          params.cardinality_width +
          params.deviation_width +
          params.column_width * 4},${(params.row_height -
          params.deviation_bar_height) /
          2})`;
      else
        return `translate(${params.combinations_width +
          params.column_width +
          params.cardinality_width +
          params.deviation_width +
          params.column_width * 3},${(params.row_height -
          params.deviation_bar_height) /
          2})`;
    });
}
/** ************* */

/** ************* */
function setupSubsets(subsets: d3Selection, comm: Mitt) {
  subsets
    .on("mouseover", function() {
      d3.select(this)
        .select("rect")
        .classed("highlight highlight2", true);
    })
    .on("mouseout", function() {
      d3.select(this)
        .select("rect")
        .classed("highlight highlight2", false);
    });

  addSubsetBackgroundRects(subsets);
  addCombinations(subsets, comm);
}

function addSubsetBackgroundRects(subsets: d3Selection) {
  subsets
    .selectAll(".background-rect-g")
    .append("rect")
    .attr("class", `subset-background-rect`)
    .attr("height", params.row_height)
    .attr("width", params.subset_row_width);
}

function updateSubsetBackgroundRects(subsets: d3Selection) {
  subsets
    .selectAll(".background-rect-g")
    .selectAll("rect")
    .attr("width", params.subset_row_width);
}

function addCombinations(subset: d3Selection, comm: Mitt) {
  let combinationsGroup = subset.append("g").attr("class", "combination");

  combinationsGroup.each(function(d: RenderRow) {
    let membershipDetails = (d.data as SubSet).combinedSets;

    let degree = membershipDetails.reduce((i, j) => i + j, 0);

    let comboGroup = d3
      .select(this)
      .selectAll(".set-membership")
      .data(membershipDetails);

    addCombinationCircles(comboGroup);
    addRowHighlight(this);

    if (degree > 1) {
      let first = membershipDetails.indexOf(1);
      let last = membershipDetails.lastIndexOf(1);
      addCombinationLine(this, first, last);
    }
  });
}

function addCombinationCircles(comboGroup: d3Selection) {
  comboGroup
    .exit()
    .transition()
    .duration(100)
    .remove();

  comboGroup
    .enter()
    .append("circle")
    .merge(comboGroup)
    .attr("r", params.combo_circle_radius)
    .attr("cy", params.row_height / 2)
    .attr("cx", (d, i) => {
      return params.column_width / 2 + params.column_width * i;
    })
    .attr("class", (d, i) => {
      if (d === 0) return `set-membership not-member`;
      return `set-membership member`;
    })
    .on("mouseover", function(d, i) {
      let parentG = (d3.select(this).node() as any).parentNode;
      let rect = (d3.select(parentG).node() as any).parentNode;
      d3.select(rect)
        .select("rect")
        .classed("highlight highlight2", true);

      d3.selectAll(`.S_${i}`).classed("highlight", true);
    })
    .on("mouseout", function(d, i) {
      let parentG = (d3.select(this).node() as any).parentNode;
      let rect = (d3.select(parentG).node() as any).parentNode;
      d3.select(rect)
        .select("rect")
        .classed("highlight highlight2", false);

      d3.selectAll(`.S_${i}`).classed("highlight", false);
    });
}

function addCombinationLine(el: BaseType, first: number, last: number) {
  d3.select(el)
    .append("line")
    .attr("class", "combination-line")
    .attr("x1", params.column_width / 2 + params.column_width * first)
    .attr("x2", params.column_width / 2 + params.column_width * last)
    .attr("y1", params.row_height / 2)
    .attr("y2", params.row_height / 2);
}

function addRowHighlight(el: BaseType) {
  d3.select(el)
    .on("mouseover", function(d: RenderRow) {
      (d.data as SubSet).combinedSets.forEach((idx, i) => {
        if (idx === 1) d3.selectAll(`.S_${i}`).classed("highlight", true);
      });
    })
    .on("mouseout", function(d: RenderRow, i) {
      (d.data as SubSet).combinedSets.forEach((idx, i) => {
        d3.selectAll(`.S_${i}`).classed("highlight", false);
      });
    });
}
/** ************* */

/** ************* */
function setupGroups(data: Data, groups: d3Selection, comm: Mitt) {
  addGroupCollapseIcons(groups, comm);
  addGroupBackgroundRects(groups);
  addGroupLabels(groups);
  addGroupCombination(data, groups);
}

function addGroupCollapseIcons(groups: d3Selection, comm: Mitt) {
  let collapse = groups
    .selectAll(".group-collapse-g")
    .append("text")
    .attr("class", "group-collapse-g")
    .html((d: any) => {
      if ((d.data as Group).isCollapsed) return "&#9656;";
      return "&#9662;";
    })
    .attr("transform", (d: RenderRow, i) => {
      if ((d.data as Group).level == 2)
        return `translate(23, ${params.row_height - 4})`;
      return `translate(3, ${params.row_height - 4})`;
    });

  collapse.style("cursor", "pointer");

  collapse.on("click", (d: RenderRow) => {
    comm.emit("collapse-group", d);
    d3.event.stopPropagation();
  });
}

function addGroupBackgroundRects(groups: d3Selection) {
  groups
    .selectAll(".background-rect-g")
    .append("rect")
    .attr("class", "group-background-rect")
    .classed("group-background-rect2", (d: RenderRow, i) => {
      if ((d.data as Group).level === 2) return true;
      return false;
    })
    .attr("height", params.row_height)
    .attr("width", (d: RenderRow) => {
      if ((d.data as Group).level === 2) return params.group_row_width - 20;
      return params.group_row_width;
    })
    .attr("transform", (d: RenderRow) => {
      if ((d.data as Group).level === 2) return `translate(20, 0)`;
      return "translate(0,0)";
    })
    .attr("rx", 5)
    .attr("ry", 10);
}

function updateGroupBackgroundRects(groups: d3Selection) {
  groups
    .selectAll(".background-rect-g")
    .selectAll("rect")
    .attr("width", (d: RenderRow) => {
      if ((d.data as Group).level === 2) return params.group_row_width - 20;
      return params.group_row_width;
    });
}

function addGroupLabels(groups: d3Selection) {
  groups
    .selectAll(".group-label-g")
    .append("text")
    .attr("class", "group-label-g")
    .text((d: RenderRow, i) => {
      return d.data.elementName;
    })
    .attr("transform", (d: RenderRow, i) => {
      if ((d.data as Group).level === 2)
        return `translate(35, ${params.row_height - 4})`;
      return `translate(15, ${params.row_height - 4})`;
    });
}

function addGroupCombination(data: Data, groups: d3Selection) {
  let combinationG = groups.append("g").classed("combination", true);
  combinationG.attr("transform", (d: RenderRow, i) => {
    if ((d.data as Group).level === 1) {
      return `translate(${params.skew_offset}, 0)`;
    } else {
      return `translate(${params.skew_offset},0)`;
    }
  });
  combinationG.each(function(d: RenderRow) {
    let aggBy = (d.data as Group).aggBy as AggregateBy;
    if (aggBy === AggregateBy.OVERLAPS || aggBy === AggregateBy.SETS) {
      let comboGroup = d3
        .select(this)
        .selectAll(".set-membership")
        .data((d.data as Group).setMemberships);
      addGroupCombinationCircles(comboGroup);
    }
  });
}

function addGroupCombinationCircles(comboGroup: d3Selection) {
  comboGroup
    .exit()
    .transition()
    .duration(100)
    .remove();

  let cgs = comboGroup
    .enter()
    .append("circle")
    .merge(comboGroup)
    .attr("r", d => {
      if (d === 0) return params.combo_circle_radius - 5;
      return params.combo_circle_radius - 1;
    })
    .attr("cy", params.row_height / 2)
    .attr("cx", (d, i) => {
      return params.column_width / 2 + params.column_width * i;
    })
    .attr("class", (d, i) => {
      // if (d === 0) return `set-membership not-member`;
      return `set-membership member`;
    })
    .on("mouseover", function(d, i) {
      let parentG = (d3.select(this).node() as any).parentNode;
      let rect = (d3.select(parentG).node() as any).parentNode;
      // d3.select(rect)
      //   .select("rect")
      //   .classed("highlight highlight2", true);

      d3.selectAll(`.S_${i}`).classed("highlight", true);
    })
    .on("mouseout", function(d, i) {
      let parentG = (d3.select(this).node() as any).parentNode;
      let rect = (d3.select(parentG).node() as any).parentNode;
      // d3.select(rect)
      //   .select("rect")
      //   .classed("highlight highlight2", false);

      d3.selectAll(`.S_${i}`).classed("highlight", false);
    });

  cgs
    .append("circle")
    .attr("r", params.combo_circle_radius - 1)
    .attr("cy", params.row_height / 2)
    .attr("cx", (d, i) => {
      return params.column_width / 2 + params.column_width * i;
    })
    .classed("set-membership member", true);
}
/** ************* */

/** ************* */
function addCardinalityBars(rows: d3Selection, data: RenderRow[]) {
  let maxSubsetSize = d3.max(data.map(d => d.data.setSize));
  let scale = getCardinalityScale(maxSubsetSize, params.cardinality_width);
  let cardinalityGroups = rows.selectAll(".cardinality-bar-group");
  renderCardinalityBars(cardinalityGroups, scale);
}

function adjustCardinalityBars(maxDomain: number) {
  let scale = getCardinalityScale(maxDomain, params.cardinality_width);
  let el = d3.selectAll(".row").selectAll(".cardinality-bar-group");
  renderCardinalityBars(el, scale);
}

function renderCardinalityBars(el: d3Selection, scale: d3Scale) {
  el.html("");
  el.each(function(d: RenderRow, i) {
    let g = d3.select(this);
    let width = scale(d.data.setSize);
    let loop = Math.floor(width / params.cardinality_width) + 1;
    let rem = width % params.cardinality_width;

    let brk = false;
    if (loop > 3) {
      brk = true;
      loop = 4;
      rem = 0;
    }

    let offset = params.horizon_offset;

    let hb: d3Selection = g
      .selectAll(".cardinality-bar")
      .data([...Array(loop).keys()]);
    hb.exit().remove();
    hb.enter()
      .append("rect")
      .merge(hb)
      .attr("class", (d, i) => {
        return `cardinality-bar cardinality-bar${i}`;
      })
      .attr("width", (d, i) => {
        if (i + 1 === loop) return rem;
        return params.cardinality_width;
      })
      .attr("height", (d, i) => {
        let height = params.cardinality_bar_height - offset * i;
        if (height < 0) return 2;
        return height;
      })
      .attr("transform", (d, i) => {
        return `translate(0, ${((params.cardinality_bar_height - offset) * i) /
          4})`;
      });

    if (brk) {
      g.append("line")
        .attr("class", "break-bar")
        .attr("y1", 0)
        .attr("y2", params.cardinality_bar_height)
        .attr("x1", params.cardinality_width - 20)
        .attr("x2", params.cardinality_width - 10);

      g.append("line")
        .attr("class", "break-bar")
        .attr("y1", 0)
        .attr("y2", params.cardinality_bar_height)
        .attr("x1", params.cardinality_width - 25)
        .attr("x2", params.cardinality_width - 15);
    }

    g.append("text")
      .attr("class", "cardinality-text")
      .text(d.data.setSize)
      .attr("transform", (d, i) => {
        return loop > 1
          ? `translate(${params.cardinality_width +
              5}, ${params.cardinality_bar_height / 2})`
          : `translate(${rem + 5}, ${params.cardinality_bar_height / 2})`;
      })
      .attr("dy", "0.4em");
  });
}

function getCardinalityScale(maxSize: number, maxWidth: number): d3Scale {
  if (maxSize > 8000) {
    return d3
      .scalePow()
      .exponent(0.75)
      .domain([0.01, maxSize])
      .range([0.01, maxWidth]);
  }
  if (maxSize > 2000) {
    return d3
      .scalePow()
      .exponent(0.8)
      .domain([0.01, maxSize])
      .range([0.01, maxWidth]);
  }
  return d3
    .scaleLinear()
    .domain([0, maxSize])
    .range([0, maxWidth]);
}
/** ************* */

/** ************* */
function addDeviationBars(rows: d3Selection, data: RenderRow[]) {
  let maxDeviation = d3.max(
    data.map(r => Math.abs(r.data.disproportionality * 100))
  );
  maxDeviation = Math.ceil(maxDeviation / 5) * 5;
  let scale = getDeviationScale(maxDeviation, params.deviation_width / 2);
  let deviationGroup = rows.selectAll(".deviation-bar-group");
  renderDeviationBars(deviationGroup, scale);
}

function getDeviationScale(maxSize: number, maxWidth: number): d3Scale {
  return d3
    .scaleLinear()
    .domain([0, maxSize])
    .range([0, maxWidth]);
}

function renderDeviationBars(el: d3Selection, scale: d3Scale) {
  el.html("")
    .append("rect")
    .attr("width", params.deviation_width)
    .attr("height", params.deviation_bar_height)
    .style("fill", "none");

  el.append("rect")
    .attr("class", (d: RenderRow, i) => {
      return d.data.disproportionality >= 0
        ? `disproportionality positive`
        : `disproportionality negative`;
    })
    .attr("height", (d, i) => {
      return params.deviation_bar_height;
    })
    .attr("width", (d: RenderRow, i) => {
      return scale(Math.abs(d.data.disproportionality) * 100);
    })
    .attr("transform", (d: RenderRow, i) => {
      return d.data.disproportionality >= 0
        ? `translate(${params.deviation_width / 2}, 0)`
        : `translate(${params.deviation_width / 2 +
            scale(d.data.disproportionality * 100)}, 0)`;
    });
}
/** ************* */
export function addAttributeHeaders(el: d3Selection, data: Data, comm: Mitt) {
  el.html("");
  el.attr(
    "transform",
    `translate(${params.skew_offset +
      params.combinations_width +
      params.cardinality_width +
      params.deviation_width +
      params.column_width * 4}, ${params.header_height -
      params.header_body_padding -
      29})`
  );

  let attrHeaders: d3Selection = el
    .selectAll(".attribute")
    .data(data.selectedAttributes);
  attrHeaders.exit().remove();
  attrHeaders = attrHeaders
    .enter()
    .append("g")
    .classed("attribute", true)
    .merge(attrHeaders)
    .attr(
      "transform",
      (_, i) => `translate(${i * (params.attribute_width + 25)}, 0)`
    );
  addAttrHeaders(attrHeaders, comm);
}

function addAttrHeaders(el: d3Selection, comm: Mitt) {
  el.each(function(d: Attribute) {
    let t = d3
      .select(this)
      .html("")
      .append("g");

    // let close = t.append("g").html(html);
    // close.attr("transform", `translate(${params.attribute_width}, -10)`);
    t.on("click", () => comm.emit("remove-attribute-trigger", d));

    t.append("text").text(d.name);
    // t.append("rect")
    //   .attr("width", params.attribute_width)
    //   .attr("height", 20)
    //   .classed("label", true)
    //   .attr("transform", `translate(0, -18)`);

    let scale = d3
      .scaleLinear()
      .domain([d.min, d.max])
      .range([0, params.attribute_width]);

    let ax = d3.axisTop(scale).ticks(2);

    d3.select(this)
      .append("g")
      .attr("transform", `translate(0, 30)`)
      .call(ax);
  });
}

/** ************* */
// ! Undefined function???

function updateBackgroundAndAddAttributes(
  rows: d3Selection,
  groups: d3Selection,
  subset: d3Selection,
  data: Data
) {
  params.no_attributes_shown = data.selectedAttributes.length;
  updateGroupBackgroundRects(groups);
  updateSubsetBackgroundRects(subset);
  addAttributes(rows, data);
}

function addAttributes(rows: d3Selection, data: Data) {
  let attributeGroups = rows.selectAll(".attribute-group").html("");

  let attrs: d3Selection = attributeGroups
    .selectAll(".attribute")
    .data(data.selectedAttributes);
  attrs.exit().remove();
  attrs = attrs
    .enter()
    .append("g")
    .classed("attribute", true)
    .merge(attrs);

  attrs.attr(attributeName, d => {
    return d.name;
  });

  attrs.attr("transform", (_, i) => {
    return `translate(${i * (params.attribute_width + 25)}, 0)`;
  });

  attributeGroups.each(function(d: RenderRow) {
    let itemIndices = d.data.items;
    let attrs = d3.select(this).selectAll(".attribute");

    attrs.each(function(d) {
      let el = d3.select(this);
      let attrName = el.attr(attributeName);
      let relevantAttr = data.selectedAttributes.filter(
        _ => _.name === attrName
      )[0];

      let overAllMin = d3.min(relevantAttr.values);
      let overAllMax = d3.max(relevantAttr.values);

      let memberValues = relevantAttr.values.filter(
        (_, i) => itemIndices.indexOf(i) > -1
      );
      let localStats = getBoxPlotStats(memberValues);

      let boxPlotMaxWidth = params.attribute_width;

      let bpScale = d3
        .scaleLinear()
        .domain([overAllMin, overAllMax])
        .range([0, boxPlotMaxWidth]);

      addBoxPlot(el, localStats, bpScale);
    });
  });
}

type BoxPlotStats = {
  min: number;
  max: number;
  quantile25: number;
  quantile50: number;
  quantile75: number;
};

function getBoxPlotStats(values: number[]): BoxPlotStats {
  values.sort((a, b) => a - b);
  return {
    min: d3.min(values),
    max: d3.max(values),
    quantile25: d3.quantile(values, 0.25),
    quantile50: d3.quantile(values, 0.5),
    quantile75: d3.quantile(values, 0.75)
  };
}

function addBoxPlot(el: d3Selection, data: BoxPlotStats, scale: d3Scale) {
  let bpGroup = el.append("g");
  bpGroup.attr("transform", `translate(0, ${params.attribute_bar_height / 4})`);
  addWhiskers(bpGroup, data, scale);
  addBoxes(bpGroup, data, scale);
}

function addWhiskers(el: d3Selection, data: BoxPlotStats, scale: d3Scale) {
  el.append("line")
    .classed("whisker", true)
    .attr("x1", scale(data.min))
    .attr("x2", scale(data.min))
    .attr("y1", 0)
    .attr("y2", params.attribute_bar_height / 2);

  el.append("line")
    .classed("whisker", true)
    .attr("x1", scale(data.max))
    .attr("x2", scale(data.max))
    .attr("y1", 0)
    .attr("y2", params.attribute_bar_height / 2);

  el.append("line")
    .classed("whisker", true)
    .attr("x1", scale(data.min))
    .attr("x2", scale(data.max))
    .attr("y1", params.attribute_bar_height / 4)
    .attr("y2", params.attribute_bar_height / 4);
}

function addBoxes(el: d3Selection, data: BoxPlotStats, scale: d3Scale) {
  el.append("rect")
    .classed("boxplot-box", true)
    .attr("height", params.attribute_bar_height / 2)
    .attr("width", scale(data.quantile75) - scale(data.quantile25))
    .attr("x", scale(data.quantile25));

  el.append("line")
    .classed("whisker", true)
    .attr("x1", scale(data.quantile50))
    .attr("x2", scale(data.quantile50))
    .attr("y1", 0 - params.attribute_bar_height / 4)
    .attr("y2", (params.attribute_bar_height * 3) / 4);
}

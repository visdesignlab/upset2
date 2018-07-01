import { SubSet } from "./../DataStructure/SubSet";
import { d3Selection, RenderRow, d3Scale } from "./../type_declarations/types";
import { Set } from "./../DataStructure/Set";
import params, { deg2rad } from "./ui_params";
import * as d3 from "d3";
import { Mitt } from "provenance_mvvm_framework";
import { RowType } from "../DataStructure/RowType";
import { BaseType } from "d3";

// ################################################################################################
export function usedSetsHeader(
  data: Set[],
  el: d3Selection,
  maxSetSize: number,
  comm: Mitt
) {
  addHeaderBars(data, el, maxSetSize, comm);
  addConnectors(data, el);
}

function addHeaderBars(
  data: Set[],
  el: d3Selection,
  maxSetSize: number,
  comm: Mitt
) {
  let headerBarGroup = el.selectAll(".header-bar-group").data([1]);

  headerBarGroup.exit().remove();

  let _headers = headerBarGroup
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
    .attr("class", "header");

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

function addConnectors(data: Set[], el: d3Selection) {
  let connectorGroup = el.selectAll(".connector-group").data([1]);
  connectorGroup.exit().remove();

  let _connectors = connectorGroup
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

  let connectors = _connectors
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
  let cardinalityLabel = el.append("g").attr("class", "cardinality-label");

  let scaleOverview = getCardinalityScale(totalSize, params.cardinality_width);
  addOverviewAxis(overviewAxis, scaleOverview, totalSize);

  addCardinalitySlider(cardinalitySlider, maxSetSize, scaleOverview, comm);

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
  addTicks(bottom, ticksArr, scale, 17);
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

function addDragEvents(el: d3Selection, scale: d3Scale, comm: Mitt) {
  comm.on("slider-moved", adjustCardinalityBars);

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
  }
  function dragged() {
    let x = d3.event.x;
    if (x >= 0 && x <= params.cardinality_width) {
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
  }
}

function addDetailAxis(el: d3Selection, scale: d3Scale, size: number) {
  el.attr(
    "transform",
    `translate(0,${params.cardinality_scale_group_height - params.axis_offset})`
  );

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
    .attr("d", "M0,17 v6 H200 V16");
  addTicks(bottom, ticksArr, scale, 17);
}

function addTicks(
  el: d3Selection,
  ticksArr: number[],
  scale: d3Scale,
  y_offset: number
): d3Selection {
  let ticksG = el.selectAll(".tick-g").data(ticksArr);
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

function addTickLabels(ticks: d3Selection) {
  ticks
    .append("text")
    .attr("class", "tick-label")
    .text((d, i) => {
      if (i % 2 === 0) return d;
    })
    .attr("text-anchor", "middle")
    .attr("dy", 15);
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
export function addRenderRows(
  data: RenderRow[],
  el: d3Selection,
  usedSetCount: number
) {
  el.attr("transform", `translate(0, ${params.used_set_group_height})`);
  params.row_group_height = params.row_height * data.length;
  params.combinations_width = params.column_width * usedSetCount;
  params.used_sets = usedSetCount;
  let rows: d3Selection;
  let groups: d3Selection;
  let subsets: d3Selection;

  setupColumnBackgrounds(el, usedSetCount);

  [rows, groups, subsets] = addRows(data, el);

  setupSubsets(subsets);
  setupGroups(groups);

  addCardinalityBars(rows, data);
}

function setupColumnBackgrounds(el: d3Selection, usedSets: number) {
  let _bg = el.selectAll(".column-background-group").data([1]);
  _bg.exit().remove();
  let backgroundGroup = _bg
    .enter()
    .append("g")
    .merge(_bg)
    .html("")
    .attr("class", "column-background-group")
    .attr("transform", `translate(${params.skew_offset}, 0)`);

  let arr = [...Array(usedSets).keys()];
  let rects = backgroundGroup.selectAll(".vert-set-rect").data(arr);
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

function addRows(data: RenderRow[], el: d3Selection): d3Selection[] {
  let _rows = el.selectAll(".row").data(data);
  _rows
    .exit()
    .transition()
    .duration(100)
    .remove();

  let rows = _rows
    .enter()
    .append("g")
    .merge(_rows)
    .html("")
    .attr("class", (d, i) => {
      return `row ${d.data.type}`;
    });
  rows
    .transition()
    .duration(100)
    .attr("transform", (d: RenderRow, i) => {
      if (d.data.type === RowType.GROUP)
        return `translate(0, ${params.row_height * i})`;
      return `translate(${params.skew_offset}, ${params.row_height * i})`;
    });

  setupElementGroups(rows);

  let groups = rows.filter((d: RenderRow, i) => {
    return d.data.type === RowType.GROUP;
  });
  groups.append("g").attr("class", "group-label-g");

  let subsets = rows.filter((d: RenderRow, i) => {
    return d.data.type === RowType.SUBSET;
  });

  return [rows, groups, subsets];
}

function setupElementGroups(rows: d3Selection) {
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
}

function setupSubsets(subsets: d3Selection) {
  addSubsetBackgroundRects(subsets);
  addCombinations(subsets);
}

function addSubsetBackgroundRects(subsets: d3Selection) {
  subsets
    .selectAll(".background-rect-g")
    .append("rect")
    .attr("class", "subset-background-rect ")
    .attr("height", params.row_height)
    .attr("width", params.subset_row_width);
}

function addCombinations(subset: d3Selection) {
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

function setupGroups(groups: d3Selection) {
  addGroupBackgroundRects(groups);
  addGroupLabels(groups);
}

function addGroupBackgroundRects(groups: d3Selection) {
  groups
    .selectAll(".background-rect-g")
    .append("rect")
    .attr("class", "group-background-rect")
    .attr("height", params.row_height)
    .attr("width", params.group_row_width)
    .attr("rx", 5)
    .attr("ry", 10);
}

function addGroupLabels(groups: d3Selection) {
  groups
    .selectAll(".group-label-g")
    .append("text")
    .attr("class", "group-label-g")
    .text((d: RenderRow, i) => {
      return d.data.elementName;
    })
    .attr("transform", (d, i) => {
      return `translate(10, ${params.row_height - 4})`;
    });
}

function addCardinalityBars(rows: d3Selection, data: RenderRow[]) {
  let maxSubsetSize = d3.max(data.map(d => d.data.setSize));
  let scale = getCardinalityScale(maxSubsetSize, params.cardinality_width);
  let cardinalityGroups = rows.selectAll(".cardinality-bar-group");
  renderBars(cardinalityGroups, scale);
}

function adjustCardinalityBars(maxDomain: number) {
  let scale = getCardinalityScale(maxDomain, params.cardinality_width);
  let el = d3.selectAll(".row").selectAll(".cardinality-bar-group");
  renderBars(el, scale);
}

function renderBars(el: d3Selection, scale: d3Scale) {
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

    let hb = g.selectAll(".cardinality-bar").data([...Array(loop).keys()]);
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
        return params.cardinality_bar_height - offset * i;
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
  });
}

function getCardinalityScale(maxSize: number, maxWidth: number) {
  return d3
    .scaleLinear()
    .domain([0, maxSize])
    .range([0, maxWidth]);
}

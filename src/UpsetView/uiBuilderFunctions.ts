import { SubSet } from "./../DataStructure/SubSet";
import { d3Selection, RenderRow } from "./../type_declarations/types";
import { Set } from "./../DataStructure/Set";
import params, { deg2rad } from "./ui_params";
import * as d3 from "d3";
import { Mitt } from "provenance_mvvm_framework";
import { RowType } from "../DataStructure/RowType";

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

  headers.on("click", (d, i) => {
    comm.emit("remove-set-trigger", d);
  });

  addBackgroundBars(headers);
  addForegroundBars(headers, maxSetSize);
}

function addBackgroundBars(headers: d3Selection) {
  headers
    .append("rect")
    .attr("height", params.used_set_header_height)
    .attr("width", params.column_width)
    .attr("class", "used-set-background");
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
    .attr("class", "connector");
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
    .attr("class", "connector-rect")
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

export function addRenderRows(
  data: RenderRow[],
  el: d3Selection,
  usedSetCount: number,
  comm: Mitt
) {
  el.attr("transform", `translate(0, ${params.used_set_group_height})`);
  params.row_group_height = params.row_height * data.length;
  params.subset_row_width = params.column_width * usedSetCount;
  params.used_sets = usedSetCount;
  let rows: d3Selection;
  let groups: d3Selection;
  let subsets: d3Selection;

  [rows, groups, subsets] = addRows(data, el);

  setupColumnBackgrounds(el, usedSetCount);
  setupSubsets(subsets);
  setupGroups(groups);
}

function setupColumnBackgrounds(el: d3Selection, usedSets: number) {
  let backgroundGroup = el
    .append("g")
    .attr("class", "column-background-group")
    .attr("transform", `translate(${params.skew_offset}, 0)`);
  let arr = [...Array(usedSets).keys()];
  let rects = backgroundGroup.selectAll(".vert-set-rect").data(arr);
  rects.exit().remove();
  rects
    .enter()
    .append("rect")
    .merge(rects)
    .attr("class", "vert-set-rect")
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

  rows.append("g").attr("class", "background-rect-g");

  let groups = rows.filter((d: RenderRow, i) => {
    return d.data.type === RowType.GROUP;
  });

  let subsets = rows.filter((d: RenderRow, i) => {
    return d.data.type === RowType.SUBSET;
  });

  return [rows, groups, subsets];
}

function setupSubsets(subsets: d3Selection) {
  addSubsetBackgroundRects(subsets);
  addCombinations(subsets);
}

function addSubsetBackgroundRects(subsets: d3Selection) {
  subsets
    .selectAll(".background-rect-g")
    .append("rect")
    .attr("class", "subset-background-rect")
    .attr("height", params.row_height)
    .attr("width", params.subset_row_width);
}

function addCombinations(subset: d3Selection) {
  let combinationsGroup = subset.append("g").attr("class", "combination");

  combinationsGroup.each(function(d: RenderRow, i) {
    let membershipDetails = (d.data as SubSet).combinedSets;

    let degree = membershipDetails.reduce((i, j) => i + j, 0);
    let first = membershipDetails.indexOf(1);
    let last = membershipDetails.lastIndexOf(1);

    let comboGroup = d3
      .select(this)
      .selectAll(".set-membership")
      .data(membershipDetails);

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
      });

    if (degree > 1) {
      d3.select(this)
        .append("line")
        .attr("class", "combination-line")
        .attr("x1", params.column_width / 2 + params.column_width * first)
        .attr("x2", params.column_width / 2 + params.column_width * last)
        .attr("y1", params.row_height / 2)
        .attr("y2", params.row_height / 2);
    }
  });
}

function setupGroups(groups: d3Selection) {
  addGroupBackgroundRects(groups);
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

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
  params.used_set_width = params.column_width * usedSetCount;

  let rows: d3Selection;
  let groups: d3Selection;
  let subsets: d3Selection;

  [rows, groups, subsets] = addRows(data, el);

  setupSubsets(subsets);
  setupGroups(groups);
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
}

function addSubsetBackgroundRects(subsets: d3Selection) {
  subsets
    .selectAll(".background-rect-g")
    .append("rect")
    .attr("class", "subset-background-rect")
    .attr("height", params.row_height)
    .attr("width", 100);
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
    .attr("width", params.group_row_width);
}

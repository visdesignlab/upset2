import { d3Selection } from "./../type_declarations/types";
import { Set } from "./../DataStructure/Set";
import params from "./ui_params";
import * as d3 from "d3";

export function usedSetsHeader(
  data: Set[],
  el: d3Selection,
  maxSetSize: number
) {
  addHeaderBars(data, el, maxSetSize);
}

function addHeaderBars(data: Set[], el: d3Selection, maxSetSize: number) {
  let headerBarGroup = el.selectAll(".header-bar-group").data([1]);

  headerBarGroup.exit().remove();
  headerBarGroup.enter();

  let _headers = headerBarGroup
    .enter()
    .append("g")
    .attr("class", "header-bar-group")
    .merge(headerBarGroup)
    .selectAll(".header")
    .data(data);
  _headers.exit().remove();

  let headers = _headers
    .enter()
    .append("g")
    .merge(_headers)
    .html("")
    .attr("class", "header")
    .attr("transform", (d, i) => {
      return `translate(${params.column_width * i}, 0)`;
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

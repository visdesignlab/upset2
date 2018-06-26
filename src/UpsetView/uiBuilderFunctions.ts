import { d3Selection } from "./../type_declarations/types";
import { Set } from "./../DataStructure/Set";
import params from "./ui_params";

export function usedSetsHeader(data: Set[], el: d3Selection) {
  addHeaderBars(data, el);
}

function addHeaderBars(data: Set[], el: d3Selection) {
  let headerBarGroup = el.append("g").attr("class", "header-bar-group");
  let _headers = headerBarGroup.selectAll(".header").data(data);
  _headers.exit().remove();

  let headers = _headers
    .enter()
    .append("g")
    .merge(_headers)
    .attr("class", "header")
    .attr("transform", (d, i) => {
      return `translate(${params.column_width * i}, 0)`;
    });

  addBackgroundBars(headers);
  addForegroundBars(headers);
}

function addBackgroundBars(headers: d3Selection) {
  headers
    .append("rect")
    .attr("height", params.used_set_header_height)
    .attr("width", params.column_width)
    .attr("class", "used-set-background");
}

function addForegroundBars(headers: d3Selection) {
  headers
    .append("rect")
    .attr("height", params.used_set_header_height / 2)
    .attr("width", params.column_width)
    .attr("class", "used-set-background");
}

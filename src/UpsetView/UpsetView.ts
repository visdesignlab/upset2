/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:32 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-09 18:16:48
 */

import * as d3 from "d3";
import { Set } from "./../DataStructure/Set";
import { Data } from "./../DataStructure/Data";
import { ViewBase } from "provenance_mvvm_framework";
import html from "./upset.view.html";
import { d3Selection } from "./../type_declarations/types";

export class UpsetView extends ViewBase {
  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    d3.select(this.Root).html(html);
    this.createHeaderVis();
  }

  createHeaderVis() {
    let headerVis = d3.select("#header-vis").style("padding-top", "10px");
    let dims = (headerVis.node() as HTMLElement).getBoundingClientRect();
    let headerSvg = headerVis
      .append("svg")
      .style("height", "150px")
      .style("width", dims.width);

    let setSelection = headerSvg.selectAll(".setSelection").data([1]);

    setSelection
      .enter()
      .append("g")
      .attr("class", "setSelection")
      .attr("transform", "translate(0,0)")
      .append("g")
      .attr("class", "usedSets")
      .attr("transform", `translate(0,7)`);
  }

  update(data: Data) {
    this.updateHeaders(data);
  }
  updateHeaders(data: Data) {
    let cellDistance = 20;

    let usedSetLabels = d3
      .select("#header-vis")
      .select(".usedSets")
      .selectAll(".setLabel")
      .data(data.usedSets, (d: Set, i) => {
        return d.elementName;
      });

    usedSetLabels.exit().remove();

    let usedSetLabelsEnter = usedSetLabels
      .enter()
      .append("g")
      .attr("class", "setLabel")
      .attr("transform", (d, i) => {
        return `translate(${cellDistance * i}, 0)`;
      })
      .attr("opacity", 1);

    usedSetLabelsEnter
      .append("rect")
      .attr("class", "sizeBackground")
      .attr("height", 70)
      .attr("width", cellDistance);

    usedSetLabelsEnter
      .append("rect")
      .attr("class", "setSizeRect setSize")
      .attr("x", 1)
      .attr("width", cellDistance - 2);

    d3.selectAll(".usedSets .setSize")
      .transition()
      .duration(1000)
      .attr("y", (d: Set, i) => {
        return 70 - this.setSizeScale(data.sets, d.setSize);
      })
      .attr("height", (d: Set, i) => {
        return this.setSizeScale(data.sets, d.setSize);
      });
  }
  private setSizeScale(data: Set[], size: number): number {
    let scale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d: Set) => {
          return d.setSize;
        })
      ])
      .nice()
      .range([0, 70]);
    return scale(size);
  }
}

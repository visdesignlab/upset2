/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:32 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-11 17:28:26
 */
import { d3Selection, RenderRow } from "./../type_declarations/types";

import * as d3 from "d3";
import { Set } from "./../DataStructure/Set";
import { Data } from "./../DataStructure/Data";
import { ViewBase } from "provenance_mvvm_framework";
import html from "./upset.view.html";
import params from "./ui_params";
import "./styles.scss";
export class UpsetView extends ViewBase {
  headerVis: d3Selection;
  bodyVis: d3Selection;
  headerSVG: d3Selection;
  usedSetsHeaderGroup: d3Selection;
  bodySVG: d3Selection;

  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    d3.select(this.Root).html(html);
    this.headerVis = d3
      .select(this.Root)
      .select("#header-vis")
      .style("padding", "5px 0px");
    this.bodyVis = d3.select(this.Root).select("#body-vis");

    let width = (this.headerVis.node() as HTMLElement).getBoundingClientRect()
      .width;

    this.headerSVG = this.headerVis
      .append("svg")
      .style("width", width)
      .style("height", params.header_height);

    this.bodySVG = this.bodyVis
      .append("svg")
      .style("width", width)
      .style("height", 1000);

    this.usedSetsHeaderGroup = this.headerSVG
      .append("g")
      .attr("class", "usedSetGroup")
      .attr("transform", `translate(0,${params.padding})`);
  }

  update(data: Data) {
    this.usedSetsHeaderGroup.html("");

    this.updateUsedSetHeader(
      data.usedSets,
      d3.max(data.sets.map(d => d.setSize))
    );
    this.updateUsedSetConnectors(
      data.usedSets,
      d3.max(data.sets.map(d => d.setSize))
    );

    this.updateRows(data.renderRows);

    (window as any).data = data;
  }

  private updateRows(data: Array<RenderRow>) {
    let body = this.bodySVG.selectAll(".subSetView").data([1]);

    let ssv = body
      .enter()
      .append("g")
      .attr("class", "subSetView")
      .attr("transform", `translate(0, ${params.padding})`);

    let rows = ssv.selectAll(".seperators").data(data);
    rows.exit().enter();

    let rowsEnter = rows
      .enter()
      .append("rect")
      .attr("width", 1000)
      .attr("height", 30)
      .attr("transform", (d, i) => {
        return `translate(0, ${30 * i})`;
      })
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1);
  }

  /**
   * @private
   * @param {Set[]} data
   * @param {number} maxSetSize
   * @memberof UpsetView
   */
  private updateUsedSetConnectors(data: Set[], maxSetSize: number) {
    let usedSetConnectorGroup = this.usedSetsHeaderGroup
      .append("g")
      .attr("class", "usedSetsConnector")
      .attr("transform", `translate(0, ${params.used_set_header_height})`);

    let connectors = usedSetConnectorGroup
      .selectAll(".usedSetConnector")
      .data(data, (d: Set, i) => {
        return d.elementName;
      });

    connectors.exit().remove();

    let connectorsEnter = connectors
      .enter()
      .append("g")
      .attr("class", "usedSetConnector")
      .attr("transform", (d, i) => {
        return `translate(${params.col_width * i}, 0)`;
      })
      .on("mouseover", this.mouseover.bind(this))
      .on("mouseout", this.mouseout.bind(this))
      .on("click", this.click.bind(this));

    connectorsEnter
      .append("rect")
      .attr("class", (d, i) => {
        return `connector setSizeBackground ${d.id}`;
      })
      .attr("width", params.col_width)
      .attr("height", params.connector_height)
      .attr("transform", "skewX(45)");

    connectorsEnter
      .append("text")
      .text((d, i) => {
        return d.elementName;
      })
      .style("text-anchor", "end");

    let textHeight = (connectorsEnter.select("text").node() as any).getBBox()
      .height;

    connectorsEnter
      .selectAll("text")
      .attr(
        "transform",
        `translate(${params.connector_height / Math.sqrt(2) +
          params.col_width / Math.sqrt(2) +
          textHeight / 2}, ${params.connector_height})rotate(45)`
      );
  }

  /**
   * @private
   * @param {Set[]} data
   * @param {number} maxSetSize
   * @memberof UpsetView
   */
  private updateUsedSetHeader(data: Set[], maxSetSize: number) {
    let usedSetsGroup = this.usedSetsHeaderGroup
      .append("g")
      .attr("class", "usedSets");

    let usedSets = usedSetsGroup
      .selectAll(".usedSet")
      .data(data, (d: Set, i) => {
        return d.elementName;
      });

    usedSets.exit().remove();

    let usedSetsEnter = usedSets
      .enter()
      .append("g")
      .attr("class", "usedSet")
      .on("mouseover", this.mouseover.bind(this))
      .on("mouseout", this.mouseout.bind(this))
      .on("click", this.click.bind(this));
    usedSetsEnter
      .append("rect")
      .attr("class", (d, i) => {
        return `setSizeBackground ${d.id}`;
      })
      .attr("width", params.col_width)
      .attr("height", params.used_set_header_height)
      .attr("transform", (d, i) => {
        return `translate(${params.col_width * i}, 0)`;
      });

    usedSetsEnter
      .append("rect")
      .attr("class", "setSizeForeground")
      .attr("width", params.col_width)
      .attr("height", (d, i) => {
        return setSizeScale(
          maxSetSize,
          params.used_set_header_height,
          d.setSize
        );
      })
      .attr("transform", (d, i) => {
        return `translate(${params.col_width *
          i}, ${params.used_set_header_height -
          setSizeScale(maxSetSize, params.used_set_header_height, d.setSize)})`;
      });
  }

  private mouseover(data: Set, idx: number) {
    this.headerSVG
      .selectAll(`.${data.id}`)
      .style("fill", "rgb(254, 217, 166)")
      .style("stroke", "#aaa")
      .style("stroke-width", "1px");
  }

  private mouseout(data: Set, idx: number) {
    this.headerSVG
      .selectAll(`.${data.id}`)
      .style("fill", "#ddd")
      .style("stroke", "")
      .style("stroke-width", "0px");
  }

  private click(data: Set, idx: number) {}
}

function setSizeScale(
  maxDomain: number,
  maxRange: number,
  size: number
): number {
  let scale = d3
    .scaleLinear()
    .domain([0, maxDomain])
    .nice()
    .range([0, maxRange]);
  return scale(size);
}

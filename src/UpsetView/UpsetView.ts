/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:32 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-11 17:28:26
 */
import * as d3 from "d3";
import { ScaleContinuousNumeric } from "d3";
import { ViewBase } from "provenance_mvvm_framework";
import { RowType } from "../DataStructure/RowType";
import { SubSet } from "../DataStructure/SubSet";
import { Data } from "./../DataStructure/Data";
import { Set } from "./../DataStructure/Set";
import { d3Selection, RenderRow } from "./../type_declarations/types";
import "./styles.scss";
import params from "./ui_params";
import html from "./upset.view.html";
export class UpsetView extends ViewBase {
  headerVis: d3Selection;
  bodyVis: d3Selection;
  headerSVG: d3Selection;
  usedSetsHeaderGroup: d3Selection;
  bodySVG: d3Selection;
  cardinalityScale: ScaleContinuousNumeric<any, any>;

  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    d3.select(this.Root).html(html);
    this.headerVis = d3
      .select(this.Root)
      .select("#header-vis")
      .style("padding", "5px 0px 0px 0px");
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
    this.updateUsedSetConnectors(data.usedSets);
    this.updateRows(data.renderRows, data.usedSets, data.allItems.length);

    this.updateCardinalityScale(
      data.usedSets.length,
      data.allItems.length,
      Math.max(...data.renderRows.map(d => d.data.setSize))
    );

    (window as any).data = data;
  }

  private updateCardinalityScale(
    usedSetCount: number,
    totalItems: number,
    maxCardinality: number
  ) {
    let sections = 5;

    if (totalItems > 10000) sections = 4;

    let domainTicksArr: Array<number> = [...Array(sections + 1).keys()];
    let t = totalItems / sections;
    domainTicksArr.forEach((d, i) => {
      domainTicksArr[i] = Math.floor(t * i);
    });

    this.cardinalityScale = getCardinalityScaleData(
      totalItems,
      params.max_cardinality_width
    );

    let csg = this.headerSVG.selectAll(".cardinalityScaleGroup").data([1]);
    csg.exit().remove();
    csg
      .enter()
      .append("g")
      .attr("class", "cardinalityScaleGroup")
      .merge(csg)
      .attr(
        "transform",
        `translate(${params.connector_height +
          (usedSetCount + 1) * params.col_width}, ${params.header_height -
          params.cardinality_scale_height})`
      )
      .append("rect")
      .attr("height", params.cardinality_scale_height)
      .attr("width", params.cardinality_scale_width);

    let cardinalityScaleGroup = d3.select(".cardinalityScaleGroup");

    let topAxisG = cardinalityScaleGroup
      .html("")
      .append("g")
      .attr("class", "overViewTopAxis");

    let topAxis = topAxisG
      .append("path")
      .attr("class", "axis domain up")
      .attr("d", `M0 6 V0 H${params.cardinality_scale_width} V6`);

    let ticksU = topAxisG.selectAll(".tick").data(domainTicksArr);
    ticksU.exit().enter();

    let ticksUpper = ticksU
      .enter()
      .append("g")
      .attr("class", "tick")
      .merge(ticksU)
      .attr("transform", (d, i) => {
        return `translate(${this.cardinalityScale(d)}, 0)`;
      });
    ticksUpper
      .html("")
      .append("line")
      .attr("y2", 6)
      .style("stroke", "black");

    ticksUpper
      .append("text")
      .text((d, i) => {
        return d;
      })
      .attr("dy", "1.8em")
      .attr("text-anchor", "middle");

    let bottomAxisG = cardinalityScaleGroup
      .append("g")
      .attr("class", "overViewBottomAxis");

    bottomAxisG
      .append("path")
      .attr("class", "axis domain down")
      .attr("d", `M0,18 v6 H${params.cardinality_scale_width} v-6`);

    let ticksB = bottomAxisG.selectAll(".tick").data(domainTicksArr);
    ticksB.exit().enter();

    let ticksBottom = ticksB
      .enter()
      .append("g")
      .attr("class", "tick")
      .merge(ticksB)
      .attr("transform", (d, i) => {
        return `translate(${this.cardinalityScale(d)}, 18)`;
      });

    ticksBottom
      .html("")
      .append("line")
      .attr("y2", 6)
      .style("stroke", "black");

    let sliderGroup = cardinalityScaleGroup
      .append("g")
      .attr("class", "sliderGroup")
      .attr(
        "transform",
        `translate(${this.cardinalityScale(maxCardinality)}, 3)`
      );

    sliderGroup
      .append("rect")
      .attr("class", "sliderEl")
      .attr("transform", "rotate(45)")
      .attr("height", 10)
      .attr("width", 10);

    cardinalityScaleGroup
      .append("rect")
      .attr("class", "drawBrush")
      .attr("height", 24)
      .attr("width", () => {
        return this.cardinalityScale(maxCardinality);
      });

    let comm = this.comm;
    this.comm.on("slider-changed", this.sliderChanged, this);
    sliderGroup.call(
      d3
        .drag()
        .on("start", dragStarted)
        .on("drag", function() {
          dragged.call(this);
          let transformStr = d3.select(this).attr("transform");
          let x = transformStr
            .substring(transformStr.indexOf("(") + 1, transformStr.indexOf(")"))
            .split(",")[0];
          comm.emit("slider-changed", x);
        })
        .on("end", function() {
          dragEnded.call(this);
        })
    );

    let transformStr = sliderGroup.attr("transform");
    let x = transformStr
      .substring(transformStr.indexOf("(") + 1, transformStr.indexOf(")"))
      .split(",")[0];
    this.comm.emit("slider-changed", x);
  }

  private sliderChanged(newSliderPosition: number) {
    let drawBrush = d3.select(".drawBrush");
    drawBrush.attr("width", () => {
      return newSliderPosition;
    });

    let cardinalityBars = d3.selectAll(".cardinalityBarG");
    let data = cardinalityBars.data() as RenderRow[];
    let domEnd = this.cardinalityScale.invert(newSliderPosition);

    let scale = getCardinalityScaleData(domEnd, params.max_cardinality_width);
    let rowWidths = data.map(d => scale(d.data.setSize));

    let horizonCalc: Array<Array<number>> = [];

    rowWidths.forEach(d => {
      let a = [];
      a.push(Math.floor(d / 200));
      a.push(d % 200);
      horizonCalc.push(a);
    });

    cardinalityBars.each(function(d, i) {
      let cardinalityBar = d3.select(this).html("");

      let card_data = horizonCalc[i];

      let offset = 0;
      let j = 0;
      for (j = 0; j < card_data[0] && j < 3; ++j) {
        cardinalityBar
          .append("rect")
          .attr("class", "cardinalityBar")
          .attr("height", params.cardinality_height - offset)
          .attr("width", 200)
          .attr("transform", `translate(0, ${offset / 2})`)
          .style(
            "fill",
            `rgba(${50 - (offset / 10) * 10}, ${50 - (offset / 10) * 10}, ${50 -
              (offset / 10) * 10}, 0.5 )`
          );
        offset += 10;
      }
      if (j < 3) {
        cardinalityBar
          .append("rect")
          .attr("class", "cardinalityBar")
          .attr("height", params.cardinality_height - offset)
          .attr("width", card_data[1])
          .attr("transform", `translate(0, ${offset / 2})`)
          .style(
            "fill",
            `rgba(${50 - (offset / 10) * 10}, ${50 - (offset / 10) * 10}, ${50 -
              (offset / 10) * 10}, 0.5 )`
          );
      } else {
        cardinalityBar
          .append("line")
          .attr("x1", 170)
          .attr("y1", 0)
          .attr("x2", 190)
          .attr("y2", params.row_height)
          .attr("stroke", "white");
        cardinalityBar
          .append("line")
          .attr("x1", 175)
          .attr("y1", 0)
          .attr("x2", 195)
          .attr("y2", params.row_height)
          .attr("stroke", "white");
      }
    });

    cardinalityBars
      .append("text")
      .text((d: RenderRow, i) => {
        return d.data.setSize;
      })
      .attr("transform", `translate(204,${params.textHeight})`);
  }

  private updateRows(
    data: Array<RenderRow>,
    usedSets: Set[],
    totalItems: number
  ) {
    let body = this.bodySVG.selectAll(".subSetView").data([1]);
    body.exit().remove();

    body
      .enter()
      .append("g")
      .attr("class", "subSetView");

    let ssv = this.bodySVG.select(".subSetView");

    let colGroup = ssv.selectAll(".colGroup").data([1]);

    colGroup.exit().remove();

    colGroup
      .enter()
      .append("g")
      .attr("class", "colGroup");

    let colGroupSel = ssv.select(".colGroup");

    colGroupSel.attr("transform", `translate(${params.connector_height}, 0)`);

    let cols = colGroupSel.selectAll(".col").data(usedSets);

    this.addColumns(cols, data);

    let rows = ssv.selectAll(".row").data(data, (d: RenderRow) => {
      return d.data.elementName;
    });

    rows
      .exit()
      .transition()
      .duration(10)
      .remove();

    let rowsMerged = this.addRows(rows);

    let groups = rowsMerged.filter(d => d.data.type === RowType.GROUP);
    let subset = rowsMerged.filter(d => d.data.type === RowType.SUBSET);

    this.updateGroups(groups);

    this.updateSubsets(subset);

    let combinations = subset
      .append("g")
      .attr("class", "combinations")
      .attr("transform", `translate(${params.connector_height}, 0)`);

    this.addCombinations(combinations);

    let t = data.filter(d => d.data.type === RowType.SUBSET)[0];

    let cardinality_offset =
      params.connector_height +
      (t.data as SubSet).combinedSets.length * params.col_width +
      params.col_width;

    // * Add cardinality bars
    subset
      .append("g")
      .attr("class", "cardinalityBarG")
      .attr("transform", (d, i) => {
        return `translate(${cardinality_offset}, ${(params.row_height -
          params.cardinality_height) /
          2})`;
      });

    groups
      .append("g")
      .attr("class", "cardinalityBarG")
      .attr("transform", (d, i) => {
        return `translate(${cardinality_offset}, ${(params.row_height -
          params.cardinality_height) /
          2})`;
      });

    this.addCardinalityBars(rowsMerged as any, data, totalItems);
  }

  private updateSubsets(
    subset: d3.Selection<d3.BaseType, RenderRow, d3.BaseType, {}>
  ) {
    subset
      .append("rect")
      .attr("class", "subsetBackgroundRect")
      .attr("width", "70%")
      .attr("height", 30)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("transform", `translate(${params.connector_height}, 0)`);
  }

  private updateGroups(
    groups: d3.Selection<d3.BaseType, RenderRow, d3.BaseType, {}>
  ) {
    groups
      .append("rect")
      .attr("class", "groupBackgroundRect")
      .attr("width", "100%")
      .attr("height", 30)
      .attr("rx", 5)
      .attr("ry", 5);
    groups
      .append("text")
      .text((d, i) => {
        return d.data.elementName;
      })
      .attr(
        "transform",
        `translate(4, ${params.row_height - params.textHeight / 2})`
      );
  }

  private addRows(rows: d3.Selection<d3.BaseType, RenderRow, d3.BaseType, {}>) {
    let rowsMerged = rows
      .enter()
      .append("g")
      .merge(rows);
    rowsMerged
      .html("")
      .attr("class", (d, i) => {
        return `row ${d.data.type.toString()}`;
      })
      .transition()
      .duration(500)
      .attr("transform", (d, i) => {
        return `translate(0, ${params.row_height * i})`;
      });
    return rowsMerged;
  }

  private addColumns(
    cols: d3.Selection<d3.BaseType, Set, d3.BaseType, {}>,
    data: RenderRow[]
  ) {
    cols.exit().remove();
    cols
      .enter()
      .append("g")
      .attr("class", "col")
      .merge(cols)
      .on("mouseover", this.mouseover.bind(this))
      .on("mouseout", this.mouseout.bind(this))
      .on("click", this.click.bind(this))
      .html("")
      .append("rect")
      .attr("class", (d, i) => {
        return `columns ${d.id}`;
      })
      .attr("height", params.row_height * data.length)
      .attr("width", params.col_width)
      .attr("transform", (d, i) => {
        return `translate(${params.row_height * i})`;
      });
  }

  private addCombinations(
    combinations: d3.Selection<d3.BaseType, RenderRow, d3.BaseType, {}>
  ) {
    combinations.each(function(d, i) {
      let combs = d3
        .select(this)
        .selectAll("circle")
        .data((d.data as SubSet).combinedSets);
      combs.exit().remove();
      combs
        .enter()
        .append("circle")
        .merge(combs)
        .attr("r", params.col_width / 2 - 5)
        .attr("cy", params.row_height / 2)
        .attr("cx", (d, i) => {
          return params.row_height * i + params.row_height / 2;
        })
        .attr("fill", (d, i) => {
          if (d === 0) return "rgb(240,240,240)";
          return "rgb(99,99,99)";
        });
    });
  }

  private addCardinalityBars(
    rowsMerged: d3Selection,
    data: RenderRow[],
    totalItems: number
  ) {
    let cardinalityBars = rowsMerged.selectAll(".cardinalityBarG");

    this.cardinalityScale = getCardinalityScaleData(
      totalItems,
      params.max_cardinality_width
    );

    let rowWidths = data.map(d => this.cardinalityScale(d.data.setSize));

    cardinalityBars
      .append("rect")
      .attr("class", "cardinalityBar")
      .attr("height", params.cardinality_height)
      .attr("width", (d: RenderRow, i) => {
        return rowWidths[i];
      });

    cardinalityBars
      .append("text")
      .text((d: RenderRow, i) => {
        return d.data.setSize;
      })
      .attr("transform", `translate(4,${params.textHeight})`);
  }

  private updateUsedSetConnectors(data: Set[]) {
    let usedSetConnectorGroup = this.usedSetsHeaderGroup
      .append("g")
      .attr("class", "usedSetsConnector")
      .attr("transform", `translate(0, ${params.used_set_header_height})`)
      .attr("cursor", "pointer");

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
      .on("click", this.connectorClick.bind(this));

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

    params.textHeight = (connectorsEnter
      .select("text")
      .node() as any).getBBox().height;

    connectorsEnter
      .selectAll("text")
      .attr(
        "transform",
        `translate(${params.connector_height / Math.sqrt(2) +
          params.col_width / Math.sqrt(2) +
          params.textHeight}, ${params.connector_height})rotate(45)`
      );
  }

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
    d3.select(this.Root)
      .selectAll(`.${data.id}`)
      .style("fill", "rgb(254, 217, 166)")
      .style("stroke", "#aaa")
      .style("stroke-width", "1px");
  }

  private mouseout(data: Set, idx: number) {
    d3.select(this.Root)
      .selectAll(`.${data.id}`)
      .style("fill", "#ddd")
      .style("stroke", "")
      .style("stroke-width", "0px");
  }

  private click(data: Set, idx: number) {}

  private connectorClick(data: Set, idx: number) {
    this.comm.emit("set-filter", idx);
  }
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

function getCardinalityScaleData(
  noItems: number,
  max_cardinality_width: number
): d3.ScaleContinuousNumeric<any, any> {
  let totalSizeRange = noItems.toString().length;
  let scale: any;

  if (totalSizeRange > 3) {
    scale = d3
      .scalePow()
      .exponent(0.5)
      .domain([0, noItems])
      .range([0, max_cardinality_width]);
  } else {
    scale = d3
      .scaleLinear()
      .domain([0, noItems])
      .range([0, max_cardinality_width]);
  }

  return scale;
}

function dragStarted() {
  d3.select(this)
    .raise()
    .classed("active", true);
}

function dragged() {
  let m = d3.event.x;
  if (m >= 0 && m <= 200) {
    if (Math.abs(m - 0) <= 0.9) m = 1;
    if (Math.abs(m - 200) <= 0.9) m = 200;
    d3.select(this).attr("transform", `translate(${m}, 3)`);
  }
}

function dragEnded() {
  d3.select(this).classed("active", false);
}

/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:32 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-10-10 07:23:53
 */
import * as d3 from "d3";
import { ViewBase } from "provenance_mvvm_framework";
import { Data } from "./../DataStructure/Data";
import { d3Selection } from "./../type_declarations/types";
import "./styles.scss";
import html from "./upset.view.html";
import {
  usedSetsHeader,
  addRenderRows,
  addCardinalityHeader,
  addDeviationHeaders,
  addAttributeHeaders
} from "./uiBuilderFunctions";
import params from "./ui_params";
import { EmbedConfig } from "../DataStructure/EmbedConfig";

export class UpsetView extends ViewBase {
  svg: d3Selection;
  headerGroup: d3Selection;
  bodyGroup: d3Selection;
  selectedSetHeaderGroup: d3Selection;
  cardinalityScaleGroup: d3Selection;
  deviationGroup: d3Selection;
  attributeHeaders: d3Selection;
  setsComboGroup: d3Selection;
  cardinalityBarGroup: d3Selection;
  dropdownGroup: d3Selection;
  deviationBars: d3Selection;
  attributeBars: d3Selection;
  config: EmbedConfig;

  constructor(root: HTMLElement, config: EmbedConfig) {
    super(root);
    this.config = config;
  }

  create() {
    let root = d3.select(this.Root);
    root.html(root.html() + html);

    this.svg = d3
      .select(this.Root)
      .select("#vis")
      .append("svg");

    this.headerGroup = this.svg.append("g").attr("class", "header");
    this.dropdownGroup = this.headerGroup
      .append("g")
      .classed("dropdown-header", true);
    this.selectedSetHeaderGroup = this.headerGroup
      .append("g")
      .attr("class", "selected-sets-header");
    this.cardinalityScaleGroup = this.headerGroup
      .append("g")
      .attr("class", "cardinality-scale-group");
    this.deviationGroup = this.headerGroup
      .append("g")
      .attr("class", "deviation-group");
    this.attributeHeaders = this.headerGroup
      .append("g")
      .attr("class", "attribute-headers");

    this.bodyGroup = this.svg
      .append("g")
      .attr("class", "body")
      .attr("transform", `translate(0,${params.header_body_padding})`);
    this.setsComboGroup = this.bodyGroup
      .append("g")
      .attr("class", "sets-combo-group");
  }

  update(data: Data) {
    let excludeSets = ["Name", "Set Count", "Sets"];

    usedSetsHeader(
      data.usedSets,
      this.selectedSetHeaderGroup,
      d3.max(data.sets, d => {
        return d.setSize;
      }),
      this.comm
    );

    addRenderRows(
      data,
      this.setsComboGroup,
      data.usedSets.length,
      this.config,
      this.comm
    );

    if (!this.config || this.config.CardinalityBars) {
      addCardinalityHeader(
        data.allItems.length,
        d3.max(data.renderRows.map(d => d.data.setSize)),
        this.cardinalityScaleGroup,
        this.comm
      );
    }

    if (!this.config || this.config.DeviationBars) {
      addDeviationHeaders(
        this.deviationGroup,
        d3.max(data.renderRows.map(d => Math.abs(d.data.disproportionality))),
        this.comm
      );
    }

    if (true) {
      addAttributeHeaders(this.attributeHeaders, data, this.comm);
    }

    this.svg.attr("height", params.svg_height).attr("width", params.svg_width);

    (this as any).app.emit("used-set-changed");
  }
}

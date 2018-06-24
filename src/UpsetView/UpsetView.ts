/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:32 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-11 17:28:26
 */
import * as d3 from "d3";
import { ViewBase } from "provenance_mvvm_framework";
import { d3Selection } from "./../type_declarations/types";
import "./styles.scss";
import html from "./upset.view.html";

export class UpsetView extends ViewBase {
  svg: d3Selection;
  headerGroup: d3Selection;
  bodyGroup: d3Selection;

  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    let root = d3.select(this.Root);
    root.html(root.html() + html);

    this.svg = d3
      .select(this.Root)
      .select("#vis")
      .append("svg");

    this.headerGroup = this.svg.append("g").attr("class", "header");
    this.headerGroup.append("g").attr("class", "selected-sets-header");
    this.headerGroup.append("g").attr("class", "cardinality-scale-group");
    this.headerGroup.append("g").attr("class", "deviation-group");
    this.headerGroup.append("g").attr("class", "attribute-headers");

    this.bodyGroup = this.svg.append("g").attr("class", "body");
    this.bodyGroup.append("g").attr("class", "sets-combo-group");
    this.bodyGroup.append("g").attr("class", "cardinality-bar-group");
    this.bodyGroup.append("g").attr("class", "deviation-bars");
    this.bodyGroup.append("g").attr("class", "attribute-bars");
  }

  update() {}
}

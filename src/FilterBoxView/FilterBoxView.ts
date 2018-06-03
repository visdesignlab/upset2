/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:32 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 14:36:32 
 */
import * as d3 from "d3";
import { ViewBase } from "provenance_mvvm_framework";

export class FilterBoxView extends ViewBase {
  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    // First dropdown
    d3
      .select(this.Root)
      .append("div")
      .style("font-weight", "bold")
      .text("First, aggregate by:");

    let first_dropdown = d3
      .select(this.Root)
      .append("div")
      .attr("class", "dropdown");

    first_dropdown
      .append("button")
      .attr("class", "btn btn-secondary dropdown-toggle")
      .attr("id", "first-agg-dropdown")
      .attr("data-toggle", "dropdown")
      .attr("type", "button")
      .style("width", "160px");

    // Second dropdown
    d3
      .select(this.Root)
      .append("div")
      .style("font-weight", "bold")
      .text("Then, aggregate by:");

    let second_dropdown = d3
      .select(this.Root)
      .append("div")
      .attr("class", "dropdown");

    second_dropdown
      .append("button")
      .attr("class", "btn btn-secondary dropdown-toggle")
      .attr("id", "first-agg-dropdown")
      .attr("data-toggle", "dropdown")
      .attr("type", "button")
      .style("width", "160px");

    // Sort By (Radio Button)
    d3
      .select(this.Root)
      .append("div")
      .style("font-weight", "bold")
      .text("Sort by:");

    let sort_by_options = ["Degree", "Cardinality", "Deviation"];

    let test_radio_button = d3
      .select(this.Root)
      .selectAll("foo")
      .data(sort_by_options)
      .enter()
      .append("div")
      .attr("class", "radio_button");

    test_radio_button
      .append("input")
      .attr("class", "btn btn-radio sort-by")
      .attr("id", "sort-by-option")
      .attr("type", "radio")
      .attr("name", "optradio");

    test_radio_button
      .append("span")
      .style("margin", "5px")
      .text(function(d, i) {
        return d;
      });
  }

  update() {}
}

import { IDataSetInfo } from "./../Data";
import * as d3 from "d3";
import { ViewBase } from "provenance_mvvm_framework";
import { AggregationOption } from "../Data";
``;
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
    //   .text(AggregationOption[0]);

    // let f_options = first_dropdown
    //   .append("div")
    //   .attr("class", "dropdown-menu")
    //   .selectAll("a")
    //   .data(AggregationOption)
    //   .enter()
    //   .append("a")
    //   .attr("class", "dropdown-item")
    //   .text((d, i) => {
    //     return d;
    //   })
    //   .on("click", d => {
    //     console.log(d);
    //   });

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
  }

  update() {}
}

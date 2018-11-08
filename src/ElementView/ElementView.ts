import { SubSet } from "./../DataStructure/SubSet";
import { Attribute } from "./../DataStructure/Attribute";
import { RenderRow, d3Selection } from "./../type_declarations/types";
import { ViewBase } from "provenance_mvvm_framework";
import * as d3 from "d3";
import { ElementRenderRows } from "./ElementViewModel";

export class ElementView extends ViewBase {
  ElementVisualizationDiv: d3Selection;
  ElementQueryDiv: d3Selection;
  ElementQueryFiltersDiv: d3Selection;
  ElementQueryResultsDiv: d3Selection;

  currentSelection: number;

  constructor(root: HTMLElement) {
    super(root);
    this.comm.on("remove-selection-trigger", (idx: number) => {
      if (this.currentSelection === idx) this.currentSelection = -1;
    });
  }

  create() {
    let base = d3.select(this.Root);
    this.ElementQueryDiv = base.append("div").attr("id", "element-query");
    this.ElementQueryDiv.append("div").classed("columns is-multiline", true);

    this.ElementVisualizationDiv = base
      .append("div")
      .attr("id", "element-visualization");

    this.ElementQueryFiltersDiv = base
      .append("div")
      .attr("id", "element-query-filters");

    this.ElementQueryResultsDiv = base
      .append("div")
      .attr("id", "element-query-results");
  }

  update(data: ElementRenderRows, attributes: Attribute[]) {
    this.renderQueries(data);
  }

  renderQueries(data: ElementRenderRows) {
    let el = this.ElementQueryDiv.select(".columns");

    let tabs = el.selectAll(".column").data(data);
    tabs.exit().remove();
    tabs = tabs
      .enter()
      .append("div")
      .merge(tabs)
      .classed("column", true)

      .html("");

    let tabContents = tabs.append("a").classed("button", true);
    tabContents
      .append("i")
      .classed("fa fa-square color-swatch", true)
      .style("color", d => d.color);
    tabContents.append("span").text(d => d.data.setSize);
    let closeIcons = tabContents
      .append("i")
      .classed("fa fa-times-circle close-icon", true);

    closeIcons.on("click", (_, i) => {
      this.comm.emit("remove-selection-trigger", i);
    });
  }
}

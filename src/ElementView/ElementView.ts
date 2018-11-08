import { Attribute } from "./../DataStructure/Attribute";
import { d3Selection } from "./../type_declarations/types";
import { ViewBase } from "provenance_mvvm_framework";
import * as d3 from "d3";
import { ElementRenderRows } from "./ElementViewModel";

export class ElementView extends ViewBase {
  ElementVisualizationDiv: d3Selection;
  ElementQueryDiv: d3Selection;
  ElementQueryFiltersDiv: d3Selection;
  ElementQueryResultsDiv: d3Selection;

  data: ElementRenderRows;
  attributes: Attribute[];

  currentSelection: number;

  constructor(root: HTMLElement) {
    super(root);
    this.currentSelection = -1;
    this.comm.on("remove-selection-trigger", (idx: number) => {
      if (this.currentSelection === idx) this.currentSelection = -1;
      if (this.currentSelection < idx) return;
      this.currentSelection--;
      this.renderQueries(this.data);
    });

    this.comm.on("highlight-selection-trigger", (idx: number) => {
      let _do = {
        func: (d: any) => {
          this.comm.emit("highlight-selection", d);
        },
        args: [idx]
      };
      let _undo = {
        func: (d: any) => {
          this.comm.emit("highlight-selection", d);
        },
        args: [this.currentSelection]
      };
      this.comm.emit("apply", ["highlight-selection", _do, _undo]);
    });

    this.comm.on("highlight-selection", (idx: number) => {
      this.highlightSelection(idx);
    });
  }

  create() {
    let base = d3.select(this.Root);
    this.ElementQueryDiv = base.append("div").attr("id", "element-query");
    this.ElementQueryDiv.append("div")
      .classed("tag is-large is-white divider", true)
      .text("Element Queries");
    this.ElementQueryDiv.append("br");
    this.ElementQueryDiv.append("div").classed("columns is-multiline", true);

    this.ElementVisualizationDiv = base
      .append("div")
      .attr("id", "element-visualization");
    this.ElementVisualizationDiv.append("div")
      .classed("tag is-large is-white divider", true)
      .text("Element Visualization");

    this.ElementQueryFiltersDiv = base
      .append("div")
      .attr("id", "element-query-filters");
    this.ElementQueryFiltersDiv.append("div")
      .classed("tag is-large is-white divider", true)
      .text("Query Filters");
    this.ElementQueryResultsDiv = base
      .append("div")
      .attr("id", "element-query-results");
    this.ElementQueryResultsDiv.append("div")
      .classed("tag is-large is-white divider", true)
      .text("Query Results");
  }

  update(data: ElementRenderRows, attributes: Attribute[]) {
    this.data = data;
    this.attributes = attributes;
    this.renderQueries(data);
    this.updateVisualizationAndResults(data, attributes);
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
      d3.event.stopPropagation();
    });

    tabContents.on("click", (d, i) => {
      this.comm.emit("highlight-selection-trigger", i);
    });

    tabContents.classed("is-primary", (_, i) => i === this.currentSelection);
  }

  highlightSelection(idx: number) {
    this.currentSelection = idx;
    this.update(this.data, this.attributes);
  }

  updateVisualizationAndResults(
    data: ElementRenderRows,
    attributes: Attribute[]
  ) {
    console.log("updating");
  }
}

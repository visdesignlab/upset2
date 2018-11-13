import { Attribute } from "./../DataStructure/Attribute";
import { d3Selection } from "./../type_declarations/types";
import { ViewBase } from "provenance_mvvm_framework";
import * as d3 from "d3";
import { ElementRenderRows, ElementRenderRow } from "./ElementViewModel";
import { CreateVegaVis } from "../VegaFactory/VegaFactory";

export class ElementView extends ViewBase {
  ElementVisualizationDiv: d3Selection;
  ElementQueryDiv: d3Selection;
  ElementQueryFiltersDiv: d3Selection;
  ElementQueryResultsDiv: d3Selection;

  data: ElementRenderRows;
  attributes: Attribute[];

  sortAscending: boolean = true;
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

    this.comm.on(
      "highlight-selection",
      (idx: number, update: boolean = true) => {
        this.highlightSelection(idx, update);
      }
    );
  }

  create() {
    let base = d3.select(this.Root);
    this.ElementQueryDiv = base.append("div").attr("id", "element-query");
    this.ElementQueryDiv.append("div")
      .classed("tag is-large is-white divider", true)
      .text("Element Queries");
    this.ElementQueryDiv.append("br");
    this.ElementQueryDiv.append("div").classed("columns is-multiline", true);

    let elementVis = base.append("div").attr("id", "element-visualization");
    elementVis
      .append("div")
      .classed("tag is-large is-white divider", true)
      .text("Element Visualization");

    this.ElementVisualizationDiv = elementVis
      .append("div")
      .classed("is-centered columns element-vis", true);

    this.ElementQueryFiltersDiv = base
      .append("div")
      .attr("id", "element-query-filters");
    this.ElementQueryFiltersDiv.append("div")
      .classed("tag is-large is-white divider", true)
      .text("Query Filters");

    let tableVis = base.append("div").attr("id", "element-query-results");
    tableVis
      .append("div")
      .classed("tag is-large is-white divider", true)
      .text("Query Results");

    this.ElementQueryResultsDiv = tableVis
      .append("div")
      .classed("is-centered columns", true);
  }

  update(data: ElementRenderRows, attributes: Attribute[]) {
    this.data = data;
    this.attributes = attributes;
    this.clearAll();
    if (this.currentSelection < 0 || this.currentSelection >= data.length) {
      console.log("Called");
      this.currentSelection = data.length - 1;
      this.comm.emit("highlight-selection", this.currentSelection, false);
    }
    this.renderQueries(data);

    if (this.data.length > 0)
      this.updateVisualizationAndResults(
        data[this.currentSelection],
        attributes
      );
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

  highlightSelection(idx: number, update: boolean = true) {
    this.currentSelection = idx;
    if (update) this.update(this.data, this.attributes);
  }

  updateVisualizationAndResults(
    data: ElementRenderRow,
    attributes: Attribute[]
  ) {
    this.createVisualization(data, attributes);
    this.createTable(data, attributes);
  }

  clearAll() {
    this.ElementVisualizationDiv.html("");
    this.ElementQueryResultsDiv.html("");
  }

  createVisualization(data: ElementRenderRow, attributes: Attribute[]) {
    let a1 = "Release Date";
    let a2 = "Average Rating";

    let a1_attr = attributes.filter(_ => _.name === a1)[0];
    let a2_attr = attributes.filter(_ => _.name === a2)[0];

    let spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v3.json",
      data: { values: data.arr },
      mark: {
        type: "circle",
        tooltip: {
          content: "data"
        }
      },
      encoding: {
        x: {
          field: a1,
          type: "quantitative",
          scale: { domain: [a1_attr.min, a1_attr.max] }
        },
        y: {
          field: a2,
          type: "quantitative",
          scale: { domain: [a2_attr.min, a2_attr.max] }
        }
      }
    };

    CreateVegaVis(spec, this.ElementVisualizationDiv);
  }

  createTable(data: ElementRenderRow, attributes: Attribute[]) {
    let table = this.ElementQueryResultsDiv.append("table");

    let headers = table
      .append("thead")
      .append("tr")
      .selectAll("th")
      .data(attributes.map(_ => _.name));
    headers.exit().remove();
    headers = headers
      .enter()
      .append("th")
      .merge(headers)
      .classed("has-text-white", true);

    headers.text(d => d);

    let rows = table
      .append("tbody")
      .selectAll("tr")
      .data(data.arr);
    rows.exit().remove();
    rows = rows
      .enter()
      .append("tr")
      .merge(rows);

    let cells = rows.selectAll("td").data(d => {
      return attributes.map(_ => _.name).map(k => {
        return {
          value: d[k],
          name: k
        };
      });
    });

    cells.exit().remove();
    cells = cells
      .enter()
      .append("td")
      .merge(cells);

    cells.attr("data-th", d => d.name);
    cells.text(d => d.value);

    let that = this;
    headers.on("click", function(d) {
      headers.attr("class", "header has-text-white");

      if (that.sortAscending) {
        rows.sort((a, b) => {
          return b[d] - a[d];
        });
        that.sortAscending = !that.sortAscending;
        (this as any).className = "aes has-text-white";
      } else {
        rows.sort((a, b) => {
          return a[d] - b[d];
        });
        that.sortAscending = !that.sortAscending;
        (this as any).className = "des has-text-white";
      }
    });
  }
}

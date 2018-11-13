import { Data } from "./../DataStructure/Data";
import { Attribute } from "./../DataStructure/Attribute";
import { d3Selection } from "./../type_declarations/types";
import { ViewBase } from "provenance_mvvm_framework";
import * as d3 from "d3";
import { ElementRenderRows, ElementRenderRow } from "./ElementViewModel";
import { CreateVegaVis } from "../VegaFactory/VegaFactory";
import html from "./dropdown.view.html";

export class ElementView extends ViewBase {
  ElementVisualizationDiv: d3Selection;
  ElementQueryDiv: d3Selection;
  ElementQueryFiltersDiv: d3Selection;
  ElementQueryResultsDiv: d3Selection;
  AttributeDropdownDiv: d3Selection;
  axis1: d3Selection;
  axis2: d3Selection;

  axis1Selection: string;
  axis2Selection: string;

  data: ElementRenderRows;
  attributes: Attribute[];

  sortAscending: boolean = true;
  currentSelection: number;

  constructor(root: HTMLElement) {
    super(root);
    this.currentSelection = -1;

    this.comm.on("set-axis1", (d: string) => {
      this.axis1Selection = d;
      this.createVisualization(
        this.data[this.currentSelection],
        this.attributes
      );
    });

    this.comm.on("set-axis2", (d: string) => {
      this.axis2Selection = d;
      this.createVisualization(
        this.data[this.currentSelection],
        this.attributes
      );
    });

    this.comm.on("set-axis1-trigger", (d: string) => {
      let _do = {
        func: (d: string) => {
          this.comm.emit("set-axis1", d);
        },
        args: [d]
      };
      let _undo = {
        func: (d: string) => {
          this.comm.emit("set-axis1", d);
        },
        args: [this.axis1Selection]
      };
      this.comm.emit("apply", ["set-axis1", _do, _undo]);
    });

    this.comm.on("set-axis2-trigger", (d: string) => {
      let _do = {
        func: (d: string) => {
          this.comm.emit("set-axis2", d);
        },
        args: [d]
      };
      let _undo = {
        func: (d: string) => {
          this.comm.emit("set-axis2", d);
        },
        args: [this.axis2Selection]
      };
      this.comm.emit("apply", ["set-axis2", _do, _undo]);
    });

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

    this.AttributeDropdownDiv = elementVis
      .append("div")
      .classed("is-centered columns dropdowns", true);

    this.axis1 = this.AttributeDropdownDiv.append("div").classed(
      "column axis1",
      true
    );
    this.axis2 = this.AttributeDropdownDiv.append("div").classed(
      "column axis2",
      true
    );

    this.axis1.html(html);
    this.axis1.select(".axis-label").text("Axis 1");
    this.axis2.html(html);
    this.axis2.select(".axis-label").text("Axis 2");

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
    let plottableAttributes = attributes.filter(
      _ => _.type === "integer" || _.type === "float"
    );

    let op1 = this.axis1
      .select(".options")
      .selectAll("option")
      .data(plottableAttributes);
    op1.exit().remove();
    op1 = op1
      .enter()
      .append("option")
      .merge(op1);
    op1.text(d => d.name);

    let op2 = this.axis2
      .select(".options")
      .selectAll("option")
      .data(plottableAttributes);
    op2.exit().remove();
    op2 = op2
      .enter()
      .append("option")
      .merge(op2);
    op2.text(d => d.name);
    let that = this;

    this.axis1.select(".options").on("input", function(d) {
      that.comm.emit("set-axis1-trigger", (this as any).value);
    });

    this.axis2.select(".options").on("input", function(d) {
      that.comm.emit("set-axis2-trigger", (this as any).value);
    });

    if (!this.axis1Selection)
      this.axis1Selection = this.axis1.select(".options").property("value");
    else {
      this.axis1
        .select(".options")
        .selectAll("option")
        .property("selected", (d: any) => {
          return d.name === this.axis1Selection;
        });
    }

    if (!this.axis2Selection)
      this.axis2Selection = this.axis2.select(".options").property("value");
    else {
      this.axis2
        .select(".options")
        .selectAll("option")
        .property("selected", (d: any) => {
          return d.name === this.axis2Selection;
        });
    }

    let a1_attr = attributes.filter(_ => _.name === this.axis1Selection)[0];
    let a2_attr = attributes.filter(_ => _.name === this.axis2Selection)[0];

    if (!a1_attr || !a2_attr) return;

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
          field: this.axis1Selection,
          type: "quantitative",
          scale: { domain: [a1_attr.min, a1_attr.max] }
        },
        y: {
          field: this.axis2Selection,
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

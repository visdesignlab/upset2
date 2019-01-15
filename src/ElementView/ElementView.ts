import { Attribute } from "./../DataStructure/Attribute";
import { d3Selection } from "./../type_declarations/types";
import { ViewBase } from "provenance_mvvm_framework";
import * as d3 from "d3";
import { ElementRenderRows, ElementRenderRow } from "./ElementViewModel";
import { CreateVegaVis } from "../VegaFactory/VegaFactory";
import html from "./dropdown.view.html";
import queryResults from "./queryresults.view.html";
import querySelectionDropdown from "./queryselection.view.html";
import selectionCard from "./selection.view.html";
import newselection from "./newselection.view.html";

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
  tempSelection: ElementRenderRow;
  currentSelection: number;

  constructor(root: HTMLElement) {
    super(root);
    this.currentSelection = -1;

    this.comm.on("new-temp-selection", (d: ElementRenderRow) => {
      this.tempSelection = d;
    });

    this.comm.on("set-axis1", (d: string) => {
      this.axis1Selection = d;
      this.createVisualization(this.data, this.attributes);
    });

    this.comm.on("set-axis2", (d: string) => {
      this.axis2Selection = d;
      this.createVisualization(this.data, this.attributes);
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
  }

  create() {
    let base = d3.select(this.Root);
    this.ElementQueryDiv = base.append("div").attr("id", "element-query");
    this.ElementQueryDiv.append("div")
      .classed("tag is-large is-white divider", true)
      .text("Element Queries");
    this.ElementQueryDiv.append("br");
    this.ElementQueryDiv.append("div").html(querySelectionDropdown);
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
    tableVis.html(queryResults);

    this.ElementQueryResultsDiv = tableVis
      .append("div")
      .classed("columns", true);
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

    this.updateVisualizationAndResults(data, attributes);
  }

  renderQueries(data: ElementRenderRows) {
    let el = this.ElementQueryDiv.select(".columns");

    // Render new selection:
    let ns = this.ElementQueryDiv.select("#new-selection").html("");
    ns.html(newselection);
    ns.select(".color-swatch").style("color", this.tempSelection.color);
    ns.select(".selection-text").text(this.tempSelection.name);

    ns.select(".add").on("click", () => {
      console.log("Add");
      this.comm.emit(
        "add-selection-trigger",
        Object.assign({}, this.tempSelection)
      );
    });
    ns.select(".remove")
      .classed("is-invisible", this.tempSelection.id === "All Rows")
      .on("click", () => {
        this.comm.emit(
          "reset-temp-selection",
          Object.assign({}, this.tempSelection)
        );
      });
    // Render Bookmarks
    let bookmarkGroup = this.ElementQueryDiv.select("#bookmarks");
    let bookmarks: d3Selection = bookmarkGroup.selectAll("li").data(data);
    bookmarks.exit().remove();
    bookmarks = bookmarks
      .enter()
      .append("li")
      .merge(bookmarks)
      .html("");

    let aTags = bookmarks.append("a");
    aTags.html(selectionCard);

    let that = this;
    aTags.classed("has-background-grey-light", _ => {
      console.log("Hello", _.shown);
      return _.shown;
    });
    aTags.each(function(d: ElementRenderRow) {
      let el = d3.select(this);

      el.select(".color-swatch").style("color", d.color);
      el.select(".selection-text").text(d.name);
      el.select(".remove").on("click", () => {
        that.comm.emit("remove-selection-trigger", d);
      });
      el.on("click", function() {
        that.comm.emit("show-selection", d.hash);
      });
    });
  }

  updateVisualizationAndResults(
    data: ElementRenderRows,
    attributes: Attribute[]
  ) {
    this.createVisualization(data, attributes);
    this.createTable(data.filter(_ => _.shown)[0], attributes);
    this.updateHeights();
  }

  updateHeights() {
    let queryHeight = parsePxToInt(d3.select("#element-query").style("height"));
    let elementVisHeight = parsePxToInt(
      d3.select("#element-visualization").style("height")
    );
    let queryFiltersHeight = parsePxToInt(
      d3.select("#element-query-filters").style("height")
    );
    let navBarHeight = parsePxToInt(
      d3.select("#navigation-bar").style("height")
    );
    let bodyHeight = parsePxToInt(d3.select("body").style("height"));
    d3.select("#element-query-results").style(
      "height",
      `${bodyHeight -
        (navBarHeight + queryHeight + elementVisHeight + queryFiltersHeight)}px`
    );
  }

  clearAll() {
    this.ElementVisualizationDiv.html("");
    this.ElementQueryResultsDiv.html("");
  }

  createVisualization(data: ElementRenderRows, attributes: Attribute[]) {
    let plottableAttributes = attributes.filter(
      _ => _.type === "integer" || _.type === "float"
    );

    let _data: any[] = [];

    data.forEach(ds => {
      let data = ds.arr.slice();
      data.forEach(_ => (_["_color_"] = ds.color));
      _data.push(...data);
    });

    if (data.map(_ => _.hash).indexOf(this.tempSelection.hash) < 0) {
      let ts = this.tempSelection.arr.slice();
      ts.forEach(_ => (_["_color_"] = this.tempSelection.color));
      _data.push(...ts);
    }

    let op1: d3Selection = this.axis1
      .select(".options")
      .selectAll("option")
      .data(plottableAttributes);
    op1.exit().remove();
    op1 = op1
      .enter()
      .append("option")
      .merge(op1);
    op1.text(d => d.name);

    let op2: d3Selection = this.axis2
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

    if (plottableAttributes.length > 1) {
      this.axis2Selection = plottableAttributes[1].name;
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
      $schema: "https://vega.github.io/schema/vega-lite/v3.0.0-rc8.json",
      data: { values: _data },
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
        },
        color: {
          field: "_color_",
          scale: null as any
        }
      }
    };

    CreateVegaVis(spec, this.ElementVisualizationDiv);
  }

  createTable(data: ElementRenderRow, attributes: Attribute[]) {
    if (!data) return;
    let downloadBtn = d3.select("#download-results");
    downloadBtn.on("click", () => {
      this.comm.emit("download-data", data.idx);
    });

    let table = this.ElementQueryResultsDiv.append("table");

    let headers: d3Selection = table
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

    let rows: d3Selection = table
      .append("tbody")
      .selectAll("tr")
      .data(data.arr);
    rows.exit().remove();
    rows = rows
      .enter()
      .append("tr")
      .merge(rows);

    let cells: d3Selection = rows.selectAll("td").data(d => {
      return attributes
        .map(_ => _.name)
        .map(k => {
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

function parsePxToInt(pixel: string): number {
  return parseInt(pixel, 10);
}

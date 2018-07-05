/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:38:29
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-03 16:56:36
 */
import * as d3 from "d3";
import { ViewBase, IProvenanceGraph } from "provenance_mvvm_framework";
import template from "./provenance.view.html";
import { createButtons, createGraph } from "./uiBuilderFunctions";

export class ProvenanceView extends ViewBase {
  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    d3.select(this.Root).html(template);
    let undo = d3.select(this.Root).select(".undo");
    let redo = d3.select(this.Root).select(".redo");
    undo
      .append("img")
      .attr("src", "../../assets/arrow.svg")
      .attr("class", "img")
      .attr("height", 80)
      .attr("width", 80);

    redo
      .append("img")
      .attr("src", "../../assets/arrow.svg")
      .attr("class", "img")
      .attr("height", 80)
      .attr("width", 80);

    undo.on("click", () => {
      this.comm.emit("undo");
    });

    redo.on("click", () => {
      this.comm.emit("redo");
    });
  }

  update(graph: IProvenanceGraph) {
    createButtons(d3.select(this.Root), graph);
    createGraph(d3.select(this.Root).select(".graph-view"), graph, this.comm);
  }
}

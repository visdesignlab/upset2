/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:38:33
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-07 00:15:04
 */
import {
  ViewModelBase,
  Application,
  StateNode,
  ProvenanceGraph
} from "provenance_mvvm_framework";
import { ProvenanceView } from "./ProvenanceView";
import "./styles.scss";

export class ProvenanceViewModel extends ViewModelBase {
  constructor(view: ProvenanceView, app: Application) {
    super(view, app);
    this.App.graph.on("currentChanged", this.update.bind(this));
    this.comm.on("undo", this.undo, this);
    this.comm.on("redo", this.redo, this);
    this.comm.on("go-to-node", this.goTo, this);
    this.comm.on("save-graph", this.saveGraph, this);
    this.comm.on("load-graph", this.loadGraph, this);
    this.update();
  }

  update() {
    (window as any).graph = this.App.graph;
    this.comm.emit("update", this.App.graph);
  }

  undo() {
    if (this.App.graph.current.label === "Root") return;
    this.traverser.toStateNode((this.App.graph.current as StateNode).parent.id);
    this.update();
  }

  redo() {
    if (this.App.graph.current.children.length === 0) return;
    this.traverser.toStateNode(this.App.graph.current.children[0].id);
    this.update();
  }

  goTo(id: string) {
    this.traverser.toStateNode(id);
    this.update();
  }

  saveGraph() {
    localStorage["graph"] = JSON.stringify(
      ProvenanceGraph.serializeProvenanceGraph(this.App.graph as any)
    );
  }

  loadGraph() {
    this.App.graph = ProvenanceGraph.restoreProvenanceGraph(
      JSON.parse(localStorage["graph"])
    );
    this.traverser.graph = this.App.graph;
    this.update();
  }
}

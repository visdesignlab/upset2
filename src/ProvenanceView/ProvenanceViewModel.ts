/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:38:33
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-03 16:06:24
 */
import { ViewModelBase, Application } from "provenance_mvvm_framework";
import { ProvenanceView } from "./ProvenanceView";
import "./styles.scss";

export class ProvenanceViewModel extends ViewModelBase {
  constructor(view: ProvenanceView, app: Application) {
    super(view, app);
    this.App.graph.on("nodeAdded", this.update.bind(this));
    this.comm.on("undo", this.undo, this);
    this.comm.on("redo", this.redo, this);
  }

  update() {
    this.comm.emit("update", this.App.graph);
  }

  undo() {
    this.update();
  }

  redo() {
    this.update();
  }
}

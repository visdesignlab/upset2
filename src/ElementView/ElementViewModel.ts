import { RenderRow } from "./../type_declarations/types";
import { ElementView } from "./ElementView";
import { Application } from "provenance_mvvm_framework";
import { ViewModelBase } from "provenance_mvvm_framework";
import "./style.scss";

export class ElementViewModel extends ViewModelBase {
  private selectedSet: RenderRow[];

  constructor(view: ElementView, app: Application) {
    super(view, app);
    this.selectedSet = [];

    this.App.on("add-selection", this.addSelection, this);
    this.App.on("remove-selection", this.removeSelection, this);

    this.registerFunctions(
      "add-selection",
      (d: RenderRow) => {
        this.App.emit("add-selection", d);
      },
      this
    );

    this.registerFunctions(
      "add-selection",
      (idx: number) => {
        this.App.emit("remove-selection", idx);
      },
      this,
      false
    );

    this.registerFunctions(
      "remove-selection",
      (idx: number) => {
        this.App.emit("remove-selection", idx);
      },
      this
    );

    this.registerFunctions(
      "remove-selection",
      (d: RenderRow) => {
        this.App.emit("add-selection", d);
      },
      this,
      false
    );

    this.comm.on("add-selection-trigger", (d: RenderRow) => {
      let _do = {
        func: (d: RenderRow) => {
          this.App.emit("add-selection", d);
        },
        args: [d]
      };
      let _undo = {
        func: (idx: number) => {
          this.App.emit("remove-selection", idx);
        },
        args: [this.selectedSet.length]
      };
      this.apply.call(this, ["add-selection", _do, _undo]);
    });

    this.comm.on("remove-selection-trigger", (idx: number) => {
      let _do = {
        func: (idx: number) => {
          this.App.emit("remove-selection", idx);
        },
        args: [idx]
      };
      let _undo = {
        func: (d: RenderRow) => {
          this.App.emit("add-selection", d);
        },
        args: [this.selectedSet[idx]]
      };
      this.apply.call(this, ["remove-selection", _do, _undo]);
    });
  }

  addSelection(sel: RenderRow) {
    this.selectedSet.push(sel);
    this.update();
  }

  removeSelection(idx: number) {
    this.selectedSet.splice(idx, 1);
    this.update();
  }

  update() {
    this.comm.emit("update", this.selectedSet);
  }
}

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

    this.registerFunctions(
      "add-selection",
      (d: RenderRow) => {
        this.App.emit("add-selection", d);
      },
      this
    );

    this.registerFunctions(
      "add-selection",
      (d: RenderRow) => {
        this.App.emit("remove-selection", d);
      },
      this,
      false
    );
  }
}

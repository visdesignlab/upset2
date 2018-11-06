import { RenderRow } from "./../type_declarations/types";
import { ViewBase } from "provenance_mvvm_framework";

export class ElementView extends ViewBase {
  constructor(root: HTMLElement) {
    super(root);
  }

  update(data: RenderRow[]) {
    console.log(data);
  }
}

import { ViewBase } from "provenance_mvvm_framework";
import * as d3 from "d3";
import { IDataSetInfo } from "../Data";

export class VennDiagramView extends ViewBase {
  radius: number;
  constructor(root: HTMLElement, radius: number) {
    super(root);
    this.radius = radius;
  }

  create() {}

  update() {}
}

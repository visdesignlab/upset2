/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:38:37 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 14:38:37 
 */
import { ViewBase } from "provenance_mvvm_framework";
import * as d3 from "d3";

export class VennDiagramView extends ViewBase {
  radius: number;
  constructor(root: HTMLElement, radius: number) {
    super(root);
    this.radius = radius;
  }

  create() {}

  update() {}
}

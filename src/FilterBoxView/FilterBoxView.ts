/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:32 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 14:36:32 
 */
import * as d3 from "d3";
import { ViewBase } from "provenance_mvvm_framework";
import html from "./filterbox.view.html";

export class FilterBoxView extends ViewBase {
  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    d3.select(this.Root).html(html);
  }

  update() {}
}

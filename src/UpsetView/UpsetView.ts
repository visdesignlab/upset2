import { Data } from "./../DataStructure/Data";
/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:32 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-08 15:27:48
 */
import * as d3 from "d3";
import { ViewBase } from "provenance_mvvm_framework";
import html from "./upset.view.html";

export class UpsetView extends ViewBase {
  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    d3.select(this.Root).html(html);
    this.createHeaderVis();
  }
  createHeaderVis() {
    d3.select("#header-vis").append("svg");
  }

  update(data: Data) {
    console.log(data);
  }
}

/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:32 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-11 17:28:26
 */

import * as d3 from "d3";
import { Set } from "./../DataStructure/Set";
import { Data } from "./../DataStructure/Data";
import { ViewBase } from "provenance_mvvm_framework";
import html from "./upset.view.html";
import params from "./ui_params";
export class UpsetView extends ViewBase {
  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    d3.select(this.Root).html(html);
  }

  update(data: Data) {
    console.log(data);
  }
}

function setSizeScale(data: Set[], size: number): number {
  let scale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d: Set) => {
        return d.setSize;
      })
    ])
    .nice()
    .range([0, this.usedSetHeight]);
  return scale(size);
}

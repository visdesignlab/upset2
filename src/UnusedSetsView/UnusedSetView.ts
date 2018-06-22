import { Set } from "./../DataStructure/Set";
import { d3Selection } from "./../type_declarations/types";
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:24
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-05 18:26:24
 */
import * as d3 from "d3";
import { ViewBase } from "provenance_mvvm_framework";
import { Data } from "./../DataStructure/Data";
import { d3Selection } from "./../type_declarations/types";
import html from "./unusedset.view.html";
export class UnusedSetView extends ViewBase {
  headerVis: d3Selection;
  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    this.headerVis = d3.select(this.Root);

    let view = this.headerVis.append("div").attr("class", "unused-set-view");

    view.html(html);
  }

  update(data: Data) {
    let dropDown = this.headerVis
      .select(".unused-set-view")
      .select("#unsed-set-dropdown");

    let options = this.headerVis
      .select(".unused-set-view")
      .select("#unused-set-options");

    this.updateDropdownOptions(options, data.unusedSets);
  }

  updateDropdownOptions(opt: d3Selection, data: Set[]) {
    let options = opt.selectAll(".dropdown-item").data(data);
    options.exit().remove();

    options
      .enter()
      .append("div")
      .merge(options)
      .attr("class", "dropdown-item")
      .text((d, i) => {
        return d.elementName;
      });
  }
}

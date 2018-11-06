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
import { Set } from "./../DataStructure/Set";
import html from "./unusedset.view.html";
import params from "../UpsetView/ui_params";
export class UnusedSetView extends ViewBase {
  headerVis: d3Selection;
  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    this.headerVis = d3.select(this.Root);

    let view = this.headerVis.append("div").attr("class", "unused-set-view");

    view.classed("position", true);

    this.comm.on("update-position", () => {
      view.style("left", `${params.combinations_width}px`);
    });

    view.html(view.html() + html);
  }

  update(data: Data) {
    let dropDown = this.headerVis
      .select(".unused-set-view")
      .select("#unsed-set-dropdown");

    let options = this.headerVis
      .select(".unused-set-view")
      .select("#unused-set-options");

    this.updateDropdownOptions(options, data.unusedSets);

    if (data.unusedSets.length < 1) {
      dropDown.style("display", "none");
    } else {
      dropDown.style("display", "block");
    }
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
      })
      .on("click", (d, i) => {
        this.comm.emit("add-set-trigger", d);
      });
  }
}

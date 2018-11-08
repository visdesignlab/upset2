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
import { Attribute } from "./../DataStructure/Attribute";
import params from "../UpsetView/ui_params";
import { excludeSets } from "../UpsetView/uiBuilderFunctions";

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

    if (data.unusedSets.length < 1) {
      dropDown.style("display", "none");
    } else {
      dropDown.style("display", "block");
      this.updateDropdownOptions(options, data.unusedSets);
    }

    let attrDropdown = this.headerVis
      .select(".unused-set-view")
      .select("#unused-attribute-dropdown");

    let attrOptions = this.headerVis
      .select(".unused-set-view")
      .select("#unused-attribute-options");

    let unselectedAttributes = data.attributes
      .filter(d => excludeSets.indexOf(d.name) < 0)
      .filter(
        d => data.selectedAttributes.map(_ => _.name).indexOf(d.name) < 0
      );
    if (unselectedAttributes.length < 1) {
      attrDropdown.style("display", "none");
    } else {
      attrDropdown.style("display", "block");
      this.updateAttributeDropdownOptions(attrOptions, unselectedAttributes);
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

  updateAttributeDropdownOptions(opt: d3Selection, data: Attribute[]) {
    let options = opt.selectAll(".dropdown-item").data(data);
    options.exit().remove();
    options
      .enter()
      .append("div")
      .merge(options)
      .classed("dropdown-item", true)
      .text(d => d.name)
      .on("click", d => {
        this.comm.emit("add-attribute-trigger", d);
      });
  }
}

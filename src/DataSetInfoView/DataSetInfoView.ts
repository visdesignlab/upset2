/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:24 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 14:36:24 
 */
import { ViewBase } from "provenance_mvvm_framework";
import * as d3 from "d3";
import { IDataSetInfo } from "../Data";

export class DataSetInfoView extends ViewBase {
  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    d3
      .select("#dataset-info-box")
      .style("padding", "5px")
      .append("div")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("background-color", "rgba(0,0,0,0.7)")
      .style("color", "#FFF")
      .style("overflow-wrap", "break-word");
  }

  update(data: IDataSetInfo) {
    let box = d3.select("#dataset-info-box").select("div");
    box.html("");
    box
      .append("div")
      .text("Dataset Information")
      .style("font-weight", "bold");
    box
      .append("div")
      .append("span")
      .text("Name: ")
      .style("font-weight", "bold")
      .select(function() {
        return (<any>this).parentNode;
      })
      .append("span")
      .text(`${data.Name}`);

    box
      .append("div")
      .append("span")
      .text("# Sets: ")
      .style("font-weight", "bold")
      .select(function() {
        return (<any>this).parentNode;
      })
      .append("span")
      .text(`${data.SetCount}`);

    box
      .append("div")
      .append("span")
      .text("# Attributes: ")
      .style("font-weight", "bold")
      .select(function() {
        return (<any>this).parentNode;
      })
      .append("span")
      .text(`${data.AttributeCount}`);

    box
      .append("div")
      .append("span")
      .text("Author: ")
      .style("font-weight", "bold")
      .select(function() {
        return (<any>this).parentNode;
      })
      .append("span")
      .text(`${data._data.author}`);

    box
      .append("div")
      .append("span")
      .text("Description: ")
      .style("font-weight", "bold")
      .select(function() {
        return (<any>this).parentNode;
      })
      .append("span")
      .text(`${data._data.description}`);

    box
      .append("div")
      .append("span")
      .text("Source: ")
      .style("font-weight", "bold")
      .select(function() {
        return (<any>this).parentNode;
      })
      .append("a")
      .attr("href", data._data.source)
      .text(`${data._data.source}`);
  }
}

import { IDataSetInfo } from "./../DataStructure/IDataSetInfo";
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:38:29
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-08 12:00:29
 */
import * as d3 from "d3";
import { ViewBase } from "provenance_mvvm_framework";
import { IDataSetInfo } from "./../DataStructure/IDataSetInfo";
import template from "./navbar.view.html";
import { RenderConfig } from "../DataStructure/AggregateAndFilters";

export class NavBarView extends ViewBase {
  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    d3.select(this.Root).html(template);
    this.comm.on("change-dataset", this.setDSS);
  }

  update(datasets: any[]) {
    let datasets_options = d3
      .select(this.Root)
      .select("#dropdown-item-container")
      .selectAll("a")
      .data(datasets)
      .enter()
      .append("a")
      .text((d: any, i: number) => {
        return `${d.Name} (${d.SetCount} sets, ${d.AttributeCount} attributes)`;
      })
      .attr("class", "dropdown-item")
      .on("click", (d: any) => {
        this.comm.emit("change-dataset", d);
      });

    let rc: RenderConfig = null;
    let d: IDataSetInfo = null;
    if (sessionStorage["render_config"]) {
      rc = JSON.parse(sessionStorage["render_config"]);
    }
    if (rc) {
      d = rc.currentFile;
    }

    if (!d) {
      d = datasets_options
        .filter((d, i) => {
          return i == 0;
        })
        .data()[0];
    }
    if (d) {
      this.comm.emit("change-dataset", d);
    }
  }

  setDSS(data: IDataSetInfo) {
    d3.select("#data-dropdown-btn").text(
      `${data.Name} (${data.SetCount} sets, ${data.AttributeCount} attributes)`
    );
  }
}

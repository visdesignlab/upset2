import { ViewBase } from "provenance_mvvm_framework";
import * as d3 from "d3";
import { IDataSetInfo } from "../Data";

export class NavBarView extends ViewBase {
  constructor(root: HTMLElement) {
    super(root);
  }

  create() {
    this.DataContext.on("change-dataset", this.setDSS);
  }

  update() {
    let temp = this.DataContext.datasets;
    let datasets_options = d3
      .select(this.Root)
      .select("#dropdown-item-container")
      .selectAll("a")
      .data(this.DataContext.datasets)
      .enter()
      .append("a")
      .text((d: any, i: number) => {
        return `${d.Name} (${d.SetCount} sets, ${d.AttributeCount} attributes)`;
      })
      .attr("class", "dropdown-item")
      .on("click", (d: any) => {
        this.DataContext.emit("change-dataset", d);
      });

    let d: any = datasets_options
      .filter((d, i) => {
        return i == 0;
      })
      .data()[0];
    if (d) {
      this.DataContext.emit("change-dataset", d);
    }
  }

  setDSS(event: any, data: IDataSetInfo) {
    d3
      .select("#data-dropdown-btn")
      .text(
        `${data.Name} (${data.SetCount} sets, ${
          data.AttributeCount
        } attributes)`
      );
  }
}

import { Data } from "./../DataStructure/Data";
/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:38:25 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-09 16:19:53
 */
import * as d3 from "d3";
import { Application } from "provenance_mvvm_framework";
import { ViewModelBase } from "provenance_mvvm_framework";
import { UpsetView } from "./UpsetView";
export class UpsetViewModel extends ViewModelBase {
  constructor(view: UpsetView, app: Application) {
    super(view, app);
    this.App.on("render-rows-changed", this.update, this);
    this.comm.on("set-filter", idx => {
      this.App.emit("filter-changed", null, idx);
    });
  }

  update(data: Data) {
    this.comm.emit("update", data);
  }
}

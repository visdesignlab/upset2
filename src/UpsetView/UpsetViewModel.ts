import { Data } from "./../DataStructure/Data";
/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:38:25 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-09 14:31:24
 */
import * as d3 from "d3";
import { Application } from "provenance_mvvm_framework";
import { ViewModelBase } from "provenance_mvvm_framework";
import { UpsetView } from "./UpsetView";

export class UpsetViewModel extends ViewModelBase {
  constructor(view: UpsetView, app: Application) {
    super(view, app);
    this.View.create();
    this.App.on("data-loaded", this.update);
  }

  update(data: any) {
    console.log("Testing", data);
  }
}

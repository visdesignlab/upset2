import { Application } from "provenance_mvvm_framework";
/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:38:25 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-15 16:31:10
 */
import {
  ViewModelBase,
  IProvenanceGraph,
  IActionFunctionRegistry
} from "provenance_mvvm_framework";
import { FilterBoxView } from "./FilterBoxView";
import "./styles.scss";
import { RenderConfig } from "../DataStructure/AggregateAndFilters";
export class FilterBoxViewModel extends ViewModelBase {
  config: RenderConfig;
  constructor(view: FilterBoxView, app: Application) {
    super(view, app);
    this.comm.on("filter-changed", (config: RenderConfig) => {
      this.App.emit("filter-changed", config, null);
    });
    this.App.on("set-agg-none", () => {
      this.comm.emit("set-agg-none");
    });
  }
}

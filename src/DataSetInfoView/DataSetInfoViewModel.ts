/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:29 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-03 14:42:17
 */
import {
  ViewModelBase,
  IProvenanceGraph,
  IActionFunctionRegistry
} from "provenance_mvvm_framework";
import { DataSetInfoView } from "./DataSetInfoView";
import { IDataSetInfo, IDataSetJSON } from "../Data";
import { Data } from "../Data";

export class DataSetInfoViewModel extends ViewModelBase {
  public datasets: IDataSetInfo[] = [];
  constructor(
    view: DataSetInfoView,
    graph: IProvenanceGraph,
    registry: IActionFunctionRegistry
  ) {
    super(view, graph, registry);
    this.View.create();
    Data.mitt.on("change-dataset", this.View.update);
  }
}

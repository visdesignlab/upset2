/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:29
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-03 14:42:17
 */
import {
  IActionFunctionRegistry,
  IProvenanceGraph,
  ViewModelBase
} from "provenance_mvvm_framework";
import { DataUtils } from "./../DataStructure/DataUtils";
import { IDataSetInfo } from "./../DataStructure/IDataSetInfo";
import { DataSetInfoView } from "./DataSetInfoView";

export class DataSetInfoViewModel extends ViewModelBase {
  public datasets: IDataSetInfo[] = [];
  constructor(
    view: DataSetInfoView,
    graph: IProvenanceGraph,
    registry: IActionFunctionRegistry
  ) {
    super(view, graph, registry);
    this.View.create();
    DataUtils.mitt.on("change-dataset", this.View.update);
  }
}

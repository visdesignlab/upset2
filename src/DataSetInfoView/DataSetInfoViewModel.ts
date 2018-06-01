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
    Data.on("change-dataset", this.View.update);
    console.log(this._uuid);
  }
}

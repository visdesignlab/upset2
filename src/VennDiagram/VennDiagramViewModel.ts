import {
  ViewModelBase,
  IProvenanceGraph,
  IActionFunctionRegistry
} from "provenance_mvvm_framework";
import { VennDiagramView } from "./VennDiagramView";
import { IDataSetInfo, IDataSetJSON } from "../Data";
import { Data } from "../Data";
import { Handler } from "../../../provenance_mvvm_framework/dist/types/Provenance/Handler";

export class VennDiagramViewModel extends ViewModelBase {
  constructor(
    view: VennDiagramView,
    graph: IProvenanceGraph,
    registry: IActionFunctionRegistry
  ) {
    super(view, graph, registry);
    this.View.create();
  }
}

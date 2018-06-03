/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:38:41 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 14:38:41 
 */
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

import * as d3 from "d3";
import {
  ViewModelBase,
  IProvenanceGraph,
  IActionFunctionRegistry
} from "provenance_mvvm_framework";
import { FilterBoxView } from "./FilterBoxView";

export class FilterBoxViewModel extends ViewModelBase {
  constructor(
    view: FilterBoxView,
    graph: IProvenanceGraph,
    registry: IActionFunctionRegistry
  ) {
    super(view, graph, registry);

    this.View.create();
  }
}

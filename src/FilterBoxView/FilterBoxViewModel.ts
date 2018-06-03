/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:38:25 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 14:38:25 
 */
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

import { Application } from "provenance_mvvm_framework";
/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:38:25 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-05 15:59:46
 */
import * as d3 from "d3";
import {
  ViewModelBase,
  IProvenanceGraph,
  IActionFunctionRegistry
} from "provenance_mvvm_framework";
import { FilterBoxView } from "./FilterBoxView";

export class FilterBoxViewModel extends ViewModelBase {
  constructor(view: FilterBoxView, app: Application) {
    super(view, app);
  }
}

/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:29
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-08 15:33:52
 */
import {
  IActionFunctionRegistry,
  IProvenanceGraph,
  ViewModelBase
} from "provenance_mvvm_framework";
import { DataUtils } from "./../DataStructure/DataUtils";
import { UnusedSetInfoView } from "./UnusedSetView";
import { IDataSetInfo } from "./../DataStructure/IDataSetInfo";
import { Application } from "provenance_mvvm_framework";

export class UnusedSetInfoViewModel extends ViewModelBase {
  public datasets: IDataSetInfo[] = [];
  constructor(view: UnusedSetInfoView, app: Application) {
    super(view, app);
  }

  update(dataset: IDataSetInfo) {}
}

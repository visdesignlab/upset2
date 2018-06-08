import { Application } from "provenance_mvvm_framework";
/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-08 11:25:12 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-08 14:37:16
 */

import { NavBarViewModel } from "./../NavBarView/NavBarViewModel";
import { FilterBoxViewModel } from "./../FilterBoxView/FilterBoxViewModel";
import { DataSetInfoViewModel } from "./../DataSetInfoView/DataSetInfoViewModel";
import { DataSetInfoView } from "../DataSetInfoView/DataSetInfoView";
import { FilterBoxView } from "../FilterBoxView/FilterBoxView";
import { NavBarView } from "../NavBarView/NavBarView";
import { IViewModel, IView } from "provenance_mvvm_framework";

export class ViewFactory {
  views: { [key: string]: IViewModel } = {};
}

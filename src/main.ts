import { DataUtils } from "./DataStructure/DataUtils";
/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:08 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-05 16:01:19
 */

import * as d3 from "d3";
import { Application } from "provenance_mvvm_framework";
import { DataSetInfoView } from "./DataSetInfoView/DataSetInfoView";
import { DataSetInfoViewModel } from "./DataSetInfoView/DataSetInfoViewModel";
import { FilterBoxView } from "./FilterBoxView/FilterBoxView";
import { FilterBoxViewModel } from "./FilterBoxView/FilterBoxViewModel";
import { NavBarView } from "./NavBarView/NavBarView";
import { NavBarViewModel } from "./NavBarView/NavBarViewModel";
import { Data } from "./DataStructure/Data";

let application = new Application("Upset2.0", "1.0.0");
DataUtils.app = application;

let navbar = new NavBarViewModel(
  new NavBarView(<HTMLElement>d3.select("#top-bar").node()),
  application
);

let datasetinfo = new DataSetInfoViewModel(
  new DataSetInfoView(<HTMLElement>d3.select("#dataset-info-box").node()),
  application
);

let filterBox = new FilterBoxViewModel(
  new FilterBoxView(<HTMLElement>d3.select("#filter-box").node()),
  application
);

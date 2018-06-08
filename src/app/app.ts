/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:08 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-08 10:24:49
 */

import * as d3 from "d3";
import { Application } from "provenance_mvvm_framework";
import { DataSetInfoView } from "../DataSetInfoView/DataSetInfoView";
import { DataSetInfoViewModel } from "../DataSetInfoView/DataSetInfoViewModel";
import { FilterBoxView } from "../FilterBoxView/FilterBoxView";
import { DataUtils } from "../DataStructure/DataUtils";
import { FilterBoxViewModel } from "../FilterBoxView/FilterBoxViewModel";
import { NavBarView } from "../NavBarView/NavBarView";
import { NavBarViewModel } from "../NavBarView/NavBarViewModel";

// Importing goldenlayout
import { GoldenLayout } from "golden-layout/dist/goldenlayout";
import "golden-layout/src/css/goldenlayout-base.css";
import "./goldenlayout-theme.less";
// Importing styles
import "popper.js";
import "bootstrap";
import "./styles.scss";

let application = new Application("Upset2.0", "1.0.0");
DataUtils.app = application;
DataUtils.app.on("change-dataset", DataUtils.processDataSet);

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

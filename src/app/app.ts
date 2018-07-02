import { UnusedSetViewModel } from "./../UnusedSetsView/UnusedSetViewModel";
import { UpsetViewModel } from "./../UpsetView/UpsetViewModel";
/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:08 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-08 15:32:54
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
import { ViewFactory } from "./ViewFactory";

// Importing styles
import "popper.js";
import "bootstrap";
import "./styles.scss";
import { UpsetView } from "../UpsetView/UpsetView";
import { UnusedSetView } from "../UnusedSetsView/UnusedSetView";

let application = new Application("Upset2.0", "1.0.0");
DataUtils.app = application;
DataUtils.app.on("change-dataset", DataUtils.processDataSet);

let vf = new ViewFactory();

vf.views["FilterBox"] = new FilterBoxViewModel(
  new FilterBoxView(d3.select("#filter-box").node() as HTMLElement),
  application
);

vf.views["DataSetInfo"] = new DataSetInfoViewModel(
  new DataSetInfoView(d3.select("#dataset-info-box").node() as HTMLElement),
  application
);

vf.views["NavBar"] = new NavBarViewModel(
  new NavBarView(d3.select("#navigation-bar").node() as HTMLElement),
  application
);

vf.views["Upset"] = new UnusedSetViewModel(
  new UnusedSetView(d3.select("#mid-bar").node() as HTMLElement),
  application
);

vf.views["Upset"] = new UpsetViewModel(
  new UpsetView(d3.select("#mid-bar").node() as HTMLElement),
  application
);

(window as any).graph = application.graph;

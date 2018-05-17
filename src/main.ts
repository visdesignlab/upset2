import { NavBarViewModel } from "./NavBarView/NavBarViewModel";
import { NavBarView } from "./NavBarView/NavBarView";
import * as d3 from "d3";
import { DataSetInfoViewModel } from "./DataSetInfoView/DataSetInfoViewModel";
import { DataSetInfoView } from "./DataSetInfoView/DataSetInfoView";

let navbar = new NavBarViewModel(
  new NavBarView(<HTMLElement>d3.select("#top-bar").node())
);
let datasetinfo = new DataSetInfoViewModel(
  new DataSetInfoView(<HTMLElement>d3.select("#dataset-info-box").node())
);

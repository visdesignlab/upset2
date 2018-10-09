/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:08 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-10-09 14:21:47
 */
import * as d3 from "d3";
import "popper.js";
import { Application } from "provenance_mvvm_framework";
import { DataSetInfoView } from "../DataSetInfoView/DataSetInfoView";
import { DataSetInfoViewModel } from "../DataSetInfoView/DataSetInfoViewModel";
import { DataUtils } from "../DataStructure/DataUtils";
import { EmbedGenView } from "../EmbedGenView/EmbedGenView";
import { FilterBoxView } from "../FilterBoxView/FilterBoxView";
import { FilterBoxViewModel } from "../FilterBoxView/FilterBoxViewModel";
import { NavBarView } from "../NavBarView/NavBarView";
import { NavBarViewModel } from "../NavBarView/NavBarViewModel";
import { ProvenanceView } from "../ProvenanceView/ProvenanceView";
import { ProvenanceViewModel } from "../ProvenanceView/ProvenanceViewModel";
import { UnusedSetView } from "../UnusedSetsView/UnusedSetView";
import { UpsetView } from "../UpsetView/UpsetView";
import { EmbedConfig } from "./../DataStructure/EmbedConfig";
import { d3Selection } from "./../type_declarations/types";
import { UnusedSetViewModel } from "./../UnusedSetsView/UnusedSetViewModel";
import { UpsetViewModel } from "./../UpsetView/UpsetViewModel";
import "./styles.scss";
import { ViewFactory } from "./ViewFactory";

function run() {
  let application = new Application("Upset2.0", "1.0.0");
  DataUtils.app = application;
  DataUtils.app.on("change-dataset", DataUtils.processDataSet);

  if (sessionStorage["provenance-graph"]) {
    application.graph = JSON.parse(sessionStorage["provenance-graph"]);
    application.registry = JSON.parse(sessionStorage["provenance-registry"]);
  }

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
    application,
    "/data/datasets.json"
  );

  vf.views["Upset"] = new UnusedSetViewModel(
    new UnusedSetView(d3.select("#mid-bar").node() as HTMLElement),
    application
  );

  vf.views["Provenance"] = new ProvenanceViewModel(
    new ProvenanceView(d3.select(".provenance-view").node() as HTMLElement),
    application
  );

  let isIFrame = window.self !== window.top;

  let ec: EmbedConfig = null;

  if (!isIFrame) {
    EmbedGenView(d3.select("#embed-modal"));
  } else {
    ec = renderIFrame();
  }

  vf.views["Upset"] = new UpsetViewModel(
    new UpsetView(d3.select("#mid-bar").node() as HTMLElement, ec),
    application
  );
}

run();

function renderIFrame(): EmbedConfig {
  let iframe = d3.select(window.frameElement);
  console.log(window.frameElement);
  let iframeNode = window.frameElement as any;
  let body = d3.select(
    (iframeNode.contentWindow || iframeNode.contentDocument).document.body
  );
  let ec = getEmbedConfig(iframe);

  if (!ec.NavBar) d3.select("#navigation-bar").style("display", "none");
  if (!ec.FilterBox) d3.select("#filter-box").style("display", "none");
  if (!ec.DataSetInfo) d3.select("#dataset-info-box").style("display", "none");
  if (!ec.LeftSideBar) d3.select("#left-side-bar").style("display", "none");
  if (!ec.RightSideBar) d3.select("#right-side-bar").style("display", "none");
  if (!ec.ProvenanceView)
    d3.select(".provenance-view").style("display", "none");

  return ec;
}

function getEmbedConfig(iframe: d3Selection): EmbedConfig {
  return JSON.parse(iframe.attr("data"));
}

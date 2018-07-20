import { d3Selection } from "./../type_declarations/types";
/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:08 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-19 17:51:33
 */
import { EmbedGenView } from "../EmbedGenView/EmbedGenView";
import { EmbedConfig, ConfigType } from "./../DataStructure/EmbedConfig";
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
import { UnusedSetViewModel } from "./../UnusedSetsView/UnusedSetViewModel";
import { UpsetViewModel } from "./../UpsetView/UpsetViewModel";
import { UpsetView } from "../UpsetView/UpsetView";
import { UnusedSetView } from "../UnusedSetsView/UnusedSetView";
import { ProvenanceViewModel } from "../ProvenanceView/ProvenanceViewModel";
import { ProvenanceView } from "../ProvenanceView/ProvenanceView";

// Importing styles
import "popper.js";
import "bootstrap";
import "./styles.scss";

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
    "../../data/datasets.json"
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

  if (!isIFrame) {
    EmbedGenView(d3.select("#embed-modal"));
  } else {
    renderIFrame();
  }

  vf.views["Upset"] = new UpsetViewModel(
    new UpsetView(d3.select("#mid-bar").node() as HTMLElement),
    application
  );
}

run();

function renderIFrame() {
  let iframe = d3.select(window.frameElement);
  let iframeNode = window.frameElement as any;
  let body = d3.select(
    (iframeNode.contentWindow || iframeNode.contentDocument).document.body
  );
  let ec = new EmbedConfig();
}

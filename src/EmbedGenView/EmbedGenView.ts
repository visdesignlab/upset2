import { EmbedConfig } from "./../DataStructure/EmbedConfig";
import { d3Selection } from "./../type_declarations/types";
import html from "./embedgen.view.html";
import * as d3 from "d3";
import "./styles.scss";

export function EmbedGenView(base: d3Selection) {
  base.html(base.html() + html);
  addShowCloseEvents(base);
  addInsertIFrameEvent(base);
  readCheckBoxEvents(base);
  addCheckboxEvents(base);
}

function addShowCloseEvents(base: d3Selection) {
  base.select(".delete").on("click", () => {
    base.select(".modal").classed("is-active", false);
  });
  base.select(".show").on("click", () => {
    base.select(".modal").classed("is-active", true);
  });
  base.select(".modal-background").on("click", () => {
    base.select(".modal").classed("is-active", false);
  });
}

function addInsertIFrameEvent(base: d3Selection) {
  base.select(".copy-button").on("click", () => {
    let i = d3
      .select(".embeded-view")
      .selectAll("iframe")
      .data([1]);
    i.exit().remove();
    i.enter()
      .append("iframe")
      .merge(i)
      .attr("height", 500)
      .attr("width", 1000)
      .attr("data", () => {
        return JSON.stringify(EmbedConfig.getConfig());
      })
      .attr("class", "upset")
      .attr(
        "src",
        `https://vdl.sci.utah.edu/upset2/embed.html#${JSON.stringify(
          EmbedConfig.getConfig()
        )}`
      );

    let _i = d3.select(".embeded-view");
    base.select(".code").property("value", _i.html());
    (base.select(".code").node() as any).select();
    document.execCommand("copy");
    _i.html("");
  });
}

function addCheckboxEvents(base: d3Selection) {
  base.select(".filter-box").on("change", function() {
    let ec = EmbedConfig.getConfig();
    ec.FilterBox = d3.select(this).property("checked");
    EmbedConfig.setConfig(ec);
  });
  base.select(".dataset-info-box").on("change", function() {
    let ec = EmbedConfig.getConfig();
    ec.DataSetInfo = d3.select(this).property("checked");
    EmbedConfig.setConfig(ec);
  });
  base.select(".provenance-view").on("change", function() {
    let ec = EmbedConfig.getConfig();
    ec.ProvenanceView = d3.select(this).property("checked");
    EmbedConfig.setConfig(ec);
  });
  base.select(".deviation-bar").on("change", function() {
    let ec = EmbedConfig.getConfig();
    ec.DeviationBars = d3.select(this).property("checked");
    EmbedConfig.setConfig(ec);
  });
  base.select(".cardinality-bar").on("change", function() {
    let ec = EmbedConfig.getConfig();
    ec.CardinalityBars = d3.select(this).property("checked");
    EmbedConfig.setConfig(ec);
  });
}

function readCheckBoxEvents(base: d3Selection) {
  let ec = EmbedConfig.getConfig();
  ec.FilterBox = base.select(".filter-box").property("checked");
  ec.DataSetInfo = base.select(".dataset-info-box").property("checked");
  ec.ProvenanceView = base.select(".provenance-view").property("checked");
  ec.DeviationBars = base.select(".deviation-bar").property("checked");
  ec.CardinalityBars = base.select(".cardinality-bar").property("checked");
  EmbedConfig.setConfig(ec);
}

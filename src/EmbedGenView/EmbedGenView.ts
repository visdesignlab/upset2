import { d3Selection } from "./../type_declarations/types";
import html from "./embedgen.view.html";
import * as d3 from "d3";
import "./styles.scss";

export function EmbedGenView(base: d3Selection) {
  base.html(base.html() + html);
  addShowCloseEvents(base);
  addInsertIFrameEvent(base);
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
    d3.select(".embeded-view")
      .append("iframe")
      .attr("class", "upset")
      .attr("src", "/embed.html");
  });
  // d3.select(".embeded-view")
  //   .append("iframe")
  //   .attr("class", "upset")
  //   .attr("src", "http://localhost:8010/embed.html");
}

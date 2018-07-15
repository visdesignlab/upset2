import { d3Selection } from "./../type_declarations/types";
import * as d3 from "d3";
import html from "./embedgen.view.html";
import "./styles.scss";

export function EmbedGenView(base: d3Selection) {
  let embedBox = d3.select(".embeded-view").append("iframe");
  embedBox.attr("width", "100%").attr("height", "800px");
  base.html(base.html() + html);
  addShowCloseEvents(base);
  addInsertIFrameEvent(base, embedBox);
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

function addInsertIFrameEvent(base: d3Selection, iframe: d3Selection) {
  base.select(".copy-button").on("click", () => {});
}

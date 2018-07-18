import { d3Selection } from "./../type_declarations/types";
import * as d3 from "d3";
import html from "./embedgen.view.html";
import template from "./embed.template.view.html";
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
    let h = buildEmbedHtml();
    base.select(".code").property("value", h);
    d3.event.clipboardData.setData(
      "text/plain",
      base.select(".code").property("value")
    );
  });
}

function buildEmbedHtml() {
  let tempDiv = d3.select("body").append("div");
  let curr_css = d3.select("head").selectAll("link");
  let curr_js = d3.select("body").selectAll("script");

  let css_links: string[] = [];
  let js_links: string[] = [];

  curr_css.each(function() {
    css_links.push(
      `<link href="${d3.select(this).attr("href")}" rel="stylesheet">`
    );
  });

  curr_js.each(function() {
    js_links.push(
      `<script src="${d3
        .select(this)
        .attr("src")}" text="text/javascript"></script>`
    );
  });

  let htmlStr = "".concat(...css_links);

  htmlStr = htmlStr.concat(template);

  htmlStr = htmlStr.concat(...js_links);

  return `<div>
  ${htmlStr}
  </div>`;
}

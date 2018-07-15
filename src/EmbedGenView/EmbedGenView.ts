import { d3Selection } from "./../type_declarations/types";
import html from "./embedgen.view.html";
export function EmbedGenView(base: d3Selection) {
  base.html(base.html() + html);

  addShowCloseEvents(base);
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

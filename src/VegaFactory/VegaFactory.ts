import { Attribute } from "./../DataStructure/Attribute";
import { Spec, Data } from "vega";
import { d3Selection } from "../type_declarations/types";
import * as vegaEmbed from "vega-embed";
import * as vega from "vega";

export function CreateVegaVis(spec: any, el: d3Selection) {
  setTimeout(() => {
    vegaEmbed.default(el.node() as any, spec as any, {
      mode: "vega-lite",
      hover: false,
      renderer: "svg",
      runAsync: true,
      logLevel: vega.None,
      actions: false
    });
  }, 0);
}

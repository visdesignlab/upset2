import { d3Selection } from "./../type_declarations/types";
import { DatasetInfo } from "./../DataTypes/DatasetInfo";
import { Container } from "golden-layout";
import { View } from "./../DataTypes/View";
import config from "./layout_config";
import GoldenLayout from "golden-layout/dist/goldenlayout";
import "golden-layout/src/css/goldenlayout-base.css";
import "./styles.scss";
import { FileView } from "../FileView/FileView";
import { mitt, Mitt } from "../Utils/PubSub";
import * as vegaLite from "vega-lite";
import * as vega from "vega";
import { Renderer } from "vega";

export const pubsub: Mitt = mitt();

export const serverUrl: string =
  "https://us-central1-upset2-eaf80.cloudfunctions.net/api";

let views: View[] = [
  {
    componentName: "FileView",
    componentState: {},
    type: "component",
    factory: FileView,
  },
  {
    componentName: "DatasetInfo",
    componentState: {},
    type: "component",
    factory: function(c: any, s: any) {},
  },
];

export let closer: (name: string) => void | null = null;

export function CreateFileUploadView(
  root?: d3Selection,
  closeFunction: (name: string) => void | null = null
) {
  let layout: any;
  closer = closeFunction;
  if (root) layout = new GoldenLayout(config, root.node());
  else layout = new GoldenLayout(config);
  views.forEach((view) => {
    layout.registerComponent(view.componentName, view.factory);
  });

  layout.init();
}

// CreateFileUploadView();

// function test() {
//   vega
//     .loader()
//     .load("https://vega.github.io/vega/examples/bar-chart.vg.json")
//     .then(data => {
//       renderer(JSON.parse(data));
//     });

//   function renderer(data: any) {
//     let view = new vega.View(vega.parse(data))
//       .renderer("svg")
//       .initialize(".table-view")
//       .hover()
//       .run();

//     view.toImageURL("png").then(url => console.log(url));
//   }
// }

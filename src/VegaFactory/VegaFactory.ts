import { Attribute } from "./../DataStructure/Attribute";
import { Spec, Data } from "vega";
import { d3Selection } from "../type_declarations/types";
import * as vega from "vega";

export enum VisType {
  BoxPlot
}

export function CreateVegaVis(data: Attribute, type: VisType, el: d3Selection) {
  let spec: Spec = createSpec(data, type);
  let view = new vega.View(spec);
  view
    .renderer("svg")
    .initialize(el.node() as any)
    .run();
}

function createSpec(data: Attribute, type: VisType): Spec {
  let spec: Spec = {
    $schema: "https://vega.github.io/schema/vega/v4.json",
    width: 500,
    padding: 5,

    config: {
      axisBand: {
        bandPosition: 1,
        tickExtra: true,
        tickOffset: 0
      }
    },

    signals: [
      {
        name: "fields",
        value: ["data"]
      },
      { name: "plotWidth", value: 60 },
      { name: "height", update: "(plotWidth + 10) * length(fields)" }
    ],
    data: parseDataForBoxPlot(data),

    scales: [
      {
        name: "layout",
        type: "band",
        range: "height",
        domain: { data: data.name, field: "organ" }
      },
      {
        name: "xscale",
        type: "linear",
        range: "width",
        round: true,
        domain: { data: data.name, field: "value" },
        zero: true,
        nice: true
      }
    ],

    axes: [
      { orient: "bottom", scale: "xscale", zindex: 1 },
      { orient: "left", scale: "layout", tickCount: 5, zindex: 1 }
    ],

    marks: [
      {
        type: "group",
        from: {
          facet: {
            data: "iris",
            name: "organs",
            groupby: "organ"
          }
        },

        encode: {
          enter: {
            yc: { scale: "layout", field: "organ", band: 0.5 },
            height: { signal: "plotWidth" },
            width: { signal: "width" }
          }
        },

        data: [
          {
            name: "summary",
            source: "organs",
            transform: [
              {
                type: "aggregate",
                fields: ["value", "value", "value", "value", "value"],
                ops: ["min", "q1", "median", "q3", "max"],
                as: ["min", "q1", "median", "q3", "max"]
              }
            ]
          }
        ],

        marks: [
          {
            type: "rect",
            from: { data: "summary" },
            encode: {
              enter: {
                fill: { value: "black" },
                height: { value: 1 }
              },
              update: {
                yc: { signal: "plotWidth / 2", offset: -0.5 },
                x: { scale: "xscale", field: "min" },
                x2: { scale: "xscale", field: "max" }
              }
            }
          },
          {
            type: "rect",
            from: { data: "summary" },
            encode: {
              enter: {
                fill: { value: "steelblue" },
                cornerRadius: { value: 4 }
              },
              update: {
                yc: { signal: "plotWidth / 2" },
                height: { signal: "plotWidth / 2" },
                x: { scale: "xscale", field: "q1" },
                x2: { scale: "xscale", field: "q3" }
              }
            }
          },
          {
            type: "rect",
            from: { data: "summary" },
            encode: {
              enter: {
                fill: { value: "aliceblue" },
                width: { value: 2 }
              },
              update: {
                yc: { signal: "plotWidth / 2" },
                height: { signal: "plotWidth / 2" },
                x: { scale: "xscale", field: "median" }
              }
            }
          }
        ]
      }
    ]
  };
  console.log(data);
  console.log(spec.data);
  return spec;
}

function parseDataForBoxPlot(data: Attribute): Data[] {
  return [
    {
      name: data.name,
      values: data.values.map(v => {
        return { data: v };
      }),
      transform: [
        {
          type: "fold",
          fields: { signal: "fields" },
          as: ["organ", "value"]
        }
      ]
    }
  ];
}

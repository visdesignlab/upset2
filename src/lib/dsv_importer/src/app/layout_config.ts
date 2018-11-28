import { Config } from "golden-layout";

const config: Config = {
  settings: {
    hasHeaders: false
  },
  content: [
    {
      type: "row",
      content: [
        {
          type: "component",
          componentName: "FileView",
          componentState: {
            label: "FileView"
          },
          width: 80
        },
        {
          type: "component",
          componentName: "DatasetInfo",
          componentState: {
            label: "DatasetInfo"
          },
          width: 20
        }
      ]
    }
  ]
};

export default config;

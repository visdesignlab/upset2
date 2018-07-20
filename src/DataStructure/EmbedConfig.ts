export class EmbedConfig {
  NavBar: ConfigType = {
    elementSelector: "#navigation-bar",
    show: "none"
  };

  FilterBox: ConfigType = {
    elementSelector: "#filter-box",
    show: "none"
  };

  DataSetInfo: ConfigType = {
    elementSelector: "#dataset-info-box",
    show: "none"
  };

  LeftSideBar: ConfigType = {
    elementSelector: "#left-side-bar",
    show: getStatus([this.FilterBox, this.DataSetInfo])
  };

  RightSideBar: ConfigType = {
    elementSelector: "#right-side-bar",
    show: getStatus([{ elementSelector: "", show: "none" }])
  };

  DeviationBars: ConfigType = {
    elementSelector: "svg .body .sets-combo-group .row .deviation-bar-group",
    show: "none"
  };
}

export type ConfigType = {
  elementSelector: string;
  show: string;
};

function getStatus(args: ConfigType[]): string {
  return args.map(arg => arg.show).indexOf("block") > -1 ? "block" : "none";
}

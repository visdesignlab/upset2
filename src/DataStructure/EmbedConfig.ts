export class EmbedConfig {
  NavBar: boolean = false;

  FilterBox: boolean = false;
  DataSetInfo: boolean = false;
  LeftSideBar: boolean = this.FilterBox || this.DataSetInfo;

  RightSideBar: boolean = false;

  ProvenanceView: boolean = false;

  DeviationBars: boolean = false;
  CardinalityBars: boolean = false;

  private static ec: EmbedConfig;

  static getConfig() {
    if (EmbedConfig.ec === undefined || EmbedConfig.ec === null)
      EmbedConfig.ec = new EmbedConfig();
    EmbedConfig.ec.LeftSideBar =
      EmbedConfig.ec.FilterBox || EmbedConfig.ec.DataSetInfo;
    return EmbedConfig.ec;
  }

  static setConfig(_ec: EmbedConfig) {
    if (_ec) EmbedConfig.ec = _ec;
  }
}

export class EmbedConfig {
  NavBar: boolean = false;

  FilterBox: boolean = false;
  DataSetInfo: boolean = false;
  LeftSideBar: boolean = this.FilterBox || this.DataSetInfo;

  RightSideBar: boolean = false;

  ProvenanceView: boolean = false;

  DeviationBars: boolean = false;
  CardinalityBars: boolean = false;
}

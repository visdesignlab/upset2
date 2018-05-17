import { ViewModelBase } from "mvvm_ts_fwork/dist";
import { DataSetInfoView } from "./DataSetInfoView";
import { IDataSetInfo, IDataSetJSON } from "../Data";
import { Data } from "../Data";

export class DataSetInfoViewModel extends ViewModelBase {
  public datasets: IDataSetInfo[] = [];
  constructor(view: DataSetInfoView) {
    super(view);
    this.View.create();
    Data.on("change-dataset", this.View.update);
  }
}

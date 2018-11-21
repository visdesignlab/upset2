import { Application, ViewModelBase } from "provenance_mvvm_framework";
import { DatasetSelectionView } from "./DatasetSelectionView";
import "./styles.scss";
export class DatasetSelectionViewModel extends ViewModelBase {
  constructor(view: DatasetSelectionView, app: Application) {
    super(view, app);
    this.App.on("open-dataset-selection", this.update, this);
    this.comm.on("change-dataset-trigger", d => {
      this.App.emit("change-dataset-trigger", d);
    });
  }

  update() {
    this.comm.emit("open-dataset-selection");
  }
}

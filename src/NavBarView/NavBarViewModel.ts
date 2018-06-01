import {
  ViewModelBase,
  IProvenanceGraph,
  IActionFunctionRegistry
} from "provenance_mvvm_framework";
import { NavBarView } from "./NavBarView";
import { IDataSetInfo, IDataSetJSON } from "../Data";
import { Data } from "../Data";
import { Handler } from "../../../provenance_mvvm_framework/dist/types/Provenance/Handler";

export class NavBarViewModel extends ViewModelBase {
  public datasets: IDataSetInfo[] = [];
  constructor(
    view: NavBarView,
    graph: IProvenanceGraph,
    registry: IActionFunctionRegistry
  ) {
    super(view, graph, registry);
    this.on("change-dataset", <Handler>Data.changeDataSet);
    this.View.create();
    this.populateDatasetSelector();
  }

  populateDatasetSelector() {
    let results: Promise<any>[] = [];
    let p = fetch("data/datasets.json")
      .then(results => results.json())
      .then(jsondata => {
        jsondata.forEach((d: string) => {
          let a = fetch(d).then(res => res.json());
          results.push(a);
        });
      })
      .then(() => {
        Promise.all(results)
          .then(d => {
            d.forEach(j => {
              let a: IDataSetJSON = Data.getDataSetJSON(j);
              this.datasets.push(Data.getDataSetInfo(a));
            });
          })
          .then(() => {
            (<NavBarView>this.View).update();
          });
      });
  }
}

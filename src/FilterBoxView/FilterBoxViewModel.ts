import * as d3 from "d3";
import { ViewModelBase } from "mvvm_ts_fwork/dist";
import { FilterBoxView } from "./FilterBoxView";

export class FilterBoxViewModel extends ViewModelBase {
  constructor(view: FilterBoxView) {
    super(view);

    this.View.create();
  }
}

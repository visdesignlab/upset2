import { Set } from "./../DataStructure/Set";
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:29
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-08 15:33:52
 */
import { ViewModelBase } from "provenance_mvvm_framework";
import { UnusedSetView } from "./UnusedSetView";
import { IDataSetInfo } from "./../DataStructure/IDataSetInfo";
import { Application } from "provenance_mvvm_framework";
import { Data } from "./../DataStructure/Data";
import "./style.scss";

export class UnusedSetViewModel extends ViewModelBase {
  public datasets: IDataSetInfo[] = [];
  constructor(view: UnusedSetView, app: Application) {
    super(view, app);
    this.App.on("render-rows-changed", this.update, this);

    this.registerFunctions(
      "add-set",
      (d: any) => {
        this.App.emit("add-set", d);
      },
      this
    );

    this.registerFunctions(
      "add-set",
      (d: any) => {
        this.App.emit("remove-set", d);
      },
      this,
      false
    );

    this.comm.on("add-set-trigger", (d: Set) => {
      let _do = {
        func: (d: any) => {
          this.App.emit("add-set", d);
        },
        args: [d]
      };
      let _undo = {
        func: (d: any) => {
          this.App.emit("remove-set", d);
        },
        args: [d]
      };
      this.apply.call(this, ["add_set", _do, _undo]);
    });
  }

  update(data: Data) {
    this.comm.emit("update", data);
  }
}

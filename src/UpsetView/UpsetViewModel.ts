/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:38:25 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-16 11:43:32
 */
import { Application } from "provenance_mvvm_framework";
import { ViewModelBase } from "provenance_mvvm_framework";
import { UpsetView } from "./UpsetView";
import { Set } from "./../DataStructure/Set";
import { Data } from "./../DataStructure/Data";
import { Attribute } from "../DataStructure/Attribute";
export class UpsetViewModel extends ViewModelBase {
  constructor(view: UpsetView, app: Application) {
    super(view, app);
    (view as any).app = app;
    this.comm.on("add-selection-trigger", (d: any) => {
      this.App.emit("add-selection-trigger", d);
    });

    this.App.on("highlight-selection", ([d, color]) => {
      this.comm.emit("highlight-selection", d, color);
    });

    this.App.on("render-rows-changed", this.update, this);

    this.comm.on("sort-by-set", (id: number) => {
      this.App.emit("sort-by-set", id);
    });

    this.comm.on("sort-by-cardinality", () => {
      this.App.emit("sort-by-cardinality");
    });

    this.comm.on("sort-by-deviation", () => {
      this.App.emit("sort-by-deviation");
    });

    this.comm.on("collapse-group", (d: any) => {
      this.App.emit("collapse-group", d);
    });

    this.registerFunctions(
      "remove-set",
      (d: any) => {
        this.App.emit("remove-set", d);
      },
      this
    );

    this.registerFunctions(
      "remove-set",
      (d: any) => {
        this.App.emit("add-set", d);
      },
      this,
      false
    );

    this.registerFunctions(
      "remove-attribute",
      (d: any) => {
        this.App.emit("remove-attribute", d);
      },
      this
    );

    this.registerFunctions(
      "remove-attribute",
      (d: any) => {
        this.App.emit("add-attribute", d);
      },
      this,
      false
    );

    this.comm.on("remove-set-trigger", (d: Set) => {
      let _do = {
        func: (d: any) => {
          this.App.emit("remove-set", d);
        },
        args: [d]
      };
      let _undo = {
        func: (d: any) => {
          this.App.emit("add-set", d);
        },
        args: [d]
      };
      this.apply.call(this, ["remove-set", _do, _undo]);
    });

    this.comm.on("remove-attribute-trigger", (d: Attribute) => {
      let _do = {
        func: (d: any) => {
          this.App.emit("remove-attribute", d);
        },
        args: [d]
      };
      let _undo = {
        func: (d: any) => {
          this.App.emit("add-attribute", d);
        },
        args: [d]
      };
      this.apply.call(this, ["remove-attribute", _do, _undo]);
    });

    this.comm.on("set-filter", idx => {
      this.App.emit("filter-changed", null, idx);
      this.App.emit("set-agg-none");
    });
  }

  update(data: Data) {
    this.comm.emit("update", data);
  }
}

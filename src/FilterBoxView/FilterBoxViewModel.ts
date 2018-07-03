import { Application, Command } from "provenance_mvvm_framework";
/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:38:25 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-15 16:31:10
 */
import { ViewModelBase } from "provenance_mvvm_framework";
import { FilterBoxView } from "./FilterBoxView";
import "./styles.scss";
import { RenderConfig } from "../DataStructure/AggregateAndFilters";
export class FilterBoxViewModel extends ViewModelBase {
  get config(): RenderConfig {
    if (!sessionStorage["render_config"]) this.saveConfig(new RenderConfig());
    return JSON.parse(sessionStorage["render_config"]);
  }

  constructor(view: FilterBoxView, app: Application) {
    super(view, app);
    this.comm.on("filter-changed", (config: RenderConfig) => {
      this.App.emit("filter-changed", config, null);
    });
    this.App.on("set-agg-none", () => {
      this.comm.emit("set-agg-none");
    });
    this.App.on("change-dataset", d => {
      let rc = this.config;
      rc.currentFile = d;
      this.saveConfig(rc);
    });

    this.comm.on("apply", this.apply as any, this);
  }

  private saveConfig(config: RenderConfig, update: boolean = true) {
    sessionStorage["render_config"] = JSON.stringify(config);
    if (update) this.comm.emit("filter-changed", this.config);
  }

  private apply(args: any) {
    console.log(args);

    Command.call(this, args);
  }
}

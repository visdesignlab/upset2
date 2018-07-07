import { AggregateBy, SortBy } from "./../DataStructure/AggregateAndFilters";
/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 14:36:32 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-07 15:43:50
 */
import * as d3 from "d3";
import { ViewBase } from "provenance_mvvm_framework";
import html from "./filterbox.view.html";
import { RenderConfig } from "../DataStructure/AggregateAndFilters";
import { min } from "d3";

export class FilterBoxView extends ViewBase {
  get config(): RenderConfig {
    if (!sessionStorage["render_config"]) this.saveConfig(new RenderConfig());
    return JSON.parse(sessionStorage["render_config"]);
  }

  constructor(root: HTMLElement) {
    super(root);
    this.comm.on("set-agg-none", () => {
      let rc = this.config;
      rc.firstLevelAggregateBy = AggregateBy.NONE;
      rc.secondLevelAggregateBy = AggregateBy.NONE;
      rc.sortBy = SortBy.SET;
      this.saveConfig(rc, false);
      this.update();
    });
  }

  create() {
    d3.select(this.Root).html(html);
    this.update();
  }

  update() {
    this.updateAggregationDropdowns();
    this.updateSortByOptions();
    this.updateDataFields();
  }

  private updateDataFields() {
    let minDegree = d3.select("#minDegree");
    let maxDegree = d3.select("#maxDegree");
    let hideEmpty = d3.select("#hideEmpty");

    minDegree.attr("value", this.config.minDegree);
    maxDegree.attr("value", this.config.maxDegree);
    hideEmpty.property("checked", this.config.hideEmptyIntersection);

    minDegree.on("change", () => {
      let val = minDegree.property("value");
      let rc = this.config;
      rc.minDegree = val;
      this.saveConfig(rc);
    });

    maxDegree.on("change", () => {
      let val = maxDegree.property("value");
      let rc = this.config;
      rc.maxDegree = val;
      this.saveConfig(rc);
    });

    hideEmpty.on("change", () => {
      let rc = this.config;
      rc.hideEmptyIntersection = hideEmpty.property("checked");
      this.saveConfig(rc);
    });
  }

  private updateSortByOptions() {
    let sortby = Object.keys(SortBy);
    sortby.splice(-1, 1);
    let sortByOptions = d3
      .select(this.Root)
      .select("#sortByOptions")
      .selectAll(".sortOption")
      .data(sortby);

    sortByOptions.exit().remove();

    let sortLabels = sortByOptions
      .enter()
      .append("div")
      .attr("class", "sortOption")
      .html("")
      .append("label")
      .attr("class", "radio");

    sortLabels
      .append("input")
      .attr("name", "sortAnswer")
      .attr("type", "radio")
      .property("checked", (d, i) => {
        return this.config.sortBy === d;
      });

    sortLabels.on("click", (d: any, i) => {
      let current = "";
      sortLabels.each(function(d) {
        if (
          d3
            .select(this)
            .select("input")
            .property("checked") === true
        )
          current = d;
      });

      let _do = {
        func: this.applySortBy.bind(this),
        args: [d]
      };

      let _undo = {
        func: this.applySortBy.bind(this),
        args: [current]
      };

      this.comm.emit("apply", ["applySortBy", _do, _undo]);
    });

    sortLabels.append("span").text((d, i) => {
      return ` ${d}`;
    });
  }

  private updateAggregationDropdowns() {
    if (this.config.firstLevelAggregateBy === AggregateBy.NONE) {
      d3.select("#secondAgg").html("");
    } else {
      d3.select(this.Root).html(html);
    }

    let firstAggBy = d3.select(this.Root).select("#firstAggByDropdown");
    let secondAggBy = d3.select(this.Root).select("#secondAggByDropdown");

    let aggOptions = Object.keys(AggregateBy);
    let firstAggByOptions = d3
      .select(this.Root)
      .select("#firstAggByOptions")
      .selectAll(".dropdown-item")
      .data(aggOptions);
    firstAggBy.text(this.config.firstLevelAggregateBy);

    firstAggByOptions.exit().remove();
    firstAggByOptions
      .enter()
      .append("div")
      .attr("class", "dropdown-item")
      .text((d, i) => {
        return d;
      })
      .on("click", (d: any, i) => {
        let current = firstAggBy.text();

        let _do = {
          func: this.applyFirstAggregation.bind(this),
          args: [d]
        };

        let _undo = {
          func: this.applyFirstAggregation.bind(this),
          args: [current]
        };

        this.comm.emit("apply", ["applyFirstAggregation", _do, _undo]);
      });

    aggOptions.splice(aggOptions.indexOf(this.config.firstLevelAggregateBy), 1);

    let secondAggByOptions = d3
      .select(this.Root)
      .select("#secondAggByOptions")
      .selectAll(".dropdown-item")
      .data(aggOptions);

    secondAggBy.text(this.config.secondLevelAggregateBy);

    secondAggByOptions.exit().remove();

    secondAggByOptions
      .enter()
      .append("div")
      .attr("class", "dropdown-item")
      .text((d, i) => {
        return d;
      })
      .on("click", (d: any, i) => {
        let current = secondAggBy.text();
        let _do = {
          func: this.applySecondAggregation.bind(this),
          args: [d]
        };
        let _undo = {
          func: this.applySecondAggregation.bind(this),
          args: [d]
        };

        this.comm.emit("apply", ["applySecondAggregation", _do, _undo]);
        // let rc = this.config;
        // rc.secondLevelAggregateBy = <AggregateBy>AggregateBy[d];

        // if (
        //   rc.secondLevelAggregateBy !== AggregateBy.NONE &&
        //   rc.sortBy === SortBy.SET
        // )
        //   rc.sortBy = SortBy.DEGREE;

        // this.saveConfig(rc);
        // this.update();
      });
  }

  private saveConfig(config: RenderConfig, update: boolean = true) {
    sessionStorage["render_config"] = JSON.stringify(config);
    if (update) this.comm.emit("filter-changed", this.config);
  }

  applyFirstAggregation(d: any) {
    let rc = this.config;
    rc.firstLevelAggregateBy = <AggregateBy>AggregateBy[d];
    if (rc.secondLevelAggregateBy === rc.firstLevelAggregateBy) {
      rc.secondLevelAggregateBy = AggregateBy.NONE;
    }
    if (
      rc.firstLevelAggregateBy !== AggregateBy.NONE &&
      rc.sortBy === SortBy.SET
    )
      rc.sortBy = SortBy.DEGREE;
    this.saveConfig(rc);
    this.update();
  }

  applySecondAggregation(d: any) {
    let rc = this.config;
    rc.secondLevelAggregateBy = <AggregateBy>AggregateBy[d];

    if (
      rc.secondLevelAggregateBy !== AggregateBy.NONE &&
      rc.sortBy === SortBy.SET
    )
      rc.sortBy = SortBy.DEGREE;

    this.saveConfig(rc);
    this.update();
  }

  applySortBy(d: any) {
    let rc = this.config;
    rc.sortBy = <SortBy>SortBy[d];
    this.saveConfig(rc);
    this.update();
  }
}

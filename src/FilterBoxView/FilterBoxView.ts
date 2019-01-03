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
    if (!(sessionStorage as any)["render_config"])
      this.saveConfig(new RenderConfig());
    return JSON.parse((sessionStorage as any)["render_config"]);
  }

  constructor(root: HTMLElement) {
    super(root);
    this.comm.on("sort-by-set", (id: number) => {
      let rc = Object.assign(
        Object.create(Object.getPrototypeOf(this.config)),
        this.config
      );
      let _do = {
        func: this.applySortBySet.bind(this),
        args: [id]
      };
      let _undo = {
        func: this.unApplySortBySet.bind(this),
        args: [rc]
      };

      this.comm.emit("apply", ["sortBySet", _do, _undo]);
    });

    this.comm.on("sort-by-cardinality", () => {
      let rc = Object.assign(
        Object.create(Object.getPrototypeOf(this.config)),
        this.config
      );
      let _do = {
        func: this.applySortByCardinality.bind(this),
        args: [] as any
      };
      let _undo = {
        func: this.unApplySortByCardinality.bind(this),
        args: [rc]
      };

      this.comm.emit("apply", ["sortByCardinality", _do, _undo]);
    });

    this.comm.on("sort-by-deviation", () => {
      let rc = Object.assign(
        Object.create(Object.getPrototypeOf(this.config)),
        this.config
      );
      let _do = {
        func: this.applySortByDeviation.bind(this),
        args: [] as any
      };
      let _undo = {
        func: this.unApplySortByDeviation.bind(this),
        args: [rc]
      };

      this.comm.emit("apply", ["sortByDeviation", _do, _undo]);
    });
  }

  create() {
    d3.select(this.Root).html(html);
    this.update();
    this.comm.on("do-collapse-all", this.updateCollapseAll.bind(this));
  }

  update() {
    this.updateAggregationDropdowns();
    // this.updateCollapseAll();
    this.updateSortByOptions();
    this.updateOverlaps();
    this.updateDataFields();
    this.updateSetOverlaps();
  }

  private updateSetOverlaps() {
    let btn = d3.select("#set-overlap-button");
    let rc = Object.assign(
      Object.create(Object.getPrototypeOf(this.config)),
      this.config
    );
    btn.on('click', ()=>{
      let _do = {
        func: this.applySetOverlap.bind(this),
        args: [] as any
      };
      let _undo = {
        func: this.unApplySetOverlap.bind(this),
        args: [rc]
      };
      this.comm.emit('apply', ['apply-set-overlap', _do, _undo]);
    })
  }

  applySetOverlap() {
    let rc = this.config;
    rc.firstLevelAggregateBy = AggregateBy.SETS;
    rc.secondLevelAggregateBy = AggregateBy.OVERLAPS;
    rc.collapseAll = true;
    this.saveConfig(rc);
    this.update();
  }
  unApplySetOverlap(rc: RenderConfig) {
    this.saveConfig(rc);
    this.update();
  }
  
  private updateCollapseAll() {
      let curr = this.config.collapseAll;
      let _do = {
        func: this.applyCollapseAll.bind(this),
        args: [!curr]
      };
      let _undo = {
        func: this.applyCollapseAll.bind(this),
        args: [curr]
      };
      this.comm.emit("apply", ["apply-collapse-all", _do, _undo]);
  }

  private updateDataFields() {
    let minDegree = d3.select("#minDegree");
    let maxDegree = d3.select("#maxDegree");
    let hideEmpty = d3.select("#hideEmpty");

    let firstOverlap = d3.select(this.Root).select("#overlap-one");
    let secondOverlap = d3.select(this.Root).select("#overlap-two");

    firstOverlap
      .select("#first-overlap-input")
      .property("value", this.config.firstOverlap);
    secondOverlap
      .select("#second-overlap-input")
      .property("value", this.config.secondOverlap);

    minDegree.attr("value", this.config.minDegree);
    maxDegree.attr("value", this.config.maxDegree);
    hideEmpty.property("checked", this.config.hideEmptyIntersection);
    let t = this;

    minDegree.on("change", function() {
      let newVal = d3.select(this).property("value");

      let _do = {
        func: t.applyMinDegreeChange.bind(t),
        args: [newVal]
      };

      let _undo = {
        func: t.applyMinDegreeChange.bind(t),
        args: [t.config.minDegree]
      };

      t.comm.emit("apply", ["applyMinDegreeChange", _do, _undo]);
    });

    maxDegree.on("change", function() {
      let newVal = d3.select(this).property("value");

      let _do = {
        func: t.applyMaxDegreeChange.bind(t),
        args: [newVal]
      };

      let _undo = {
        func: t.applyMaxDegreeChange.bind(t),
        args: [t.config.maxDegree]
      };

      t.comm.emit("apply", ["applyMaxDegreeChange", _do, _undo]);
    });

    hideEmpty.on("change", function() {
      let hide = d3.select(this).property("checked");

      let _do = {
        func: t.applyHideEmpty.bind(t),
        args: [hide]
      };

      let _undo = {
        func: t.applyHideEmpty.bind(t),
        args: [t.config.hideEmptyIntersection]
      };

      t.comm.emit("apply", ["applyHideEmpty", _do, _undo]);
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
        let overlap = this.config.secondOverlap;
        let _do = {
          func: this.applySecondAggregation.bind(this),
          args: [d]
        };
        let _undo = {
          func: this.applySecondAggregation.bind(this),
          args: [current]
        };

        this.comm.emit("apply", ["applySecondAggregation", _do, _undo]);
      });
  }

  private updateOverlaps() {
    let firstOverlap = d3.select("#first-overlap-input");
    let secondOverlap = d3.select("#second-overlap-input");
    let t = this;
    firstOverlap.on("change", function() {
      let overlap = d3.select(this).property("value");

      let _do = {
        func: t.applyFirstOverlap.bind(t),
        args: [overlap]
      };
      let _undo = {
        func: t.applyFirstOverlap.bind(t),
        args: [t.config.firstOverlap]
      };

      t.comm.emit("apply", ["applyFirstOverlap", _do, _undo]);
    });

    secondOverlap.on("change", function() {
      let overlap = d3.select(this).property("value");

      let _do = {
        func: t.applySecondOverlap.bind(t),
        args: [overlap]
      };
      let _undo = {
        func: t.applySecondOverlap.bind(t),
        args: [t.config.secondOverlap]
      };

      t.comm.emit("apply", ["applySecondOverlap", _do, _undo]);
    });
  }

  private saveConfig(config: RenderConfig, update: boolean = true) {
    (sessionStorage as any)["render_config"] = JSON.stringify(config);
    if (update) this.comm.emit("filter-changed", this.config);
  }

  applyFirstAggregation(d: any) {
    let rc = this.config;
    rc.firstLevelAggregateBy = <AggregateBy>AggregateBy[d];
    if (rc.secondLevelAggregateBy === rc.firstLevelAggregateBy) {
      rc.secondLevelAggregateBy = AggregateBy.NONE;
    }
    if (rc.firstLevelAggregateBy === AggregateBy.NONE){
      rc.secondLevelAggregateBy = AggregateBy.NONE;
      rc.collapseAll = false;
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

  applyFirstOverlap(d: number) {
    let rc = this.config;
    rc.firstOverlap = d;
    this.saveConfig(rc);
    this.update();
  }

  applySecondOverlap(d: number) {
    let rc = this.config;
    rc.secondOverlap = d;
    this.saveConfig(rc);
    this.update();
  }

  applyMinDegreeChange(d: number) {
    let rc = this.config;
    rc.minDegree = d;
    this.saveConfig(rc);
    this.update();
  }

  applyMaxDegreeChange(d: number) {
    let rc = this.config;
    rc.maxDegree = d;
    this.saveConfig(rc);
    this.update();
  }

  applyHideEmpty(d: boolean) {
    let rc = this.config;
    rc.hideEmptyIntersection = d;
    this.saveConfig(rc);
    this.update();
  }

  applySortBySet(id: number) {
    let rc = this.config;
    rc.firstLevelAggregateBy = AggregateBy.NONE;
    rc.secondLevelAggregateBy = AggregateBy.NONE;
    rc.sortBy = SortBy.SET;
    rc.sortBySetid = id;
    this.saveConfig(rc);
    this.update();
  }

  unApplySortBySet(rc: RenderConfig) {
    this.saveConfig(rc);
    this.update();
  }

  applyCollapseAll(val: boolean) {
    let rc = this.config;
    rc.collapseAll = val;
    this.saveConfig(rc);
    this.update();
  }

  applySortByCardinality() {
    let rc = this.config;
    rc.sortBy = SortBy.CARDINALITY;
    this.saveConfig(rc);
    this.update();
  }

  unApplySortByCardinality(rc: RenderConfig) {
    this.saveConfig(rc);
    this.update();
  }

  applySortByDeviation() {
    let rc = this.config;
    rc.sortBy = SortBy.DEVIATION;
    this.saveConfig(rc);
    this.update();
  }

  unApplySortByDeviation(rc: RenderConfig) {
    this.saveConfig(rc);
    this.update();
  }
}

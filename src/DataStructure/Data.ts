/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 15:56:16
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-16 11:45:52
 */
import { DSVParsedArray, DSVRowString, map } from "d3";
import { Application } from "provenance_mvvm_framework";
import { RawData, RenderRow } from "./../type_declarations/types";
import { AggregateBy, RenderConfig, SortBy } from "./AggregateAndFilters";
import AggregationStrategy from "./AggregationStrategy";
import { Attribute } from "./Attribute";
import { IDataSetJSON } from "./IDataSetJSON";
import { Set } from "./Set";
import SortStrategy from "./SortingStrategy";
import { SubSet } from "./SubSet";
import { RowType } from "./RowType";
import * as d3 from "d3";
import { Group } from "./Group";

export type Membership = { [key: number]: string[] };

export class Data {
  app: Application;
  name: string;
  sets: Array<Set> = [];
  usedSets: Array<Set> = [];
  renderRows: Array<RenderRow> = [];
  subSets: Array<SubSet> = [];
  attributes: Array<Attribute> = [];
  selectedAttributes: Array<Attribute> = [];
  combinations: number = 0;
  allItems: Array<number> = [];
  depth: number = 0;
  noDefaultSets: number = 6;
  renderConfig: RenderConfig;
  unusedSets: Array<Set> = [];
  memberships: Membership = {};
  collapsedList: string[] = [];
  subSetsToRemove: number[] = [];

  get maxCardinality(): number {
    return Math.max(...this.renderRows.map(d => d.data.setSize));
  }

  get setNameDictionary(): { [key: number]: string } {
    return this.usedSets.reduce((map: any, object, idx) => {
      map[idx] = object.elementName;
      return map;
    }, {});
  }

  constructor(app: Application) {
    this.app = app;
    this.renderConfig = new RenderConfig();
    this.app.on("filter-changed", (rc: RenderConfig) => {
      this.setupRenderRows(rc);
    });
    this.app.on("add-set", this.addSet, this);
    this.app.on("remove-set", this.removeSet, this);
    this.app.on("add-attribute", this.addAttribute, this);
    this.app.on("remove-attribute", this.removeAttribute, this);
    this.app.on("collapse-group", this.collapseGroup, this);
  }

  collapseGroup(d: RenderRow, collapseAllFlag: boolean = false) {
    let group = d.data as Group;
    group.isCollapsed = !group.isCollapsed;
    group.nestedGroups.map(_ => (_.isCollapsed = group.isCollapsed));
    if (!collapseAllFlag) this.app.emit("render-rows-changed", this);
  }

  async load(
    data: DSVParsedArray<DSVRowString>,
    dataSetDesc: IDataSetJSON
  ): Promise<any> {
    this.name = dataSetDesc.name;
    await this.getRawData(data, dataSetDesc).then(rawData => {
      this.memberships = {};
      this.getSets(rawData);
      this.getAttributes(data, rawData, dataSetDesc);
      this.setUpSubSets();
      this.setupRenderRows(JSON.parse(sessionStorage["render_config"]));
    });
    return new Promise((res, rej) => {
      res(<any>this);
    });
  }

  get setIdToSet(): { [key: string]: Set } {
    let a: { [key: string]: Set } = {};
    for (let i = 0; i < this.sets.length; ++i) {
      a[this.sets[i].id] = this.sets[i];
    }
    return a;
  }

  private createSignature(
    listOfUsedSets: (string | number)[],
    listOfSets: (number | string)[]
  ) {
    return listOfUsedSets
      .map(sets => {
        return listOfSets.indexOf(sets) > -1 ? 1 : 0;
      })
      .join("");
  }

  private setUpSubSets() {
    this.combinations = Math.pow(2, this.usedSets.length) - 1;

    this.subSets = [];

    let aggregateIntersection: { [key: string]: Array<number> } = {};

    let listOfUsedSets = this.usedSets.map(set => set.id);

    let setsAttribute = this.attributes.filter(attr => {
      return attr.type === "sets";
    })[0];

    let signature: string = "";

    setsAttribute.values.forEach((listOfSets, idx) => {
      signature = this.createSignature(listOfUsedSets, listOfSets);
      if (aggregateIntersection[signature] == null) {
        aggregateIntersection[signature] = [idx];
      } else {
        aggregateIntersection[signature].push(idx);
      }
    });

    let tempBitMask = 0;
    let usedSetLength = this.usedSets.length;
    let combinedSetsFlat = "";
    let actualBit = -1;
    let names: string[] = [];

    for (let bitMask = 0; bitMask <= this.combinations; ++bitMask) {
      tempBitMask = bitMask;

      let card = 0;
      let combinedSets: number[] = Array.apply(null, new Array(usedSetLength))
        .map(() => {
          actualBit = tempBitMask % 2;
          tempBitMask = (tempBitMask - actualBit) / 2;
          card == actualBit;
          return +actualBit;
        })
        .reverse();

      combinedSetsFlat = combinedSets.join("");

      names = [];
      let expectedValue = 1;
      let notExpectedValue = 1;

      combinedSets.forEach((d, i) => {
        if (d === 1) {
          names.push(this.usedSets[i].elementName);
          expectedValue = expectedValue * this.usedSets[i].dataRatio;
        } else {
          notExpectedValue =
            notExpectedValue * (1 - this.usedSets[i].dataRatio);
        }
      });

      expectedValue *= notExpectedValue;

      let list = aggregateIntersection[combinedSetsFlat];
      if (list == null) {
        list = [];
      }

      let name = "";
      names = names.map(n => n.replace(" ", "_"));
      if (names.length > 0) name = names.reverse().join(" ") + "";
      if (name === "") {
        name = "UNINCLUDED";
      }
      let subset = new SubSet(
        bitMask,
        name,
        combinedSets,
        list,
        expectedValue,
        this.depth
      );
      this.subSets.push(subset);
      this.UpdateDictionary(subset.itemList, subset.id);
    }
    aggregateIntersection = {};
  }

  private UpdateDictionary(items: number[], belongsTo: string | number) {
    items.forEach(item => {
      if (!this.memberships[item]) this.memberships[item] = [];
      this.memberships[item].push(belongsTo.toString());
    });
  }

  private getAttributes(
    data: DSVParsedArray<DSVRowString>,
    rawData: RawData,
    dataSetDesc: IDataSetJSON
  ) {
    this.attributes.length = 0;
    for (let i = 0; i < dataSetDesc.meta.length; ++i) {
      let metaDefinition = dataSetDesc.meta[i];
      this.attributes.push({
        name: metaDefinition.name || rawData.header[metaDefinition.index],
        type: metaDefinition.type,
        values: [],
        sort: 1
      });
    }

    //  Implicit Attributes

    // Set Count attribute
    let setCountAttribute: Attribute = {
      name: "Set Count",
      type: "integer",
      values: [],
      sort: 1,
      min: 0
    };

    for (let d = 0; d < this.depth; ++d) {
      let setCount = 0;
      for (let s = 0; s < rawData.rawSets.length; ++s) {
        setCount += rawData.rawSets[s][d];
      }
      setCountAttribute.values[d] = setCount;
    }
    this.attributes.push(setCountAttribute);

    // Set Attribute
    let setAttribute: Attribute = {
      name: "Sets",
      type: "sets",
      values: [],
      sort: 1
    };

    for (let i = 0; i < this.depth; ++i) {
      let setList: Array<number | string> = [];
      for (let s = 0; s < rawData.rawSets.length; ++s) {
        if (rawData.rawSets[s][i] === 1) {
          setList.push(this.sets[s].id);
        }
      }
      setAttribute.values[i] = setList;
    }
    this.attributes.push(setAttribute);

    //  Load MetaData
    for (let i = 0; i < dataSetDesc.meta.length; ++i) {
      let metaDefinition = dataSetDesc.meta[i];
      this.attributes[i].values = data.map((row, row_idx) => {
        let val = (<any>Object).values(row)[metaDefinition.index];
        switch (metaDefinition.type) {
          case "integer": {
            let intVal = parseInt(val, 10);
            if (isNaN(intVal)) {
              console.error(`Cannot parse ${val} to integer`);
              return NaN;
            }
            return intVal;
          }
          case "float": {
            let floatVal = parseFloat(val);
            if (isNaN(floatVal)) {
              console.error(`Cannot parse ${val} to integer`);
              return NaN;
            }
            return floatVal;
          }
          case "id":
          case "string":
          default:
            return val;
        }
      });
    }

    let max;

    for (let i = 0; i < this.attributes.length; ++i) {
      if (
        this.attributes[i].type === "float" ||
        this.attributes[i].type === "integer"
      ) {
        if (i < dataSetDesc.meta.length) {
          this.attributes[i].min =
            dataSetDesc.meta[i].min ||
            Math.min.apply(null, this.attributes[i].values);
          this.attributes[i].max =
            dataSetDesc.meta[i].max ||
            Math.max.apply(null, this.attributes[i].values);
        } else {
          this.attributes[i].min =
            this.attributes[i].min ||
            Math.min.apply(null, this.attributes[i].values);
          this.attributes[i].max =
            this.attributes[i].max ||
            Math.max.apply(null, this.attributes[i].values);
        }
      }
    }

    // this.maxCardinality = this.attributes[this.attributes.length - 2].max;
    // // hackthis.renderConfig
    // if (isNaN(this.maxCardinality)) {
    //   this.maxCardinality = this.sets.length;
    // }
  }

  /**
   *
   *
   * @param {RawData} data
   * @memberof Data
   */
  private getSets(data: RawData) {
    let setPrefix = "S_";

    for (let i = 0; i < data.setNames.length; ++i) {
      let combinedSets = Array.apply(null, new Array(data.rawSets.length)).map(
        Number.prototype.valueOf,
        0
      );
      combinedSets[i] = 1;
      var set = new Set(
        setPrefix + i,
        data.setNames[i],
        combinedSets,
        data.rawSets[i],
        this.depth
      );
      this.sets.push(set);
      if (i < this.noDefaultSets) {
        set.isSelected = true;
        this.usedSets.push(set);
      } else {
        set.isSelected = false;
        this.unusedSets.push(set);
      }
    }
  }

  private getAlphabeticalSorting(sets: Set[]): Set[] {
    return sets.sort((a: Set, b: Set) => {
      return d3.ascending(a.elementName, b.elementName);
    });
  }

  public addSet(set: Set) {
    set.isSelected = true;
    this.usedSets.push(set);
    let toRemove = this.unusedSets.findIndex((s, i) => s.id === set.id);
    this.unusedSets.splice(toRemove, 1);
    this.setUpSubSets();
    this.setupRenderRows(JSON.parse(sessionStorage["render_config"]));
    this.app.emit("render-config", this.renderConfig);
  }

  addAttribute(attr: Attribute) {
    let s = this.attributes.filter(_ => _.name === attr.name);
    if (s.length === 1) {
      this.selectedAttributes.push(s[0]);
      this.app.emit("render-rows-changed", this);
    }
  }

  public removeSet(set: Set) {
    set.isSelected = false;
    let toRemove = this.usedSets.findIndex((s, i) => s.id === set.id);
    this.usedSets.splice(toRemove, 1);
    this.unusedSets.push(set);
    this.setUpSubSets();
    this.setupRenderRows(JSON.parse(sessionStorage["render_config"]));
    this.app.emit("render-config", this.renderConfig);
  }

  public removeAttribute(attr: Attribute) {
    let s = this.selectedAttributes.filter(_ => _.name === attr.name);
    if (s.length === 1) {
      let idx = this.selectedAttributes.findIndex(_ => _.name === attr.name);
      if (idx !== -1) {
        this.selectedAttributes.splice(idx, 1);
        this.app.emit("render-rows-changed", this);
      }
    }
  }

  /**
   *
   *
   * @param {DSVParsedArray<DSVRowString>} data
   * @param {IDataSetJSON} dataSetDesc
   * @returns {Promise<RawData>}
   * @memberof Data
   */
  private getRawData(
    data: DSVParsedArray<DSVRowString>,
    dataSetDesc: IDataSetJSON
  ): Promise<RawData> {
    let rawData: RawData = {
      rawSets: [],
      setNames: [],
      header: []
    };

    let headers = data.columns;
    rawData.header = data.columns;
    let processedSetCount = 0;

    for (let i = 0; i < dataSetDesc.sets.length; ++i) {
      let setDef = dataSetDesc.sets[i];
      if (setDef.format === "binary") {
        let setDefLength = setDef.end - setDef.start + 1;

        for (let setCount = 0; setCount < setDefLength; ++setCount) {
          rawData.rawSets.push(new Array<number>());
        }

        let rows = data.map((row, row_idx) => {
          return (<any>Object)
            .entries(row)
            .map((t: any) => t[1])
            .map((val: string, col_idx: number) => {
              if (col_idx >= setDef.start && col_idx <= setDef.end) {
                let intVal = parseInt(val, 10);
                if (isNaN(intVal)) {
                  console.error("Unable to parse ${val}!");
                }
                return intVal;
              }
              return null;
            });
        });

        for (let r = 0; r < rows.length; ++r) {
          if (i === 0) {
            this.allItems.push(this.depth++);
          }
          for (let s = 0; s < setDefLength; ++s) {
            rawData.rawSets[processedSetCount + s].push(
              rows[r][setDef.start + s]
            );
            if (r === 1) {
              rawData.setNames.push(headers[setDef.start + s]);
            }
          }
        }

        processedSetCount += setDefLength;
      } else {
        console.error(`Set definition format ${setDef.format} not supported.`);
      }
    }

    return new Promise((res, rej) => {
      res(rawData);
    });
  }

  private setupRenderRows(
    renderConfig: RenderConfig = null,
    sortBySetId?: number
  ) {
    this.collapsedList = [];
    this.subSetsToRemove = [];

    if (renderConfig) {
      this.renderConfig = renderConfig;
      this.renderRows = this.render(
        this.renderConfig.firstLevelAggregateBy,
        this.renderConfig.secondLevelAggregateBy,
        this.renderConfig.sortBy,
        this.renderConfig.minDegree,
        this.renderConfig.maxDegree,
        this.renderConfig.firstOverlap,
        this.renderConfig.secondOverlap,
        this.renderConfig.sortBySetid,
        this.renderConfig.collapseAll
      );
    } else {
      if (!sortBySetId) sortBySetId = 0;
      this.renderRows = this.render(
        null,
        null,
        SortBy.SET,
        this.renderConfig.minDegree,
        this.renderConfig.maxDegree,
        this.renderConfig.firstOverlap,
        this.renderConfig.secondOverlap,
        this.renderConfig.sortBySetid,
        this.renderConfig.collapseAll
      );
    }

    if (this.renderConfig.collapseAll) {
      this.renderRows.forEach(_ => {
        this.collapseGroup(_, true);
      });
    }

    this.app.emit("render-rows-changed", this);
  }

  private render(
    firstAggBy: AggregateBy,
    secondAggBy: AggregateBy,
    sortBy: SortBy,
    minDegree: number,
    maxDegree: number,
    overlap1: number,
    overlap2: number,
    sortBySetId?: number,
    collapseAll: boolean = false
  ): Array<RenderRow> {
    let agg: RenderRow[] = [];

    this.subSets
      .filter(d => {
        return d.noCombinedSets >= minDegree && d.noCombinedSets <= maxDegree;
      })
      .forEach((set: SubSet) => {
        agg.push({ id: set.id.toString(), data: set });
      });

    if (firstAggBy === AggregateBy.OVERLAPS)
      agg = AggregationStrategy[firstAggBy](
        agg,
        overlap1,
        1,
        this.setNameDictionary
      );
    else if (firstAggBy && firstAggBy !== AggregateBy.NONE)
      agg = AggregationStrategy[firstAggBy](
        agg,
        overlap1,
        1,
        this.setNameDictionary
      );
    if (secondAggBy && secondAggBy !== AggregateBy.NONE)
      agg = applySecondAggregation(
        agg,
        secondAggBy,
        overlap2,
        this.setNameDictionary
      );

    if (!this.renderConfig.hideEmptyIntersection) {
      if (agg.filter(_ => _.data.type === RowType.GROUP).length > 0)
        agg.forEach(_ => {
          let group = _.data as Group;
          group.visibleSets.push(...group.hiddenSets);
        });
    } else {
      agg = agg.filter(_ => _.data.setSize > 0);
      if (agg.filter(_ => _.data.type === RowType.GROUP).length > 0) {
        agg.forEach(row => {
          let group = row.data as Group;
          group.nestedGroups = group.nestedGroups.filter(_ => _.setSize > 0);
        });
      }
    }

    if (sortBy) agg = applySort(agg, sortBy, sortBySetId);

    agg.filter(_ => _.data instanceof Group).forEach(group => {
      this.UpdateDictionary(group.data.items, group.id);
    });

    return agg;
  }
}

function applySecondAggregation(
  agg: RenderRow[],
  aggBy: AggregateBy,
  overlap: number,
  setNameDictionary: { [key: number]: string }
): RenderRow[] {
  let rr: RenderRow[] = [];

  agg.forEach(row => {
    rr.push(row);
    let group = row.data as Group;
    let subsetRows = group.subSets.map(_ => {
      return {
        id: _.id.toString(),
        data: _
      };
    });
    let rendered = AggregationStrategy[aggBy](
      subsetRows,
      overlap,
      2,
      setNameDictionary
    );
    rendered.map(_ => (row.data as Group).addNestedGroup(_.data as Group));
  });
  return rr;
}

function applySort(
  agg: RenderRow[],
  sortBy: SortBy,
  sortBySetId?: number
): RenderRow[] {
  let a = SortStrategy[sortBy](agg, sortBySetId);
  return a;
}

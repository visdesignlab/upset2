/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 15:56:16
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-15 16:42:08
 */
import { DSVParsedArray, DSVRowString } from "d3";
import { Application } from "provenance_mvvm_framework";
import { RawData, RenderRow } from "./../type_declarations/types";
import { AggregateBy, RenderConfig, SortBy } from "./AggregateAndFilters";
import AggregationStrategy from "./AggregationStrategy";
import { Attribute } from "./Attribute";
import { IDataSetJSON } from "./IDataSetJSON";
import { Set } from "./Set";
import SortStrategy from "./SortingStrategy";
import { SubSet } from "./SubSet";

export class Data {
  app: Application;
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

  get maxCardinality(): number {
    return Math.max(...this.renderRows.map(d => d.data.setSize));
  }

  constructor(app: Application) {
    this.app = app;
    this.renderConfig = new RenderConfig();
    this.app.on("filter-changed", this.setupRenderRows, this);
  }

  async load(
    data: DSVParsedArray<DSVRowString>,
    dataSetDesc: IDataSetJSON
  ): Promise<any> {
    await this.getRawData(data, dataSetDesc).then(rawData => {
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

    if (false) {
      Object.keys(aggregateIntersection).forEach(key => {
        let list = aggregateIntersection[key];

        let combinedSets = key.split("");
        names = [];
        let expectedValue = 1;
        let notExpectedValue = 1;

        combinedSets.forEach((d, i) => {
          if (d === "1") {
            names.push(this.usedSets[i].elementName);
            expectedValue = expectedValue * this.usedSets[i].dataRatio;
          } else {
            notExpectedValue =
              notExpectedValue * (1 - this.usedSets[i].dataRatio);
          }
        });

        expectedValue += notExpectedValue;

        let name = "";
        if (names.length > 0) {
          name = names.reverse().join("") + " "; // Test
        }

        // To define
      });
    } else {
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

        // Test if needed
        // if (card > this.maxCardinality) continue;
        // if (card < this.maxCardinality) continue;

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

        expectedValue += notExpectedValue;

        let list = aggregateIntersection[combinedSetsFlat];
        if (list == null) {
          list = [];
        }

        let name = "";
        if (names.length > 0) name = names.reverse().join(" ") + " ";
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
      }
    }

    aggregateIntersection = {};
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
    // // hack
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
    if (renderConfig) {
      this.renderConfig = renderConfig;
      this.renderRows = this.render(
        this.renderConfig.firstLevelAggregateBy,
        this.renderConfig.secondLevelAggregateBy,
        this.renderConfig.sortBy,
        this.renderConfig.minDegree,
        this.renderConfig.maxDegree,
        sortBySetId
      );
    } else {
      if (!sortBySetId) sortBySetId = 0;
      this.renderRows = this.render(
        null,
        null,
        SortBy.SET,
        this.renderConfig.minDegree,
        this.renderConfig.maxDegree,
        sortBySetId
      );
    }
    console.log(this.maxCardinality);
    this.app.emit("render-rows-changed", this);
  }

  private render(
    firstAggBy: AggregateBy,
    secondAggBy: AggregateBy,
    sortBy: SortBy,
    minDegree: number,
    maxDegree: number,
    sortBySetId?: number
  ): Array<RenderRow> {
    let agg: RenderRow[] = [];

    this.subSets.forEach((set: SubSet) => {
      agg.push({ id: set.id.toString(), data: set });
    });

    if (firstAggBy && firstAggBy !== AggregateBy.NONE)
      agg = AggregationStrategy[firstAggBy](agg);
    if (secondAggBy && secondAggBy !== AggregateBy.NONE)
      agg = applySecondAggregation(agg, secondAggBy);

    if (this.renderConfig.hideEmptyIntersection)
      agg = agg.filter(set => set.data.setSize > 0);

    if (sortBy) agg = applySort(agg, sortBy, sortBySetId);

    return agg;
  }
}

function applySecondAggregation(
  agg: RenderRow[],
  fn: AggregateBy
): RenderRow[] {
  return agg;
}

function applySort(
  agg: RenderRow[],
  sortBy: SortBy,
  sortBySetId?: number
): RenderRow[] {
  let a = SortStrategy[sortBy](agg, sortBySetId);
  return a;
}

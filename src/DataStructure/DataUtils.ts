/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:05
 * @Last Modified by:   Kiran Gadhave
 * @Last Modified time: 2018-06-03 14:36:05
 */
import * as d3 from "d3";
import { Mitt } from "provenance_mvvm_framework";
import { IDataSetInfo } from "./IDataSetInfo";
import { IDataSetJSON } from "./IDataSetJSON";
import { IMetaData } from "./IMetaData";
import { ISetInfo } from "./ISetInfo";

type temp = {
  RawSets: any[];
  SetNames: any[];
};

export class DataUtils {
  static mitt = new Mitt();

  static getDataSetJSON(data: any): IDataSetJSON {
    let metas: IMetaData[] = [];
    data.meta.forEach((d: any) => {
      let m: IMetaData = {
        type: d.type,
        index: d.index,
        name: d.name
      };
      metas.push(m);
    });

    let sets: ISetInfo[] = [];
    data.sets.forEach((d: any) => {
      let s: ISetInfo = {
        format: d.format,
        start: d.start,
        end: d.end
      };
      sets.push(s);
    });

    let d: IDataSetJSON = {
      file: data.file,
      name: data.name,
      header: data.header,
      separator: data.separator,
      skip: data.skip,
      meta: metas,
      sets: sets,
      author: data.author,
      description: data.description,
      source: data.source
    };
    return d;
  }

  static getDataSetInfo(data: IDataSetJSON): IDataSetInfo {
    let info: IDataSetInfo = {
      Name: "",
      SetCount: 0,
      AttributeCount: 0,
      _data: null
    };
    info.Name = data.name;
    info.AttributeCount = data.meta.length;
    info.SetCount = 0;
    for (let i = 0; i < data.sets.length; ++i) {
      let sdb = data.sets[i];

      if (sdb.format === "binary") {
        info.SetCount += sdb.end - sdb.start + 1;
      } else {
        console.error("Set Definition Format $`sdb.format` not supported");
      }
    }
    info._data = data;
    // console.log(info)
    return info;
  }

  static processDataSet(datasetinfo: IDataSetInfo): any {
    let filePath: string = datasetinfo._data.file;
    let dataSetDesc: IDataSetJSON = datasetinfo._data;
    let processedData: temp = {
      RawSets: [],
      SetNames: []
    };
    d3.dsv(dataSetDesc.separator, filePath).then(data => {
      let headers = data.columns;
      let processedSetsCount = 0;
      for (let i = 0; i < dataSetDesc.sets.length; ++i) {
        let sdb = dataSetDesc.sets[i];
        if (sdb.format === "binary") {
          let sdblength = sdb.end - sdb.start + 1;

          for (let setCount = 0; setCount < sdblength; ++setCount) {
            processedData.RawSets.push(new Array<number>());
          }
          var rows = data.map((row, row_idx) => {
            return (<any>Object)
              .entries(row)
              .map((t: any) => t[1])
              .map((val: any, col_idx: number) => {
                if (col_idx >= sdb.start && col_idx <= sdb.end) {
                  let intVal = parseInt(val, 10);
                  if (isNaN(intVal)) {
                    console.error(
                      `Unable to convert ${val} to integer (row: ${row_idx}, col: ${col_idx}.`
                    );
                  }
                  return intVal;
                }
                return null;
              });
          });

          for (let r = 0; r < rows.length; ++r) {
            if (i === 0) {
            }
            for (let s = 0; s < sdblength; ++s) {
              processedData.RawSets[processedSetsCount + s].push(
                rows[r][sdb.start + s]
              );
              if (r === 1) {
                processedData.SetNames.push(headers[sdb.start + s]);
              }
            }
          }
          processedSetsCount += sdblength;
          console.log(processedData);
        } else {
          console.error(`Set definition format ${sdb.format} not supported`);
        }
      }
    });

    let setPrefix = "S_";

    for (let i = 0; i < processedData.RawSets.length; ++i) {
      let combinedSets = Array.apply(
        null,
        new Array(processedData.RawSets.length)
      ).map(Number.prototype.valueOf, 0);
      combinedSets[i] = 1;
    }

    return null;
  }

  static changeDataSet(data: IDataSetJSON) {
    DataUtils.mitt.on("change-dataset", DataUtils.processDataSet);
    DataUtils.mitt.emit("change-dataset", data);
  }
}

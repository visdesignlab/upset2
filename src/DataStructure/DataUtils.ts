/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:05
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-09 14:31:43
 */
import * as d3 from "d3";
import { Data } from "./Data";
import { IDataSetInfo } from "./IDataSetInfo";
import { IDataSetJSON } from "./IDataSetJSON";
import { Application } from "provenance_mvvm_framework";
import { IMetaData } from "./IMetaData";
import { ISetInfo } from "./ISetInfo";
import { RenderConfig } from "./AggregateAndFilters";

export class DataUtils {
  static app: Application;
  static data: Data;

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
        console.error(`Set Definition Format ${sdb.format} not supported`);
      }
    }
    info._data = data;
    return info;
  }

  static processDataSet(datasetinfo: IDataSetInfo): any {
    let filePath: string = datasetinfo._data.file;
    let dataSetDesc: IDataSetJSON = datasetinfo._data;
    d3.dsv(dataSetDesc.separator, filePath).then(data => {
      let d = new Data(DataUtils.app).load(data, dataSetDesc);
      d.then((d2: Data) => {
        DataUtils.app.emit("render-config", d2.renderConfig);
      });
    });
  }
}

import * as d3 from "d3";
import * as $ from "jquery";

export var AggregationOption: string[] = [
  "Degree",
  "Sets",
  "Deviation",
  "Overlaps",
  "None"
];

export interface IDataSetInfo {
  Name: string;
  SetCount: number;
  AttributeCount: number;
  _data: IDataSetJSON;
}

export interface IMetaData {
  type: string;
  index: number;
  name: string;
}

export interface ISet {
  format: string;
  start: number;
  end: number;
}

export interface IDataSetJSON {
  file: string;
  name: string;
  header: number;
  separator: string;
  skip: number;
  meta: Array<IMetaData>;
  sets: Array<ISet>;
  author: string;
  description: string;
  source: string;
}

export class Data {
  static EventObject: any = {};

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

    let sets: ISet[] = [];
    data.sets.forEach((d: any) => {
      let s: ISet = {
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

  static changeDataSet(event: any, data: IDataSetJSON) {
    Data.trigger("change-dataset", data);
  }

  static on(event: any, handler: any) {
    $(Data.EventObject).on(event, handler);
  }

  static trigger(event: any, params: any) {
    $(Data.EventObject).trigger(event, params);
  }

  static off(event: any) {
    $(Data.EventObject).off(event);
  }
}

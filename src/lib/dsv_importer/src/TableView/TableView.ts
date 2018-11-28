import { ColumnType, ColumnTypeDictionary } from "./ColumnType";
import { EventHandler } from "./../Utils/PubSub";
import { DatasetInfo, IMetaData } from "./../DataTypes/DatasetInfo";
import { d3Selection } from "../type_declarations/types";
import { pubsub } from "../app/app";
import * as d3 from "d3";
import { DSVParsedArray, DSVRowString, select } from "d3";
import "./styles.scss";
import dropdown from "./dropdown.view.html";
import { FilterWithIndices } from "../Utils/utils";

export function TableView(root: d3Selection) {
  let dsInfo: DatasetInfo;
  pubsub.on("file-uploaded", (file: any, info: DatasetInfo) => {
    dsInfo = info;
    processDataset(file, info);
  });

  pubsub.on("data-processed", (data: DSVParsedArray<DSVRowString>) => {
    pubsub.on("update-dataset-info", (cdt: { [key: string]: ColumnType }) => {
      updateDatasetInfoWithSets(data, dsInfo, cdt);
    });
    processRawData(data, root);
  });
}

function processDataset(file: any, info: DatasetInfo) {
  let reader = getReader(parseDSV, info);
  reader.readAsDataURL(file);
}

function getReader(parseDSV: EventHandler, info: DatasetInfo) {
  let reader = new FileReader();
  reader.onload = event => parseDSV((event.target as any).result, info);
  return reader;
}

function parseDSV(url: any, info: DatasetInfo) {
  let temp = JSON.stringify(info).replace(/\\\\/g, "\\");
  console.log(JSON.parse(temp));
  d3.dsv(JSON.parse(temp).separator, url).then(data => {
    pubsub.emit("data-processed", data);
  });
}

function processRawData(data: DSVParsedArray<DSVRowString>, root: d3Selection) {
  let columns = data.columns.slice();
  columns.unshift("ID");
  data.forEach((d, i) => {
    (d as any)["ID"] = i + 1;
  });
  let subSet: Array<any> = getSubsetOfLength(data, 15);
  let table = buildTable(root, subSet, columns);
}

function getSubsetOfLength(data: DSVParsedArray<DSVRowString>, offset: number) {
  let length = data.length - 1;
  let subSet: any[] = [];
  subSet = data.slice(0, offset);
  subSet.push(...data.slice(length - offset, length));
  return subSet;
}

function buildTable(root: d3Selection, data: any[], columns: string[]) {
  let columnDataTypes: { [key: string]: ColumnType } = readDefaultColumnTypes(
    data,
    columns
  );
  pubsub.emit("update-dataset-info", columnDataTypes);

  pubsub.on("column-type-changed", (colName, newType) => {
    columnDataTypes[colName] = newType;
    pubsub.emit("update-dataset-info", columnDataTypes);
  });

  root.classed("table-view", true).style("height", () => {
    let header_height = d3.select(".file-upload").style("height");
    return `calc(99vh - ${header_height})`;
  });

  let table = root.selectAll(".table-container").data([1]);
  table.exit().remove();
  table = table
    .enter()
    .append("div")
    .classed("table-container", true)
    .merge(table)
    .html("");

  table.append("table");

  let thead = table.append("thead");
  let tbody = table.append("tbody");

  let rows = buildBody(tbody, data, columns);
  buildHeader(thead, columnDataTypes);

  return table;
}

function buildBody(root: d3Selection, data: any[], columns: string[]) {
  data.splice(15, 0, null);
  let rows = root
    .selectAll("tr")
    .data(data)
    .enter()
    .append("tr");

  let cells = rows
    .selectAll("td")
    .data((row, rowidx) => {
      if (row === null) {
        return columns.map(col => {
          return {
            column: col,
            value: "..."
          };
        });
      }
      return columns.map(col => {
        return {
          column: col,
          value: row[col]
        };
      });
    })
    .enter()
    .append("td")
    .text(d => d.value);

  return rows;
}

function buildHeader(
  root: d3Selection,
  columns: { [key: string]: ColumnType }
) {
  let headerRow = root.append("tr");
  let header_group = addHeaderGroup(headerRow, columns);
  let header_selectors = addHeaderSelectors(header_group);
  addHeaderLabels(header_group);

  setUpDropdowns(header_selectors);
}

function addHeaderGroup(
  headerRow: d3Selection,
  columns: { [key: string]: ColumnType }
) {
  let header_group = headerRow
    .selectAll(".header-group")
    .data(d3.entries(columns));
  header_group.exit().remove();
  header_group = header_group
    .enter()
    .append("th")
    .merge(header_group)
    .classed("header-group", true)
    .html("");
  return header_group;
}

function addHeaderSelectors(header_group: d3Selection) {
  return header_group
    .append("div")
    .classed("header-selector", true)
    .html(dropdown)
    .each(function(d) {
      d3.select(this).select("select");
    });
}

function addHeaderLabels(header_group: d3Selection) {
  return header_group
    .append("div")
    .classed("header-label", true)
    .text(d => {
      return d.key;
    });
}

function setUpDropdowns(header_selectors: d3Selection) {
  header_selectors.each(function(column) {
    let selector = d3.select(this).select("select");
    selector
      .select(`option[value=${ColumnTypeDictionary[column.value]}]`)
      .property("selected", true);

    selector.on("input", function(d: any) {
      let selectedOption = d3.select(this).property("value");
      pubsub.emit(
        "column-type-changed",
        d.key,
        parseInt(
          Object.keys(ColumnTypeDictionary).find(
            (k: any) => ColumnTypeDictionary[k] === selectedOption
          )
        )
      );
    });
  });
}

function readDefaultColumnTypes(data: any[], columns: string[]) {
  let cdt: { [key: string]: ColumnType } = {};
  columns.forEach(column => {
    let columnValues = data.map(d => d[column]);
    let type = getColumnType(columnValues);
    cdt[column] = type;
  });

  return cdt;
}

function getColumnType(arr: any[]): ColumnType {
  if (isNumericArray(arr)) {
    if (isSetArray(arr)) return ColumnType.Set;
    if (isDecimalArray(arr)) return ColumnType.Number;
    if (isCategoricalArray(arr)) return ColumnType.Categorical;
    return ColumnType.Number;
  } else {
    if (isCategoricalArray(arr)) return ColumnType.Categorical;
  }
  return ColumnType.Label;
}

function isNumericArray(arr: any[]) {
  return !arr.every(isNaN);
}

function isDecimalArray(arr: any[]) {
  return arr.some(i => i % 1 !== 0);
}

function isTextArray(arr: any[]) {
  return arr.some(isNaN);
}

function isSetArray(arr: any[]) {
  let uniqueVals = [...new Set(arr)];
  return uniqueVals.length > 0 && uniqueVals.length <= 2;
}

function isCategoricalArray(arr: any[]) {
  let uniqueVals = [...new Set(arr)];
  return uniqueVals.length > 0 && uniqueVals.length < 10;
}

function isSetList(arr: any[], seperator: string) {
  return arr.some(i => i.includes(seperator));
}

function updateDatasetInfoWithSets(
  data: DSVParsedArray<DSVRowString>,
  info: DatasetInfo,
  cdt: { [key: string]: ColumnType }
) {
  let sets = FilterWithIndices(data.columns, (d: string) => cdt[d] === 2);
  let attributes = FilterWithIndices(data.columns, (d: string) => cdt[d] !== 2);

  let consecutiveSets = sets.reduce(
    (resultArray: any, item: number, idx: number, arr: number[]) => {
      if (item !== undefined) {
        if (arr[idx - 1] === undefined || arr[idx - 1] + 1 !== item) {
          resultArray.push([]);
        }
        resultArray[resultArray.length - 1].push(item);
      }
      return resultArray;
    },
    []
  );

  info.sets = [];
  consecutiveSets.forEach((s: number[]) => {
    info.sets.push({
      format: "binary",
      start: s[0],
      end: s[s.length - 1]
    });
  });

  info.meta = [];
  attributes.forEach((attrIdx: number) => {
    let metaData: IMetaData = {
      type: "string",
      index: attrIdx,
      name: data.columns[attrIdx]
    };
    if (cdt[data.columns[attrIdx]] === ColumnType.Label) metaData.type = "id";
    let values = data.map(d => d[metaData.name]);
    if (isNumericArray(values)) {
      if (isDecimalArray(values.map(parseFloat))) {
        metaData.type = "float";
        metaData.min = d3.min(values.map(parseFloat));
        metaData.max = d3.max(values.map(parseFloat));
      } else {
        metaData.type = "integer";
        metaData.min = d3.min(values.map(parseInt));
        metaData.max = d3.max(values.map(parseInt));
      }
    }

    info.meta.push(metaData);
  });
  pubsub.emit("broadcast-dataset-info", info);
}

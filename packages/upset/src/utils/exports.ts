import { AccessibleData, Row, Rows, isRowAggregate } from "@visdesignlab/upset2-core";

export const exportState = (provenance: any, data?: any, rows?: Rows) => {
  const filename = `upset_state_${new Date().toJSON().slice(0,10)}`;
  let dataObj = provenance.getState();

  if (data && rows) {
    dataObj = {...dataObj, 'rawData': data, 'processedData': rows, 'accessibleProcessedData': getAccessibleData(rows)}
  } else if (data) {
    dataObj = {...dataObj, 'rawData': data}
  }

  const json = JSON.stringify(dataObj, null, 2);

  downloadJSON(filename, json);
}

export const exportRawData = (data: any) => {
    const filename = `upset_data_raw_${new Date().toJSON().slice(0,10)}`;
    const json = JSON.stringify(data, null, 2);
    downloadJSON(filename, json);
}

export const exportProcessedData = (rows: Rows, accessible?: boolean) => {
    const filename = `upset_data_${new Date().toJSON().slice(0,10)}`;
    let data: Rows | AccessibleData = (accessible) ? getAccessibleData(rows) : rows;

    const json = JSON.stringify(data, null, 2);

    downloadJSON(filename, json);
}

const downloadJSON = (filename: string, json: string) => {
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = filename + ".json";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}

const getAccessibleData = (rows: Rows) => {
    const data = {values:{}} as AccessibleData;
    Object.values(rows.values).forEach((r: Row) => {
        data['values'][r['id']] = {
            type: r['type'],
            size: r['size'],
            deviation: r['deviation'],
            attributes: r['attributes']
        }
        if (isRowAggregate(r)) {
            data['values'][r['id']]['items'] = getAccessibleData(r['items']).values;
        } else {
            data['values'][r['id']]['setMembership'] = r['setMembership'];
        }
    })

    return data;
}
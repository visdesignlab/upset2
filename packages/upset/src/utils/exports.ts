import { AccessibleData, Aggregate, Row, Rows, getDegreeFromSetMembership, isRowAggregate } from "@visdesignlab/upset2-core";

export const exportState = (provenance: any, data?: any, rows?: Rows) => {
  let filename = `upset_state_${new Date().toJSON().slice(0,10)}`;
  let dataObj = provenance.getState();

  if (data && rows) {
    dataObj = {...dataObj, 'rawData': data, 'processedData': rows, 'accessibleProcessedData': getAccessibleData(rows)};
    filename = `upset_state_data_${new Date().toJSON().slice(0,10)}`;
  } else if (data) {
    dataObj = {...dataObj, 'rawData': data};
    filename = `upset_state_raw_data_${new Date().toJSON().slice(0,10)}`;
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

export const getAccessibleData = (rows: Rows, includeId: boolean = false) => {
    const data = {values:{}} as AccessibleData;
    Object.values(rows.values).forEach((r: Row) => {
        // if the key is ONLY one set, the name should be "Just {set name}"
        // any key with more than one set should include "&" between the set names
        let elName = r['elementName'];
        let degree = getDegreeFromSetMembership(r['setMembership']);
        if (degree !== 1) {
            if (r.type === "Aggregate") {
                const r2 = r as Aggregate;
                if (r2.aggregateBy === "Overlaps") {
                    elName = elName.split(" - ").join(" & "); // overlaps look like "Adventure - Action", so replace the hyphen with " & "
                }
            } else {
                elName = elName.split(" ").join(" & ");
            }
        } else {
            elName = "Just " + elName;
        }

        data['values'][r['id']] = {
            elementName: elName,
            type: r['type'],
            size: r['size'],
            deviation: r['deviation'],
            attributes: r['attributes'],
            degree: degree,
        }

        if (includeId) {
            data['values'][r['id']].id = r['id'];
        }

        if (isRowAggregate(r)) {
            data['values'][r['id']]['items'] = getAccessibleData(r['items'], includeId).values;
        } else {
            data['values'][r['id']]['setMembership'] = r['setMembership'];
        }
    })

    return data;
}

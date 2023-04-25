import { firstAggregation, secondAggregation } from "./aggregate"
import { filterRows } from "./filter";
import { getSubsets } from "./process"
import { sortRows } from "./sort";
import { Row, Rows, Sets, UpsetConfig, areRowsAggregates, isRowAggregate } from "./types"

export const firstAggRR = (data: any, state: UpsetConfig) => {
    const subsets = getSubsets(data.items, data.sets, state.visibleSets, data.attributeColumns);
    return firstAggregation(
        subsets,
        state.firstAggregateBy,
        state.firstOverlapDegree,
        data.sets,
        data.items,
        data.attributeColumns
    )
}

export const secondAggRR = (data: any, state: UpsetConfig) => {
    const rr = firstAggRR(data, state);
    
    if (areRowsAggregates(rr)) {
        const secondAgg = secondAggregation(
            rr,
            state.secondAggregateBy,
            state.secondOverlapDegree,
            data.sets,
            data.items,
            data.attributeColumns
        );

        return secondAgg;
    }

    return rr;
}

export const sortByRR = (data: any, state: UpsetConfig) => {
    const vSets: Sets = Object.fromEntries(Object.entries(data.sets as Sets).filter(([name, _set]) => state.visibleSets.includes(name)));
    const rr = secondAggRR(data, state)

    return sortRows(rr, state.sortBy, state.sortVisibleBy, vSets);
}

export const filterRR = (data: any, state: UpsetConfig) => {
    const rr = sortByRR(data, state);

    return filterRows(rr, state.filters);
}

export const getRows = (data: any, state: UpsetConfig) => { return filterRR(data, state) }

export type RenderRow = {
    id: string;
    row: Row;
  };

const flattenRows = (
    rows: Rows,
    flattenedRows: RenderRow[] = [],
    idPrefix: string = '',
): RenderRow[] => {
    rows.order.forEach((rowId) => {
        const row = rows.values[rowId];
        idPrefix += row.id;
        flattenedRows.push({
          id: idPrefix,
          row,
        });
        if (isRowAggregate(row)) {
          flattenRows(row.items, flattenedRows, idPrefix);
        }
      });
    
      return flattenedRows;
}

export const flattenedRows = (data: any, state: UpsetConfig) => {
    const rows = getRows(data, state);

    return flattenRows(rows);
}

export const flattenedOnlyRows = (data: any, state: UpsetConfig) => {
    const rows = flattenedRows(data, state);
    const onlyRows: { [key: string]: Row } = {};

    rows.forEach(({ row }) => {
      onlyRows[row.id] = row;
    });

    return onlyRows;
}

export const rowsCount = (data: any, state: UpsetConfig) => {
    const rr = flattenedRows(data, state);
    return rr.length;
}

import { SubSet } from "./../DataStructure/SubSet";
import { BaseElement } from "./../DataStructure/BaseElement";
export type d3Selection = d3.Selection<
  d3.BaseType,
  any,
  HTMLElement | d3.BaseType,
  any
>;

export type d3Scale = d3.ScaleContinuousNumeric<any, any>;

export type RenderRow = { id: string; data: BaseElement };

export type AggregationFn = (data: RenderRow[]) => RenderRow[];

export type RawData = {
  rawSets: Array<Array<number>>;
  setNames: Array<string>;
  header: Array<string>;
};

import { SubSet } from "./../DataStructure/SubSet";
import { BaseElement } from "./../DataStructure/BaseElement";
export type d3Selection = d3.Selection<d3.BaseType, {}, HTMLElement, any>;

export type RenderRow = { id: string; data: BaseElement };

export type SecondLevelAggregate = { [key: string]: SubSet[] };

export type Agg = {
  [key: string]: SubSet[] | SecondLevelAggregate;
};

export type AggregationFn = (data: SubSet[]) => Agg;

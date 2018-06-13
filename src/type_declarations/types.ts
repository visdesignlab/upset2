import { SubSet } from "./../DataStructure/SubSet";
import { BaseElement } from "./../DataStructure/BaseElement";
export type d3Selection = d3.Selection<d3.BaseType, {}, HTMLElement, any>;

export type RenderRow = { id: string; data: BaseElement };

export type AggregationFn = (data: RenderRow[]) => RenderRow[];

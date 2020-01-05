import { DatasetInfo } from './DatasetInfo';
import { AggregationOptions } from './AggregationOptions';
import { SortingOptions } from './SortOptions';

export default interface UpsetState {
  dataset: DatasetInfo;
  firstAggregation: AggregationOptions;
  secondAggregation: AggregationOptions;
  sortBy: SortingOptions;
  hideEmpty: boolean;
  minDegree: number;
  maxDegree: number;
}

export const defaultState: UpsetState = {
  dataset: undefined as any,
  firstAggregation: 'None',
  secondAggregation: 'None',
  sortBy: 'Cardinality',
  hideEmpty: true,
  minDegree: 0,
  maxDegree: 3
};

import { DatasetInfo } from './DatasetInfo';
import { AggregationOptions } from './AggregationOptions';
import { SortingOptions } from './SortOptions';

export default interface UpsetState {
  dataset: DatasetInfo;
  firstAggregation: AggregationOptions;
  firstOverlap: number;
  secondAggregation: AggregationOptions;
  secondOverlap: number;
  sortBy: SortingOptions;
  sortBySetName: string;
  hideEmpty: boolean;
  minDegree: number;
  maxDegree: number;
}

export const defaultState: UpsetState = {
  dataset: undefined as any,
  firstAggregation: 'None',
  secondAggregation: 'None',
  sortBy: 'Cardinality',
  sortBySetName: '',
  hideEmpty: true,
  minDegree: 0,
  maxDegree: 3,
  firstOverlap: 2,
  secondOverlap: 2
};

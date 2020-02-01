import { DatasetInfo } from './DatasetInfo';
import { AggregationOptions } from './AggregationOptions';
import { SortingOptions } from './SortOptions';
import { AttributeVisualizationType } from '../Components/Main/Body/Attributes/VisualizationType';

export type VisibleAttributeState = { [key: string]: AttributeVisualizationType };

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
  visibleSets: string[];
  visibleAttributes: VisibleAttributeState;
}

export const defaultState: UpsetState = {
  dataset: undefined as any,
  firstAggregation: 'Degree',
  secondAggregation: 'Sets',
  sortBy: 'Cardinality',
  sortBySetName: '',
  hideEmpty: true,
  minDegree: 0,
  maxDegree: 3,
  firstOverlap: 2,
  secondOverlap: 2,
  visibleSets: [],
  visibleAttributes: {}
};

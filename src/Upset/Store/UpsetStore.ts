import { observable, computed } from 'mobx';
import { DatasetInfo } from '../Interfaces/DatasetInfo';
import { AggregationOptions } from '../Interfaces/AggregationOptions';
import { defaultState } from '../Interfaces/UpsetState';
import { SortingOptions } from '../Interfaces/SortOptions';

export class UpsetStore {
  @observable isAtRoot: boolean = true;
  @observable isAtLatest: boolean = true;
  @observable dataset: DatasetInfo = defaultState.dataset;
  @observable firstAggregation: AggregationOptions = defaultState.firstAggregation;
  @observable secondAggregation: AggregationOptions = defaultState.secondAggregation;
  @observable sortBy: SortingOptions = defaultState.sortBy;
  @observable sortBySetName: string = defaultState.sortBySetName;
  @observable hideEmpty: boolean = defaultState.hideEmpty;
  @observable firstOverlap: number = defaultState.firstOverlap;
  @observable secondOverlap: number = defaultState.secondOverlap;
  @observable minDegree: number = defaultState.minDegree;
  @observable maxDegree: number = defaultState.maxDegree;
  @observable visibleSets: string[] = defaultState.visibleSets;
  @computed get selectedDataset() {
    return this.dataset;
  }
}

const upsetStore = new UpsetStore();
export { upsetStore };

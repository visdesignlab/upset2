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
  @observable hideEmpty: boolean = defaultState.hideEmpty;
  @observable minDegree: number = defaultState.minDegree;
  @observable maxDegree: number = defaultState.maxDegree;
  @computed get selectedDataset() {
    return this.dataset;
  }
}

const upsetStore = new UpsetStore();
export { upsetStore };

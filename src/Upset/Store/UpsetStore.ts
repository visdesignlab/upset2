import { observable, computed, action } from 'mobx';
import { DatasetInfo } from '../Interfaces/DatasetInfo';
import { AggregationOptions } from '../Interfaces/AggregationOptions';
import { defaultState, VisibleAttributeState } from '../Interfaces/UpsetState';
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
  @observable visibleAttributes: VisibleAttributeState = defaultState.visibleAttributes;
  @computed get selectedDataset() {
    return this.dataset;
  }
  @action initialSetsAttributeSetter(sets: string[], attributes: VisibleAttributeState) {
    this.visibleSets = sets;
    this.visibleAttributes = attributes;
  }
}

const upsetStore = new UpsetStore();
export { upsetStore };

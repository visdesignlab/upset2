import { observable, computed } from 'mobx';
import { DatasetInfo } from '../Interfaces/DatasetInfo';

export class UpsetStore {
  @observable isAtRoot: boolean = true;
  @observable isAtLatest: boolean = true;
  @observable dataset: DatasetInfo = undefined as any;
  @computed get selectedDataset() {
    return this.dataset;
  }
}

const upsetStore = new UpsetStore();
export { upsetStore };

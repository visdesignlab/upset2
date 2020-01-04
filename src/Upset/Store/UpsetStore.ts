import { observable, computed } from 'mobx';

export class UpsetStore {
  @observable isAtRoot: boolean = true;
  @observable isAtLatest: boolean = true;
  @observable dataset: string = '';
}

const upsetStore = new UpsetStore();
export { upsetStore };

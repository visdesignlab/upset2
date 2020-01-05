import { DatasetInfo } from './DatasetInfo';

export default interface UpsetState {
  dataset: DatasetInfo;
}

export const defaultState: UpsetState = {
  dataset: undefined as any
};

import {Application, ViewModelBase} from 'provenance_mvvm_framework';
import {DatasetSelectionView} from './DatasetSelectionView';

export class DatasetSelectionViewModel extends ViewModelBase {
  constructor(view: DatasetSelectionView, app: Application) {
    super(view, app);
    this.App.on('open-dataset-selection', this.update, this);
  }

  update() {
    this.comm.emit('open-dataset-selection');
  }
}

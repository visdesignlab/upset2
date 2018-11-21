import * as d3 from 'd3';
import {ViewBase} from 'provenance_mvvm_framework';
import html from './dataset.selection.modal.view.html';
import {d3Selection} from '../type_declarations/types';
import {CreateFileUploadView} from '../lib/dsv_importer/src/app/app';

export class DatasetSelectionView extends ViewBase {
  modal: d3Selection;
  constructor(root: HTMLElement) {
    super(root);
    let modalDiv = d3
      .select(root)
      .append('div')
      .html(html);
    this.modal = modalDiv.select('#dataset-modal');

    this.comm.on('open-dataset-selection', this.update, this);
  }

  setup() {}

  create() {}

  update() {
    this.modal.classed('is-active', true);
    CreateFileUploadView(this.modal.select('.modal-content'));
  }
}

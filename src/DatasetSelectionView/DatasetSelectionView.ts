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
    this.setup();
  }

  setup() {
    this.comm.on('open-dataset-selection', this.update, this);
    this.modal.select('.modal-close').on('click', () => {
      this.modal.classed('is-active', false);
    });
  }

  create() {}

  update() {
    this.modal.select('.modal-content').html('');
    this.modal.classed('is-active', true);
    CreateFileUploadView(this.modal.select('.modal-content'));
  }
}

import * as d3 from 'd3';
import {ViewBase} from 'provenance_mvvm_framework';
import modalHtml from './dataset.selection.modal.view.html';
import {d3Selection} from '../type_declarations/types';
import {CreateFileUploadView} from '../lib/dsv_importer/src/app/app';
import listHtml from './dataset.list.view.html';
import datasetCardHtml from './dataset.info.view.html';
import {serverUrl} from '../app/app';
import {DataUtils} from '../DataStructure/DataUtils';

export class DatasetSelectionView extends ViewBase {
  modal: d3Selection;
  modalContent: d3Selection;
  constructor(root: HTMLElement) {
    super(root);
    let modalDiv = d3
      .select(root)
      .append('div')
      .html(modalHtml);
    this.modal = modalDiv.select('#dataset-modal');
    this.modalContent = modalDiv.select('.modal-content');
    this.setup();
  }

  setup() {
    this.comm.on('open-dataset-selection', this.update, this);
    this.modal.select('.modal-close').on('click', () => {
      this.modal.classed('is-active', false);
    });
  }

  createUploadView() {
    this.modalContent.html('');
    CreateFileUploadView(this.modalContent);
  }

  update() {
    this.modal.classed('is-active', true);
    this.modalContent.html('');
    this.modalContent.html(listHtml);
    this.modal
      .select('#upload-new-dataset')
      .on('click', this.createUploadView.bind(this));
    let list = this.modalContent.select('#list');
    d3.json(`${serverUrl}/datasets`).then(({datasets}) => {
      let res = datasets;
      let that = this;

      let pres = list.selectAll('.box').data(res);
      pres.exit().remove();
      pres = pres
        .enter()
        .append('div')
        .classed('box', true)
        .merge(pres);
      pres.each(function(d: any) {
        let el = d3.select(this);
        el.html('');
        el.html(datasetCardHtml);
        el.select('#dataset-name').text(d.name);
        el.select('#dataset-username').text(d.username);
        el.select('#dataset-description').text(d.description);
        el.select('#upload-date').text(
          new Date(parseInt(d.date)).toDateString(),
        );
        el.style('cursor', 'pointer');
        el.on('click', () => {
          console.log('Test');
          that.comm.emit(
            'change-dataset-trigger',
            DataUtils.getDataSetInfo(d, false),
          );
        });
      });
    });
    // CreateFileUploadView(this.modal.select('.modal-content'));
  }
}

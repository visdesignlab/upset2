/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:08
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-10-09 16:10:33
 */
import * as d3 from 'd3';
import 'popper.js';
import {Application} from 'provenance_mvvm_framework';
import {DataSetInfoView} from '../DataSetInfoView/DataSetInfoView';
import {DataSetInfoViewModel} from '../DataSetInfoView/DataSetInfoViewModel';
import {DataUtils} from '../DataStructure/DataUtils';
import {EmbedGenView} from '../EmbedGenView/EmbedGenView';
import {FilterBoxView} from '../FilterBoxView/FilterBoxView';
import {FilterBoxViewModel} from '../FilterBoxView/FilterBoxViewModel';
import {NavBarView} from '../NavBarView/NavBarView';
import {NavBarViewModel} from '../NavBarView/NavBarViewModel';
import {ProvenanceView} from '../ProvenanceView/ProvenanceView';
import {ProvenanceViewModel} from '../ProvenanceView/ProvenanceViewModel';
import {UnusedSetView} from '../UnusedSetsView/UnusedSetView';
import {UpsetView} from '../UpsetView/UpsetView';
import {EmbedConfig} from './../DataStructure/EmbedConfig';
import {d3Selection} from './../type_declarations/types';
import {UnusedSetViewModel} from './../UnusedSetsView/UnusedSetViewModel';
import {UpsetViewModel} from './../UpsetView/UpsetViewModel';
import './styles.scss';
import {ElementViewModel} from '../ElementView/ElementViewModel';
import {ElementView} from '../ElementView/ElementView';
import {DatasetSelectionViewModel} from '../DatasetSelectionView/DatasetSelectionViewModel';
import {DatasetSelectionView} from '../DatasetSelectionView/DatasetSelectionView';
import {saveAs} from 'file-saver';

export const serverUrl: string = 'http://18.224.248.42:4040';

function run() {
  let application = new Application('Upset2.0', '1.0.0');
  DataUtils.app = application;
  DataUtils.app.on('change-dataset', DataUtils.processDataSet);

  DataUtils.app.on('download-data', (data: number[]) => {
    let rawData: any[] = DataUtils.data;
    let headers = DataUtils.data.columns;
    let saveText: string[] = [];
    saveText.push(headers.join(DataUtils.datasetDesc.separator));

    let filteredData = DataUtils.data.filter(
      (_: any, i: number) => data.indexOf(i) > -1,
    );
    filteredData.forEach((_: any) => {
      let row: string[] = [];
      headers.forEach((h: string) => {
        row.push(_[h]);
      });
      saveText.push(row.join(DataUtils.datasetDesc.separator));
    });

    let blob = new Blob([saveText.join('\n')]);
    saveAs(blob, `${DataUtils.datasetDesc.name}.csv`);
  });

  if (sessionStorage['provenance-graph']) {
    application.graph = JSON.parse(sessionStorage['provenance-graph']);
    application.registry = JSON.parse(sessionStorage['provenance-registry']);
  }

  new DatasetSelectionViewModel(
    new DatasetSelectionView(d3.select('body').node() as HTMLElement),
    application,
  );

  new DataSetInfoViewModel(
    new DataSetInfoView(d3.select('#dataset-info-box').node() as HTMLElement),
    application,
  );

  new NavBarViewModel(
    new NavBarView(d3.select('#navigation-bar').node() as HTMLElement),
    application,
    'data/datasets.json',
  );

  new FilterBoxViewModel(
    new FilterBoxView(d3.select('#filter-box').node() as HTMLElement),
    application,
  );

  new ProvenanceViewModel(
    new ProvenanceView(d3.select('.provenance-view').node() as HTMLElement),
    application,
  );

  let isIFrame = window.self !== window.top;
  let ec: EmbedConfig = null;

  if (!isIFrame) {
    EmbedGenView(d3.select('#embed-modal'));
  } else {
    ec = renderIFrame();
  }

  new UpsetViewModel(
    new UpsetView(d3.select('#mid-bar').node() as HTMLElement, ec),
    application,
  );

  new UnusedSetViewModel(
    new UnusedSetView(d3.select('#vis').node() as HTMLElement),
    application,
  );

  new ElementViewModel(
    new ElementView(d3.select('#right-side-bar').node() as HTMLElement),
    application,
  );

  // Enable bulma extensions
}

run();

function renderIFrame(): EmbedConfig {
  let ec = JSON.parse(unescape(window.location.hash.replace('#', '')));

  if (!ec.NavBar) d3.select('#navigation-bar').style('display', 'none');
  if (!ec.FilterBox) d3.select('#filter-box').style('display', 'none');
  if (!ec.DataSetInfo) d3.select('#dataset-info-box').style('display', 'none');
  if (!ec.LeftSideBar) d3.select('#left-side-bar').style('display', 'none');
  if (!ec.RightSideBar) d3.select('#right-side-bar').style('display', 'none');
  if (!ec.ProvenanceView)
    d3.select('.provenance-view').style('display', 'none');

  return ec;
}

function getEmbedConfig(iframe: d3Selection): EmbedConfig {
  return JSON.parse(iframe.attr('data'));
}

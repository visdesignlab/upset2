import {serverUrl} from './../app/app';
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:38:33
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-16 11:15:54
 */
import {ViewModelBase, Application} from 'provenance_mvvm_framework';
import {DataUtils} from './../DataStructure/DataUtils';
import {IDataSetInfo} from './../DataStructure/IDataSetInfo';
import {IDataSetJSON} from './../DataStructure/IDataSetJSON';
import {NavBarView} from './NavBarView';
import './styles.scss';
export class NavBarViewModel extends ViewModelBase {
  public datasets: IDataSetInfo[] = [];
  constructor(view: NavBarView, app: Application, dsLocation: string) {
    super(view, app);
    this.populateDatasetSelector(dsLocation);
    this.populateDatasetSelectorFromServer();

    this.comm.on('load-data', () => {
      this.App.emit('open-dataset-selection');
    });
    this.comm.on('change-dataset', dataset => {
      view.oldDataset = dataset;
      this.App.emit('change-dataset', dataset);
    });

    this.App.on('change-dataset-trigger', d => {
      this.comm.emit('change-dataset-trigger', d);
    });

    this.comm.on('change-dataset-trigger', (d: any) => {
      let _do = {
        func: (d: any) => {
          this.comm.emit('change-dataset', d);
        },
        args: [d],
      };
      let _undo = {
        func: (d: any) => {
          this.comm.emit('change-dataset', d);
        },
        args: [view.oldDataset],
      };
      this.apply.call(this, ['change-dataset', _do, _undo]);
    });

    this.registerFunctions(
      'change-dataset',
      (d: any) => {
        this.comm.emit('change-dataset', d);
      },
      this,
    );

    this.registerFunctions(
      'change-dataset',
      (d: any) => {
        this.comm.emit('change-dataset', d);
      },
      this,
      false,
    );
  }

  populateDatasetSelectorFromServer() {
    let results: Promise<any>[] = [];
    console.log(`${serverUrl}/download/list`);
    let p = fetch(`${serverUrl}/download/list`)
      .then(results => results.json())
      .then(jsondata => {
        jsondata.forEach((d: any) => {
          results.push(d.info);
        });
      })
      .then(() => {
        results.forEach(j => {
          let a: IDataSetJSON = DataUtils.getDataSetJSON(j);
          a.file = `${serverUrl}/download/single/${a.file}`;
          this.datasets.push(DataUtils.getDataSetInfo(a));
        });
      })
      .then(() => {
        this.comm.emit('update', this.datasets);
      });
  }

  populateDatasetSelector(dsLocation: string) {
    let results: Promise<any>[] = [];
    let p = fetch(dsLocation)
      .then(results => results.json())
      .then(jsondata => {
        jsondata.forEach((d: string) => {
          let a = fetch(d).then(res => res.json());
          results.push(a);
        });
      })
      .then(() => {
        Promise.all(results)
          .then(d => {
            d.forEach(j => {
              let a: IDataSetJSON = DataUtils.getDataSetJSON(j);
              this.datasets.push(DataUtils.getDataSetInfo(a));
            });
          })
          .then(() => {
            this.comm.emit('update', this.datasets);
          });
      });
  }
}

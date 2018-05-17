import {ViewModelBase} from 'mvvm_ts_fwork/dist'
import {NavBarView} from './NavBarView';
import {IDataSetInfo, IDataSetJSON} from '../Data'
import {Data} from '../Data';

export class NavBarViewModel extends ViewModelBase {
    public datasets : IDataSetInfo[] = [];
    constructor(view: NavBarView){
        super(view);
        this.on('set-dataset', Data.setDataSet);
        (<NavBarView>this.View).create();
    } 
    
    populateDatasetSelector() {
        fetch('data/datasets.json')
            .then(results => results.json())
            .then((jsondata) => {
                jsondata.forEach( (d :string) =>{
                         fetch(d)
                        .then(res => res.json())
                        .then( resjson => {
                            let dataSetJSON : IDataSetJSON = Data.getDataSetJSON(resjson);
                            this.datasets.push(Data.getDataSetInfo(dataSetJSON));
                            (<NavBarView>this.View).update()
                        })
                    });
            });
         
    }
}
import {NavBarViewModel} from './NavBarView/NavBarViewModel';
import {NavBarView} from './NavBarView/NavBarView';
import * as d3 from 'd3';

let navbar = new NavBarViewModel(new NavBarView(<HTMLElement>d3.select('#top-bar').node()));
navbar.populateDatasetSelector();
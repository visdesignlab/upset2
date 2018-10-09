/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/app/app.ts","vendors~app"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/EmbedGenView/styles.scss":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader!./node_modules/postcss-loader/lib??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/EmbedGenView/styles.scss ***!
  \***********************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/FilterBoxView/styles.scss":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader!./node_modules/postcss-loader/lib??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/FilterBoxView/styles.scss ***!
  \************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/NavBarView/styles.scss":
/*!*********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader!./node_modules/postcss-loader/lib??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/NavBarView/styles.scss ***!
  \*********************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/ProvenanceView/styles.scss":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader!./node_modules/postcss-loader/lib??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/ProvenanceView/styles.scss ***!
  \*************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/UnusedSetsView/style.scss":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader!./node_modules/postcss-loader/lib??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/UnusedSetsView/style.scss ***!
  \************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/UpsetView/styles.scss":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader!./node_modules/postcss-loader/lib??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/UpsetView/styles.scss ***!
  \********************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/app/styles.scss":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader!./node_modules/postcss-loader/lib??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/app/styles.scss ***!
  \**************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/DataSetInfoView/DataSetInfoView.ts":
/*!************************************************!*\
  !*** ./src/DataSetInfoView/DataSetInfoView.ts ***!
  \************************************************/
/*! exports provided: DataSetInfoView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataSetInfoView", function() { return DataSetInfoView; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__);
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:24
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-05 18:26:24
 */


class DataSetInfoView extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__["ViewBase"] {
    constructor(root) {
        super(root);
    }
    setup() { }
    create() {
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root)
            .style("padding", "5px")
            .append("div")
            .style("padding", "10px")
            .style("border-radius", "5px")
            .style("background-color", "rgba(0,0,0,0.7)")
            .style("color", "#FFF")
            .style("overflow-wrap", "break-word");
    }
    update(data) {
        let box = d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#dataset-info-box").select("div");
        box.html("");
        box
            .append("div")
            .text("Dataset Information")
            .style("font-weight", "bold");
        box
            .append("div")
            .append("span")
            .text("Name: ")
            .style("font-weight", "bold")
            .select(function () {
            return this.parentNode;
        })
            .append("span")
            .text(`${data.Name}`);
        box
            .append("div")
            .append("span")
            .text("# Sets: ")
            .style("font-weight", "bold")
            .select(function () {
            return this.parentNode;
        })
            .append("span")
            .text(`${data.SetCount}`);
        box
            .append("div")
            .append("span")
            .text("# Attributes: ")
            .style("font-weight", "bold")
            .select(function () {
            return this.parentNode;
        })
            .append("span")
            .text(`${data.AttributeCount}`);
        box
            .append("div")
            .append("span")
            .text("Author: ")
            .style("font-weight", "bold")
            .select(function () {
            return this.parentNode;
        })
            .append("span")
            .text(`${data._data.author}`);
        box
            .append("div")
            .append("span")
            .text("Description: ")
            .style("font-weight", "bold")
            .select(function () {
            return this.parentNode;
        })
            .append("span")
            .text(`${data._data.description}`);
        box
            .append("div")
            .append("span")
            .text("Source: ")
            .style("font-weight", "bold")
            .select(function () {
            return this.parentNode;
        })
            .append("a")
            .attr("href", data._data.source)
            .text(`${data._data.source}`);
    }
}


/***/ }),

/***/ "./src/DataSetInfoView/DataSetInfoViewModel.ts":
/*!*****************************************************!*\
  !*** ./src/DataSetInfoView/DataSetInfoViewModel.ts ***!
  \*****************************************************/
/*! exports provided: DataSetInfoViewModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataSetInfoViewModel", function() { return DataSetInfoViewModel; });
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__);
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:29
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-08 15:33:52
 */

class DataSetInfoViewModel extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__["ViewModelBase"] {
    constructor(view, app) {
        super(view, app);
        this.datasets = [];
        this.App.on("change-dataset", this.update, this);
    }
    update(dataset) {
        this.comm.emit("update", dataset);
    }
}


/***/ }),

/***/ "./src/DataStructure/Aggregate.ts":
/*!****************************************!*\
  !*** ./src/DataStructure/Aggregate.ts ***!
  \****************************************/
/*! exports provided: Aggregate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Aggregate", function() { return Aggregate; });
/* harmony import */ var _BaseElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseElement */ "./src/DataStructure/BaseElement.ts");
/* harmony import */ var _RowType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RowType */ "./src/DataStructure/RowType.ts");


class Aggregate extends _BaseElement__WEBPACK_IMPORTED_MODULE_0__["BaseElement"] {
    constructor(aggregateId, aggregateName, level) {
        super(aggregateId, aggregateName);
        this.type = _RowType__WEBPACK_IMPORTED_MODULE_1__["RowType"].AGGREGATE;
        this.subSets = [];
        this.isCollapsed = true;
        this.level = level;
        this.expectedProb = 0;
        this.disproportionality = 0;
    }
    addSubSet(subSet) {
        this.subSets.push(subSet);
        this.items = this.items.concat(subSet.items);
        this.setSize += subSet.setSize;
        this.expectedProb += subSet.expectedProb;
        this.disproportionality += subSet.disproportionality;
    }
}


/***/ }),

/***/ "./src/DataStructure/AggregateAndFilters.ts":
/*!**************************************************!*\
  !*** ./src/DataStructure/AggregateAndFilters.ts ***!
  \**************************************************/
/*! exports provided: RenderConfig, AggregateBy, SortBy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderConfig", function() { return RenderConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AggregateBy", function() { return AggregateBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SortBy", function() { return SortBy; });
class RenderConfig {
    constructor() {
        this.firstLevelAggregateBy = AggregateBy.NONE;
        this.firstOverlap = 2;
        this.secondLevelAggregateBy = AggregateBy.NONE;
        this.secondOverlap = 2;
        this.sortBy = SortBy.CARDINALITY;
        this.collapseAll = false;
        this.hideEmptyIntersection = true;
        this.minDegree = 0;
        this.maxDegree = 3;
    }
    static getSortBySetConfig(id) {
        let rc = new RenderConfig();
        rc.firstLevelAggregateBy = AggregateBy.NONE;
        rc.secondLevelAggregateBy = AggregateBy.NONE;
        rc.sortBy = SortBy.SET;
        rc.sortBySetid = id;
        return rc;
    }
}
var AggregateBy;
(function (AggregateBy) {
    AggregateBy["DEGREE"] = "DEGREE";
    AggregateBy["SETS"] = "SETS";
    AggregateBy["DEVIATION"] = "DEVIATION";
    AggregateBy["OVERLAPS"] = "OVERLAPS";
    AggregateBy["NONE"] = "NONE";
})(AggregateBy || (AggregateBy = {}));
var SortBy;
(function (SortBy) {
    SortBy["DEGREE"] = "DEGREE";
    SortBy["CARDINALITY"] = "CARDINALITY";
    SortBy["DEVIATION"] = "DEVIATION";
    SortBy["SET"] = "SET";
})(SortBy || (SortBy = {}));


/***/ }),

/***/ "./src/DataStructure/AggregationStrategy.ts":
/*!**************************************************!*\
  !*** ./src/DataStructure/AggregationStrategy.ts ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Group */ "./src/DataStructure/Group.ts");
/* harmony import */ var _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AggregateAndFilters */ "./src/DataStructure/AggregateAndFilters.ts");


let AggregationStrategy = {};
AggregationStrategy[_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__["AggregateBy"].DEGREE] = aggregateByDegree;
AggregationStrategy[_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__["AggregateBy"].SETS] = aggregateBySets;
AggregationStrategy[_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__["AggregateBy"].DEVIATION] = aggregateByDeviation;
AggregationStrategy[_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__["AggregateBy"].OVERLAPS] = aggregateByOverlap;
/* harmony default export */ __webpack_exports__["default"] = (AggregationStrategy);
// Functions
function aggregateByDegree(data, overlap, level, setNameDictionary) {
    let groups = data.reduce((groups, item) => {
        let val = item.data.noCombinedSets;
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups;
    }, {});
    let rr = [];
    for (let group in groups) {
        let g = new _Group__WEBPACK_IMPORTED_MODULE_0__["Group"](`Group_Deg_${group}`, `Degree ${group}`, level);
        rr.push({ id: g.id.toString(), data: g });
        let subsets = groups[group];
        subsets.forEach(subset => {
            g.addSubSet(subset.data);
            rr.push({ id: subset.id.toString(), data: subset.data });
        });
    }
    return rr;
}
function aggregateByDeviation(data, overlap, level, setNameDictionary) {
    let groups = data.reduce((groups, item) => {
        let val = item.data.disproportionality;
        if (val >= 0) {
            groups["Positive"] = groups["Positive"] || [];
            groups["Positive"].push(item);
        }
        else {
            groups["Negative"] = groups["Negative"] || [];
            groups["Negative"].push(item);
        }
        return groups;
    }, {});
    let rr = [];
    for (let group in groups) {
        let g = new _Group__WEBPACK_IMPORTED_MODULE_0__["Group"](`${group}_Expected_Value`, `${group} Expected Value`, level);
        rr.push({ id: g.id.toString(), data: g });
        let subsets = groups[group];
        subsets.forEach(subset => {
            g.addSubSet(subset.data);
            rr.push({ id: subset.id.toString(), data: subset.data });
        });
    }
    return rr;
}
function aggregateByOverlap(data, overlap, level, setNameDictionary) {
    let combinations = data
        .filter(d => {
        return (d.data.noCombinedSets.toString() === overlap.toString());
    })
        .map(d => {
        return {
            name: d.data.elementName,
            idx: d.data.combinedSets
                .map((v, i) => [i, v === 1])
                .filter(v => v[1])
                .map(v => v[0])
        };
    });
    data = data.filter(d => {
        return d.data.noCombinedSets >= overlap;
    });
    let groups = data.reduce((groups, item) => {
        let idx = item.data.combinedSets;
        let matches = combinations.filter(c => {
            let match = true;
            c.idx.forEach(i => {
                if (idx[i] === 0)
                    match = false;
            });
            return match;
        });
        matches.forEach(m => {
            groups[m.name] = groups[m.name] || [];
            groups[m.name].push(item);
        });
        return groups;
    }, {});
    let rr = [];
    for (let group in groups) {
        let g = new _Group__WEBPACK_IMPORTED_MODULE_0__["Group"](group, group, level);
        rr.push({ id: g.id.toString(), data: g });
        let subsets = groups[group];
        subsets.forEach(subset => {
            g.addSubSet(subset.data);
            rr.push({ id: subset.id.toString(), data: subset.data });
        });
    }
    return rr;
}
function aggregateBySets(data, overlap, level, setNameDictionary) {
    let subSetNames = setNameDictionary;
    let groups = data.reduce((groups, item) => {
        let val = item.data.combinedSets;
        let vals = [];
        val.forEach((d, i) => {
            if (d === 1) {
                vals.push(i);
            }
        });
        vals.forEach(val => {
            groups[subSetNames[val]] = groups[subSetNames[val]] || [];
            groups[subSetNames[val]].push(item);
        });
        return groups;
    }, {});
    let rr = [];
    for (let group in groups) {
        let g = new _Group__WEBPACK_IMPORTED_MODULE_0__["Group"](`Group_Set_${group.replace(" ", "_")}`, `Set: ${group}`, level);
        rr.push({ id: g.id.toString(), data: g });
        let subsets = groups[group];
        subsets.forEach(subset => {
            g.addSubSet(subset.data);
            rr.push({ id: subset.id.toString(), data: subset.data });
        });
    }
    return rr;
}


/***/ }),

/***/ "./src/DataStructure/BaseElement.ts":
/*!******************************************!*\
  !*** ./src/DataStructure/BaseElement.ts ***!
  \******************************************/
/*! exports provided: BaseElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseElement", function() { return BaseElement; });
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 16:44:35
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-18 11:40:02
 */
/**
 * * Base element for all rows(sets, groups, subsets and aggregates)
 *
 * @export
 * @class BaseElement
 */
class BaseElement {
    /**
     * Creates an instance of BaseElement.
     * @param {number} id
     * @param {string} elementName
     * @memberof BaseElement
     */
    constructor(id, elementName) {
        this.id = id;
        this.elementName = elementName;
        this.items = [];
        this.setSize = 0;
        this.dataRatio = 0.0;
    }
}


/***/ }),

/***/ "./src/DataStructure/BaseSet.ts":
/*!**************************************!*\
  !*** ./src/DataStructure/BaseSet.ts ***!
  \**************************************/
/*! exports provided: BaseSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseSet", function() { return BaseSet; });
/* harmony import */ var _BaseElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseElement */ "./src/DataStructure/BaseElement.ts");
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 16:44:40
 * @Last Modified by:   Kiran Gadhave
 * @Last Modified time: 2018-06-03 16:44:40
 */

/**
 * Base class for Sets, subsets and groups
 *
 * @export
 * @class BaseSet
 * @extends {BaseElement}
 */
class BaseSet extends _BaseElement__WEBPACK_IMPORTED_MODULE_0__["BaseElement"] {
    /**
     *Creates an instance of BaseSet.
     * @param {number} setId
     * @param {string} setName
     * @param {number[]} combinedSets
     * @param {number[]} setData
     * @memberof BaseSet
     */
    constructor(setId, setName, combinedSets, setData, depth = 0) {
        super(setId, setName);
        this.combinedSets = combinedSets;
        this.noCombinedSets = 0;
        this.depth = depth;
        for (let i = 0; i < this.combinedSets.length; ++i) {
            if (this.combinedSets[i] !== 0) {
                this.noCombinedSets++;
            }
        }
        for (let i = 0; i < setData.length; ++i) {
            this.items.push(setData[i]);
            this.setSize++;
        }
        this.dataRatio = this.setSize / this.depth;
    }
    getSimilarityScore(set, index) {
        let intersection = [...new Set(set.items)].filter(x => new Set(this.items).has(x)).length;
        return index(intersection, this.items.length, set.items.length);
    }
}


/***/ }),

/***/ "./src/DataStructure/Data.ts":
/*!***********************************!*\
  !*** ./src/DataStructure/Data.ts ***!
  \***********************************/
/*! exports provided: Data */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Data", function() { return Data; });
/* harmony import */ var _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AggregateAndFilters */ "./src/DataStructure/AggregateAndFilters.ts");
/* harmony import */ var _AggregationStrategy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AggregationStrategy */ "./src/DataStructure/AggregationStrategy.ts");
/* harmony import */ var _Set__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Set */ "./src/DataStructure/Set.ts");
/* harmony import */ var _SortingStrategy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SortingStrategy */ "./src/DataStructure/SortingStrategy.ts");
/* harmony import */ var _SubSet__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SubSet */ "./src/DataStructure/SubSet.ts");
/* harmony import */ var _RowType__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./RowType */ "./src/DataStructure/RowType.ts");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







class Data {
    constructor(app) {
        this.sets = [];
        this.usedSets = [];
        this.renderRows = [];
        this.subSets = [];
        this.attributes = [];
        this.selectedAttributes = [];
        this.combinations = 0;
        this.allItems = [];
        this.depth = 0;
        this.noDefaultSets = 6;
        this.unusedSets = [];
        this.app = app;
        this.renderConfig = new _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["RenderConfig"]();
        this.app.on("filter-changed", (rc) => {
            this.setupRenderRows(rc);
        });
        this.app.on("add-set", this.addSet, this);
        this.app.on("remove-set", this.removeSet, this);
    }
    get maxCardinality() {
        return Math.max(...this.renderRows.map(d => d.data.setSize));
    }
    get setNameDictionary() {
        return this.usedSets.reduce((map, object, idx) => {
            map[idx] = object.elementName;
            return map;
        }, {});
    }
    load(data, dataSetDesc) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getRawData(data, dataSetDesc).then(rawData => {
                this.getSets(rawData);
                this.getAttributes(data, rawData, dataSetDesc);
                this.setUpSubSets();
                this.setupRenderRows(JSON.parse(sessionStorage["render_config"]));
            });
            return new Promise((res, rej) => {
                res(this);
            });
        });
    }
    get setIdToSet() {
        let a = {};
        for (let i = 0; i < this.sets.length; ++i) {
            a[this.sets[i].id] = this.sets[i];
        }
        return a;
    }
    createSignature(listOfUsedSets, listOfSets) {
        return listOfUsedSets
            .map(sets => {
            return listOfSets.indexOf(sets) > -1 ? 1 : 0;
        })
            .join("");
    }
    setUpSubSets() {
        this.combinations = Math.pow(2, this.usedSets.length) - 1;
        this.subSets = [];
        let aggregateIntersection = {};
        let listOfUsedSets = this.usedSets.map(set => set.id);
        let setsAttribute = this.attributes.filter(attr => {
            return attr.type === "sets";
        })[0];
        let signature = "";
        setsAttribute.values.forEach((listOfSets, idx) => {
            signature = this.createSignature(listOfUsedSets, listOfSets);
            if (aggregateIntersection[signature] == null) {
                aggregateIntersection[signature] = [idx];
            }
            else {
                aggregateIntersection[signature].push(idx);
            }
        });
        let tempBitMask = 0;
        let usedSetLength = this.usedSets.length;
        let combinedSetsFlat = "";
        let actualBit = -1;
        let names = [];
        if (false) {}
        else {
            for (let bitMask = 0; bitMask <= this.combinations; ++bitMask) {
                tempBitMask = bitMask;
                let card = 0;
                let combinedSets = Array.apply(null, new Array(usedSetLength))
                    .map(() => {
                    actualBit = tempBitMask % 2;
                    tempBitMask = (tempBitMask - actualBit) / 2;
                    card == actualBit;
                    return +actualBit;
                })
                    .reverse();
                combinedSetsFlat = combinedSets.join("");
                // Test if needed
                // if (card > this.maxCardinality) continue;
                // if (card < this.maxCardinality) continue;
                names = [];
                let expectedValue = 1;
                let notExpectedValue = 1;
                combinedSets.forEach((d, i) => {
                    if (d === 1) {
                        names.push(this.usedSets[i].elementName);
                        expectedValue = expectedValue * this.usedSets[i].dataRatio;
                    }
                    else {
                        notExpectedValue =
                            notExpectedValue * (1 - this.usedSets[i].dataRatio);
                    }
                });
                expectedValue *= notExpectedValue;
                let list = aggregateIntersection[combinedSetsFlat];
                if (list == null) {
                    list = [];
                }
                let name = "";
                names = names.map(n => n.replace(" ", "_"));
                if (names.length > 0)
                    name = names.reverse().join(" ") + "";
                if (name === "") {
                    name = "UNINCLUDED";
                }
                let subset = new _SubSet__WEBPACK_IMPORTED_MODULE_4__["SubSet"](bitMask, name, combinedSets, list, expectedValue, this.depth);
                this.subSets.push(subset);
            }
        }
        aggregateIntersection = {};
    }
    getAttributes(data, rawData, dataSetDesc) {
        this.attributes.length = 0;
        for (let i = 0; i < dataSetDesc.meta.length; ++i) {
            let metaDefinition = dataSetDesc.meta[i];
            this.attributes.push({
                name: metaDefinition.name || rawData.header[metaDefinition.index],
                type: metaDefinition.type,
                values: [],
                sort: 1
            });
        }
        //  Implicit Attributes
        // Set Count attribute
        let setCountAttribute = {
            name: "Set Count",
            type: "integer",
            values: [],
            sort: 1,
            min: 0
        };
        for (let d = 0; d < this.depth; ++d) {
            let setCount = 0;
            for (let s = 0; s < rawData.rawSets.length; ++s) {
                setCount += rawData.rawSets[s][d];
            }
            setCountAttribute.values[d] = setCount;
        }
        this.attributes.push(setCountAttribute);
        // Set Attribute
        let setAttribute = {
            name: "Sets",
            type: "sets",
            values: [],
            sort: 1
        };
        for (let i = 0; i < this.depth; ++i) {
            let setList = [];
            for (let s = 0; s < rawData.rawSets.length; ++s) {
                if (rawData.rawSets[s][i] === 1) {
                    setList.push(this.sets[s].id);
                }
            }
            setAttribute.values[i] = setList;
        }
        this.attributes.push(setAttribute);
        //  Load MetaData
        for (let i = 0; i < dataSetDesc.meta.length; ++i) {
            let metaDefinition = dataSetDesc.meta[i];
            this.attributes[i].values = data.map((row, row_idx) => {
                let val = Object.values(row)[metaDefinition.index];
                switch (metaDefinition.type) {
                    case "integer": {
                        let intVal = parseInt(val, 10);
                        if (isNaN(intVal)) {
                            console.error(`Cannot parse ${val} to integer`);
                            return NaN;
                        }
                        return intVal;
                    }
                    case "float": {
                        let floatVal = parseFloat(val);
                        if (isNaN(floatVal)) {
                            console.error(`Cannot parse ${val} to integer`);
                            return NaN;
                        }
                        return floatVal;
                    }
                    case "id":
                    case "string":
                    default:
                        return val;
                }
            });
        }
        let max;
        for (let i = 0; i < this.attributes.length; ++i) {
            if (this.attributes[i].type === "float" ||
                this.attributes[i].type === "integer") {
                if (i < dataSetDesc.meta.length) {
                    this.attributes[i].min =
                        dataSetDesc.meta[i].min ||
                            Math.min.apply(null, this.attributes[i].values);
                    this.attributes[i].max =
                        dataSetDesc.meta[i].max ||
                            Math.max.apply(null, this.attributes[i].values);
                }
                else {
                    this.attributes[i].min =
                        this.attributes[i].min ||
                            Math.min.apply(null, this.attributes[i].values);
                    this.attributes[i].max =
                        this.attributes[i].max ||
                            Math.max.apply(null, this.attributes[i].values);
                }
            }
        }
        // this.maxCardinality = this.attributes[this.attributes.length - 2].max;
        // // hackthis.renderConfig
        // if (isNaN(this.maxCardinality)) {
        //   this.maxCardinality = this.sets.length;
        // }
    }
    /**
     *
     *
     * @param {RawData} data
     * @memberof Data
     */
    getSets(data) {
        let setPrefix = "S_";
        for (let i = 0; i < data.setNames.length; ++i) {
            let combinedSets = Array.apply(null, new Array(data.rawSets.length)).map(Number.prototype.valueOf, 0);
            combinedSets[i] = 1;
            var set = new _Set__WEBPACK_IMPORTED_MODULE_2__["Set"](setPrefix + i, data.setNames[i], combinedSets, data.rawSets[i], this.depth);
            this.sets.push(set);
            if (i < this.noDefaultSets) {
                set.isSelected = true;
                this.usedSets.push(set);
            }
            else {
                set.isSelected = false;
                this.unusedSets.push(set);
            }
        }
    }
    getAlphabeticalSorting(sets) {
        return sets.sort((a, b) => {
            return d3__WEBPACK_IMPORTED_MODULE_6__["ascending"](a.elementName, b.elementName);
        });
    }
    addSet(set) {
        set.isSelected = true;
        this.usedSets.push(set);
        let toRemove = this.unusedSets.findIndex((s, i) => s.id === set.id);
        this.unusedSets.splice(toRemove, 1);
        this.setUpSubSets();
        this.setupRenderRows(JSON.parse(sessionStorage["render_config"]));
        this.app.emit("render-config", this.renderConfig);
    }
    removeSet(set) {
        set.isSelected = false;
        let toRemove = this.usedSets.findIndex((s, i) => s.id === set.id);
        this.usedSets.splice(toRemove, 1);
        this.unusedSets.push(set);
        this.setUpSubSets();
        this.setupRenderRows(JSON.parse(sessionStorage["render_config"]));
        this.app.emit("render-config", this.renderConfig);
    }
    /**
     *
     *
     * @param {DSVParsedArray<DSVRowString>} data
     * @param {IDataSetJSON} dataSetDesc
     * @returns {Promise<RawData>}
     * @memberof Data
     */
    getRawData(data, dataSetDesc) {
        let rawData = {
            rawSets: [],
            setNames: [],
            header: []
        };
        let headers = data.columns;
        rawData.header = data.columns;
        let processedSetCount = 0;
        for (let i = 0; i < dataSetDesc.sets.length; ++i) {
            let setDef = dataSetDesc.sets[i];
            if (setDef.format === "binary") {
                let setDefLength = setDef.end - setDef.start + 1;
                for (let setCount = 0; setCount < setDefLength; ++setCount) {
                    rawData.rawSets.push(new Array());
                }
                let rows = data.map((row, row_idx) => {
                    return Object
                        .entries(row)
                        .map((t) => t[1])
                        .map((val, col_idx) => {
                        if (col_idx >= setDef.start && col_idx <= setDef.end) {
                            let intVal = parseInt(val, 10);
                            if (isNaN(intVal)) {
                                console.error("Unable to parse ${val}!");
                            }
                            return intVal;
                        }
                        return null;
                    });
                });
                for (let r = 0; r < rows.length; ++r) {
                    if (i === 0) {
                        this.allItems.push(this.depth++);
                    }
                    for (let s = 0; s < setDefLength; ++s) {
                        rawData.rawSets[processedSetCount + s].push(rows[r][setDef.start + s]);
                        if (r === 1) {
                            rawData.setNames.push(headers[setDef.start + s]);
                        }
                    }
                }
                processedSetCount += setDefLength;
            }
            else {
                console.error(`Set definition format ${setDef.format} not supported.`);
            }
        }
        return new Promise((res, rej) => {
            res(rawData);
        });
    }
    setupRenderRows(renderConfig = null, sortBySetId) {
        if (renderConfig) {
            this.renderConfig = renderConfig;
            this.renderRows = this.render(this.renderConfig.firstLevelAggregateBy, this.renderConfig.secondLevelAggregateBy, this.renderConfig.sortBy, this.renderConfig.minDegree, this.renderConfig.maxDegree, this.renderConfig.firstOverlap, this.renderConfig.secondOverlap, this.renderConfig.sortBySetid);
        }
        else {
            if (!sortBySetId)
                sortBySetId = 0;
            this.renderRows = this.render(null, null, _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["SortBy"].SET, this.renderConfig.minDegree, this.renderConfig.maxDegree, this.renderConfig.firstOverlap, this.renderConfig.secondOverlap, this.renderConfig.sortBySetid);
        }
        this.app.emit("render-rows-changed", this);
    }
    render(firstAggBy, secondAggBy, sortBy, minDegree, maxDegree, overlap1, overlap2, sortBySetId) {
        let agg = [];
        this.subSets
            .filter(d => {
            return d.noCombinedSets >= minDegree && d.noCombinedSets <= maxDegree;
        })
            .forEach((set) => {
            agg.push({ id: set.id.toString(), data: set });
        });
        if (firstAggBy === _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].OVERLAPS)
            agg = _AggregationStrategy__WEBPACK_IMPORTED_MODULE_1__["default"][firstAggBy](agg, overlap1, 1, this.setNameDictionary);
        else if (firstAggBy && firstAggBy !== _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE)
            agg = _AggregationStrategy__WEBPACK_IMPORTED_MODULE_1__["default"][firstAggBy](agg, overlap1, 1, this.setNameDictionary);
        if (secondAggBy && secondAggBy !== _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE)
            agg = applySecondAggregation(agg, secondAggBy, overlap2, this.setNameDictionary);
        if (this.renderConfig.hideEmptyIntersection)
            agg = agg.filter(set => set.data.setSize > 0);
        if (sortBy)
            agg = applySort(agg, sortBy, sortBySetId);
        return agg;
    }
}
function applySecondAggregation(agg, aggBy, overlap, setNameDictionary) {
    let groupIndices = agg
        .map((v, i) => [i, v.data.type === _RowType__WEBPACK_IMPORTED_MODULE_5__["RowType"].GROUP])
        .filter(v => v[1])
        .map(v => v[0]);
    let rr = [];
    for (let i = 0; i < groupIndices.length; ++i) {
        rr.push(agg[groupIndices[i]]);
        let subsets = [];
        if (i === groupIndices.length - 1) {
            subsets = agg.slice(groupIndices[i] + 1);
        }
        else {
            subsets = agg.slice(groupIndices[i] + 1, groupIndices[i + 1]);
        }
        let rendered = _AggregationStrategy__WEBPACK_IMPORTED_MODULE_1__["default"][aggBy](subsets, overlap, 2, setNameDictionary);
        rr = rr.concat(rendered);
    }
    return rr;
}
function applySort(agg, sortBy, sortBySetId) {
    let a = _SortingStrategy__WEBPACK_IMPORTED_MODULE_3__["default"][sortBy](agg, sortBySetId);
    return a;
}


/***/ }),

/***/ "./src/DataStructure/DataUtils.ts":
/*!****************************************!*\
  !*** ./src/DataStructure/DataUtils.ts ***!
  \****************************************/
/*! exports provided: DataUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataUtils", function() { return DataUtils; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var _Data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Data */ "./src/DataStructure/Data.ts");
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:05
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-16 11:46:38
 */


class DataUtils {
    static getDataSetJSON(data) {
        let metas = [];
        data.meta.forEach((d) => {
            let m = {
                type: d.type,
                index: d.index,
                name: d.name
            };
            metas.push(m);
        });
        let sets = [];
        data.sets.forEach((d) => {
            let s = {
                format: d.format,
                start: d.start,
                end: d.end
            };
            sets.push(s);
        });
        let d = {
            file: data.file,
            name: data.name,
            header: data.header,
            separator: data.separator,
            skip: data.skip,
            meta: metas,
            sets: sets,
            author: data.author,
            description: data.description,
            source: data.source
        };
        return d;
    }
    static getDataSetInfo(data) {
        let info = {
            Name: "",
            SetCount: 0,
            AttributeCount: 0,
            _data: null
        };
        info.Name = data.name;
        info.AttributeCount = data.meta.length;
        info.SetCount = 0;
        for (let i = 0; i < data.sets.length; ++i) {
            let sdb = data.sets[i];
            if (sdb.format === "binary") {
                info.SetCount += sdb.end - sdb.start + 1;
            }
            else {
                console.error(`Set Definition Format ${sdb.format} not supported`);
            }
        }
        info._data = data;
        return info;
    }
    static processDataSet(datasetinfo) {
        let filePath = datasetinfo._data.file;
        let dataSetDesc = datasetinfo._data;
        d3__WEBPACK_IMPORTED_MODULE_0__["dsv"](dataSetDesc.separator, filePath).then(data => {
            let d = new _Data__WEBPACK_IMPORTED_MODULE_1__["Data"](DataUtils.app).load(data, dataSetDesc);
            d.then((d2) => {
                DataUtils.app.emit("render-config", d2.renderConfig);
            });
        });
    }
}


/***/ }),

/***/ "./src/DataStructure/EmbedConfig.ts":
/*!******************************************!*\
  !*** ./src/DataStructure/EmbedConfig.ts ***!
  \******************************************/
/*! exports provided: EmbedConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmbedConfig", function() { return EmbedConfig; });
class EmbedConfig {
    constructor() {
        this.NavBar = false;
        this.FilterBox = false;
        this.DataSetInfo = false;
        this.LeftSideBar = this.FilterBox || this.DataSetInfo;
        this.RightSideBar = false;
        this.ProvenanceView = false;
        this.DeviationBars = false;
        this.CardinalityBars = false;
    }
    static getConfig() {
        if (EmbedConfig.ec === undefined || EmbedConfig.ec === null)
            EmbedConfig.ec = new EmbedConfig();
        EmbedConfig.ec.LeftSideBar =
            EmbedConfig.ec.FilterBox || EmbedConfig.ec.DataSetInfo;
        return EmbedConfig.ec;
    }
    static setConfig(_ec) {
        if (_ec)
            EmbedConfig.ec = _ec;
    }
}


/***/ }),

/***/ "./src/DataStructure/Group.ts":
/*!************************************!*\
  !*** ./src/DataStructure/Group.ts ***!
  \************************************/
/*! exports provided: Group */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Group", function() { return Group; });
/* harmony import */ var _Aggregate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Aggregate */ "./src/DataStructure/Aggregate.ts");
/* harmony import */ var _BaseElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BaseElement */ "./src/DataStructure/BaseElement.ts");
/* harmony import */ var _RowType__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RowType */ "./src/DataStructure/RowType.ts");
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 16:57:29
 * @Last Modified by:   Kiran Gadhave
 * @Last Modified time: 2018-06-03 16:57:29
 */



class Group extends _BaseElement__WEBPACK_IMPORTED_MODULE_1__["BaseElement"] {
    constructor(groupId, groupName, level) {
        super(groupId, groupName);
        this.type = _RowType__WEBPACK_IMPORTED_MODULE_2__["RowType"].GROUP;
        this.isCollapsed = false;
        this.nestedGroups = [];
        this.level = 1;
        if (level)
            this.level = level;
        this.subSets = [];
        this.visibleSets = [];
        this.aggregate = new _Aggregate__WEBPACK_IMPORTED_MODULE_0__["Aggregate"](`empty${groupId}`, "Subsets", level + 1);
        this.hiddenSets = [];
        this.expectedProb = 0;
        this.disproportionality = 0;
        this.disproportionalitySum = 0;
    }
    addSubSet(subSet) {
        this.subSets.push(subSet);
        if (subSet.setSize > 0) {
            this.visibleSets.unshift(subSet);
        }
        else {
            this.hiddenSets.unshift(subSet);
            this.aggregate.addSubSet(subSet);
        }
        this.items = this.items.concat(subSet.items);
        this.setSize += subSet.setSize;
        this.expectedProb += subSet.expectedProb;
        this.disproportionality += subSet.disproportionality;
    }
    addNestedGroup(group) {
        this.nestedGroups.push(group);
        this.hiddenSets = this.hiddenSets.concat(group.hiddenSets);
        this.visibleSets = this.visibleSets.concat(group.visibleSets);
        group.subSets.forEach(set => {
            this.aggregate.addSubSet(set);
        });
        this.items = this.items.concat(group.items);
        this.setSize += group.setSize;
        this.expectedProb += group.expectedProb;
        this.disproportionality += group.disproportionality;
    }
    contains(element) {
        return this.subSets.indexOf(element) >= 0;
    }
}


/***/ }),

/***/ "./src/DataStructure/RowType.ts":
/*!**************************************!*\
  !*** ./src/DataStructure/RowType.ts ***!
  \**************************************/
/*! exports provided: RowType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RowType", function() { return RowType; });
var RowType;
(function (RowType) {
    RowType["SET"] = "SET";
    RowType["SUBSET"] = "SUBSET";
    RowType["GROUP"] = "GROUP";
    RowType["AGGREGATE"] = "AGGREGATE";
    RowType["QUERY_GROUP"] = "QUERY_GROUP";
    RowType["SEPERATOR"] = "SEPERATOR";
    RowType["UNDEFINED"] = "UNDEFINED";
})(RowType || (RowType = {}));


/***/ }),

/***/ "./src/DataStructure/Set.ts":
/*!**********************************!*\
  !*** ./src/DataStructure/Set.ts ***!
  \**********************************/
/*! exports provided: Set */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Set", function() { return Set; });
/* harmony import */ var _BaseSet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseSet */ "./src/DataStructure/BaseSet.ts");
/* harmony import */ var _RowType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RowType */ "./src/DataStructure/RowType.ts");
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 16:58:07
 * @Last Modified by:   Kiran Gadhave
 * @Last Modified time: 2018-06-03 16:58:07
 */


class Set extends _BaseSet__WEBPACK_IMPORTED_MODULE_0__["BaseSet"] {
    constructor(setId, setName, combinedSets, itemList, depth, isSuperCall = false) {
        if (isSuperCall)
            super(setId, setName, combinedSets, itemList, depth);
        else {
            super(setId, setName, combinedSets, [], depth);
            for (let i = 0; i < itemList.length; ++i) {
                if (itemList[i] !== 0) {
                    this.items.push(i);
                    this.setSize++;
                }
            }
        }
        this.depth = depth;
        this.dataRatio = this.setSize / this.depth;
        this.itemList = itemList;
        this.isSelected = false;
        this.type = _RowType__WEBPACK_IMPORTED_MODULE_1__["RowType"].SET;
    }
}


/***/ }),

/***/ "./src/DataStructure/SortingStrategy.ts":
/*!**********************************************!*\
  !*** ./src/DataStructure/SortingStrategy.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _RowType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RowType */ "./src/DataStructure/RowType.ts");
/* harmony import */ var _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AggregateAndFilters */ "./src/DataStructure/AggregateAndFilters.ts");


let SortStrategy = {};
SortStrategy[_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__["SortBy"].CARDINALITY] = sortByCardinality;
SortStrategy[_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__["SortBy"].DEGREE] = sortByDegree;
SortStrategy[_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__["SortBy"].DEVIATION] = sortByDeviation;
SortStrategy[_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__["SortBy"].SET] = sortBySet;
/* harmony default export */ __webpack_exports__["default"] = (SortStrategy);
//  Sorting function definitions
function sortByCardinality(data) {
    let groups = data.reduce((p, c, i) => {
        if (c.data.type === _RowType__WEBPACK_IMPORTED_MODULE_0__["RowType"].GROUP)
            p.push(i);
        return p;
    }, []);
    let rr = [];
    if (groups.length === 0) {
        return data.sort((d1, d2) => {
            return d2.data.setSize - d1.data.setSize;
        });
    }
    groups.forEach((g, idx) => {
        rr.push(data[g]);
        let els = data.slice(g + 1, groups[idx + 1]);
        els = els.sort((d1, d2) => {
            return d2.data.setSize - d1.data.setSize;
        });
        rr = rr.concat(els);
    });
    return rr;
}
function sortBySet(data, setId) {
    let a = data.sort((d1, d2) => {
        return (d2.data.combinedSets[setId] -
            d1.data.combinedSets[setId]);
    });
    return a;
}
function sortByDegree(data, setId) {
    return data;
}
function sortByDeviation(data, setId) {
    let groups = data.reduce((p, c, i) => {
        if (c.data.type === _RowType__WEBPACK_IMPORTED_MODULE_0__["RowType"].GROUP)
            p.push(i);
        return p;
    }, []);
    let rr = [];
    if (groups.length === 0) {
        return data.sort((d1, d2) => {
            return (Math.abs(d2.data.disproportionality) -
                Math.abs(d1.data.disproportionality));
        });
    }
    groups.forEach((g, idx) => {
        rr.push(data[g]);
        let els = data.slice(g + 1, groups[idx + 1]);
        els = els.sort((d1, d2) => {
            return (Math.abs(d2.data.disproportionality) -
                Math.abs(d1.data.disproportionality));
        });
        rr = rr.concat(els);
    });
    return rr;
}


/***/ }),

/***/ "./src/DataStructure/SubSet.ts":
/*!*************************************!*\
  !*** ./src/DataStructure/SubSet.ts ***!
  \*************************************/
/*! exports provided: SubSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SubSet", function() { return SubSet; });
/* harmony import */ var _Set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Set */ "./src/DataStructure/Set.ts");
/* harmony import */ var _RowType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RowType */ "./src/DataStructure/RowType.ts");
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 16:58:11
 * @Last Modified by:   Kiran Gadhave
 * @Last Modified time: 2018-06-03 16:58:11
 */


class SubSet extends _Set__WEBPACK_IMPORTED_MODULE_0__["Set"] {
    constructor(setId, setName, combinedSets, itemList, expectedProb, depth) {
        super(setId, setName, combinedSets, itemList, depth, true);
        this.selections = {};
        this.depth = depth;
        this.expectedProb = expectedProb;
        let observedProb = (this.setSize * 1.0) / this.depth;
        this.disproportionality = observedProb - expectedProb;
        this.type = _RowType__WEBPACK_IMPORTED_MODULE_1__["RowType"].SUBSET;
    }
    toString() {
        return `Subset ${this.id}, No of Combined Sets: ${this.noCombinedSets}`;
    }
}


/***/ }),

/***/ "./src/EmbedGenView/EmbedGenView.ts":
/*!******************************************!*\
  !*** ./src/EmbedGenView/EmbedGenView.ts ***!
  \******************************************/
/*! exports provided: EmbedGenView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmbedGenView", function() { return EmbedGenView; });
/* harmony import */ var _DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../DataStructure/EmbedConfig */ "./src/DataStructure/EmbedConfig.ts");
/* harmony import */ var _embedgen_view_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./embedgen.view.html */ "./src/EmbedGenView/embedgen.view.html");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles.scss */ "./src/EmbedGenView/styles.scss");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_3__);




function EmbedGenView(base) {
    base.html(base.html() + _embedgen_view_html__WEBPACK_IMPORTED_MODULE_1__["default"]);
    addShowCloseEvents(base);
    addInsertIFrameEvent(base);
    readCheckBoxEvents(base);
    addCheckboxEvents(base);
}
function addShowCloseEvents(base) {
    base.select(".delete").on("click", () => {
        base.select(".modal").classed("is-active", false);
    });
    base.select(".show").on("click", () => {
        base.select(".modal").classed("is-active", true);
    });
    base.select(".modal-background").on("click", () => {
        base.select(".modal").classed("is-active", false);
    });
}
function addInsertIFrameEvent(base) {
    base.select(".copy-button").on("click", () => {
        let i = d3__WEBPACK_IMPORTED_MODULE_2__["select"](".embeded-view")
            .selectAll("iframe")
            .data([1]);
        i.exit().remove();
        i.enter()
            .append("iframe")
            .merge(i)
            .attr("data", () => {
            return JSON.stringify(_DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].getConfig());
        })
            .attr("class", "upset")
            .attr("src", "https://vdl.sci.utah.edu/upset2/embed.html");
        let _i = d3__WEBPACK_IMPORTED_MODULE_2__["select"](".embeded-view");
        base.select(".code").property("value", _i.html());
    });
}
function addCheckboxEvents(base) {
    base.select(".filter-box").on("change", function () {
        let ec = _DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].getConfig();
        ec.FilterBox = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).property("checked");
        _DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].setConfig(ec);
    });
    base.select(".dataset-info-box").on("change", function () {
        let ec = _DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].getConfig();
        ec.DataSetInfo = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).property("checked");
        _DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].setConfig(ec);
    });
    base.select(".provenance-view").on("change", function () {
        let ec = _DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].getConfig();
        ec.ProvenanceView = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).property("checked");
        _DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].setConfig(ec);
    });
    base.select(".deviation-bar").on("change", function () {
        let ec = _DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].getConfig();
        ec.DeviationBars = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).property("checked");
        _DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].setConfig(ec);
    });
    base.select(".cardinality-bar").on("change", function () {
        let ec = _DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].getConfig();
        ec.CardinalityBars = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).property("checked");
        _DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].setConfig(ec);
    });
}
function readCheckBoxEvents(base) {
    let ec = _DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].getConfig();
    ec.FilterBox = base.select(".filter-box").property("checked");
    ec.DataSetInfo = base.select(".dataset-info-box").property("checked");
    ec.ProvenanceView = base.select(".provenance-view").property("checked");
    ec.DeviationBars = base.select(".deviation-bar").property("checked");
    ec.CardinalityBars = base.select(".cardinality-bar").property("checked");
    _DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].setConfig(ec);
}


/***/ }),

/***/ "./src/EmbedGenView/embedgen.view.html":
/*!*********************************************!*\
  !*** ./src/EmbedGenView/embedgen.view.html ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<div class="modal">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Embed Upset Plot</p>
      <button class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
      <div class="content">
        <h4>Select elements to embed:</h4>
      </div>
      <div class="embed-params">
        <!-- Add Checkboxes here -->
        <label class="checkbox">
          <input type="checkbox" class="filter-box" checked=""> Filters
        </label>

        <label class="checkbox">
          <input type="checkbox" class="dataset-info-box" checked=""> Dataset Info
        </label>

        <label class="checkbox">
          <input type="checkbox" class="provenance-view" checked=""> Provenance View
        </label>

        <label class="checkbox">
          <input type="checkbox" class="deviation-bar" checked=""> Deviation
        </label>

        <label class="checkbox">
          <input type="checkbox" class="cardinality-bar" checked=""> Cardinality
        </label>

      </div>
      <textarea class="code textarea" placeholder="Your Embed Code"></textarea>
    </section>
    <footer class="modal-card-foot">
      <button class="copy-button button is-success">Copy</button>
    </footer>
  </div>
</div>`);

/***/ }),

/***/ "./src/EmbedGenView/styles.scss":
/*!**************************************!*\
  !*** ./src/EmbedGenView/styles.scss ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader!../../node_modules/postcss-loader/lib??ref--5-3!../../node_modules/sass-loader/lib/loader.js!./styles.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/EmbedGenView/styles.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/FilterBoxView/FilterBoxView.ts":
/*!********************************************!*\
  !*** ./src/FilterBoxView/FilterBoxView.ts ***!
  \********************************************/
/*! exports provided: FilterBoxView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FilterBoxView", function() { return FilterBoxView; });
/* harmony import */ var _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../DataStructure/AggregateAndFilters */ "./src/DataStructure/AggregateAndFilters.ts");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _filterbox_view_html__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./filterbox.view.html */ "./src/FilterBoxView/filterbox.view.html");

/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:32
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-07 15:43:50
 */




class FilterBoxView extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_2__["ViewBase"] {
    get config() {
        if (!sessionStorage["render_config"])
            this.saveConfig(new _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["RenderConfig"]());
        return JSON.parse(sessionStorage["render_config"]);
    }
    constructor(root) {
        super(root);
        this.comm.on("sort-by-set", (id) => {
            let rc = Object.assign(Object.create(Object.getPrototypeOf(this.config)), this.config);
            let _do = {
                func: this.applySortBySet.bind(this),
                args: [id]
            };
            let _undo = {
                func: this.unApplySortBySet.bind(this),
                args: [rc]
            };
            this.comm.emit("apply", ["sortBySet", _do, _undo]);
        });
        this.comm.on("sort-by-cardinality", () => {
            let rc = Object.assign(Object.create(Object.getPrototypeOf(this.config)), this.config);
            let _do = {
                func: this.applySortByCardinality.bind(this),
                args: []
            };
            let _undo = {
                func: this.unApplySortByCardinality.bind(this),
                args: [rc]
            };
            this.comm.emit("apply", ["sortByCardinality", _do, _undo]);
        });
        this.comm.on("sort-by-deviation", () => {
            let rc = Object.assign(Object.create(Object.getPrototypeOf(this.config)), this.config);
            let _do = {
                func: this.applySortByDeviation.bind(this),
                args: []
            };
            let _undo = {
                func: this.unApplySortByDeviation.bind(this),
                args: [rc]
            };
            this.comm.emit("apply", ["sortByDeviation", _do, _undo]);
        });
    }
    create() {
        d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.Root).html(_filterbox_view_html__WEBPACK_IMPORTED_MODULE_3__["default"]);
        this.update();
    }
    update() {
        this.updateAggregationDropdowns();
        this.updateSortByOptions();
        this.updateOverlaps();
        this.updateDataFields();
    }
    updateDataFields() {
        let minDegree = d3__WEBPACK_IMPORTED_MODULE_1__["select"]("#minDegree");
        let maxDegree = d3__WEBPACK_IMPORTED_MODULE_1__["select"]("#maxDegree");
        let hideEmpty = d3__WEBPACK_IMPORTED_MODULE_1__["select"]("#hideEmpty");
        let firstOverlap = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.Root).select("#overlap-one");
        let secondOverlap = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.Root).select("#overlap-two");
        firstOverlap
            .select("#first-overlap-input")
            .property("value", this.config.firstOverlap);
        secondOverlap
            .select("#second-overlap-input")
            .property("value", this.config.secondOverlap);
        minDegree.attr("value", this.config.minDegree);
        maxDegree.attr("value", this.config.maxDegree);
        hideEmpty.property("checked", this.config.hideEmptyIntersection);
        let t = this;
        minDegree.on("change", function () {
            let newVal = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this).property("value");
            let _do = {
                func: t.applyMinDegreeChange.bind(t),
                args: [newVal]
            };
            let _undo = {
                func: t.applyMinDegreeChange.bind(t),
                args: [t.config.minDegree]
            };
            t.comm.emit("apply", ["applyMinDegreeChange", _do, _undo]);
        });
        maxDegree.on("change", function () {
            let newVal = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this).property("value");
            let _do = {
                func: t.applyMaxDegreeChange.bind(t),
                args: [newVal]
            };
            let _undo = {
                func: t.applyMaxDegreeChange.bind(t),
                args: [t.config.maxDegree]
            };
            t.comm.emit("apply", ["applyMaxDegreeChange", _do, _undo]);
        });
        hideEmpty.on("change", function () {
            let hide = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this).property("checked");
            let _do = {
                func: t.applyHideEmpty.bind(t),
                args: [hide]
            };
            let _undo = {
                func: t.applyHideEmpty.bind(t),
                args: [t.config.hideEmptyIntersection]
            };
            t.comm.emit("apply", ["applyHideEmpty", _do, _undo]);
        });
    }
    updateSortByOptions() {
        let sortby = Object.keys(_DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["SortBy"]);
        sortby.splice(-1, 1);
        let sortByOptions = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.Root)
            .select("#sortByOptions")
            .selectAll(".sortOption")
            .data(sortby);
        sortByOptions.exit().remove();
        let sortLabels = sortByOptions
            .enter()
            .append("div")
            .attr("class", "sortOption")
            .html("")
            .append("label")
            .attr("class", "radio");
        sortLabels
            .append("input")
            .attr("name", "sortAnswer")
            .attr("type", "radio")
            .property("checked", (d, i) => {
            return this.config.sortBy === d;
        });
        sortLabels.on("click", (d, i) => {
            let current = "";
            sortLabels.each(function (d) {
                if (d3__WEBPACK_IMPORTED_MODULE_1__["select"](this)
                    .select("input")
                    .property("checked") === true)
                    current = d;
            });
            let _do = {
                func: this.applySortBy.bind(this),
                args: [d]
            };
            let _undo = {
                func: this.applySortBy.bind(this),
                args: [current]
            };
            this.comm.emit("apply", ["applySortBy", _do, _undo]);
        });
        sortLabels.append("span").text((d, i) => {
            return ` ${d}`;
        });
    }
    updateAggregationDropdowns() {
        if (this.config.firstLevelAggregateBy === _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE) {
            d3__WEBPACK_IMPORTED_MODULE_1__["select"]("#secondAgg").html("");
        }
        else {
            d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.Root).html(_filterbox_view_html__WEBPACK_IMPORTED_MODULE_3__["default"]);
        }
        let firstAggBy = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.Root).select("#firstAggByDropdown");
        let secondAggBy = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.Root).select("#secondAggByDropdown");
        let aggOptions = Object.keys(_DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"]);
        let firstAggByOptions = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.Root)
            .select("#firstAggByOptions")
            .selectAll(".dropdown-item")
            .data(aggOptions);
        firstAggBy.text(this.config.firstLevelAggregateBy);
        firstAggByOptions.exit().remove();
        firstAggByOptions
            .enter()
            .append("div")
            .attr("class", "dropdown-item")
            .text((d, i) => {
            return d;
        })
            .on("click", (d, i) => {
            let current = firstAggBy.text();
            let _do = {
                func: this.applyFirstAggregation.bind(this),
                args: [d]
            };
            let _undo = {
                func: this.applyFirstAggregation.bind(this),
                args: [current]
            };
            this.comm.emit("apply", ["applyFirstAggregation", _do, _undo]);
        });
        aggOptions.splice(aggOptions.indexOf(this.config.firstLevelAggregateBy), 1);
        let secondAggByOptions = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.Root)
            .select("#secondAggByOptions")
            .selectAll(".dropdown-item")
            .data(aggOptions);
        secondAggBy.text(this.config.secondLevelAggregateBy);
        secondAggByOptions.exit().remove();
        secondAggByOptions
            .enter()
            .append("div")
            .attr("class", "dropdown-item")
            .text((d, i) => {
            return d;
        })
            .on("click", (d, i) => {
            let current = secondAggBy.text();
            let overlap = this.config.secondOverlap;
            let _do = {
                func: this.applySecondAggregation.bind(this),
                args: [d]
            };
            let _undo = {
                func: this.applySecondAggregation.bind(this),
                args: [current]
            };
            this.comm.emit("apply", ["applySecondAggregation", _do, _undo]);
        });
    }
    updateOverlaps() {
        let firstOverlap = d3__WEBPACK_IMPORTED_MODULE_1__["select"]("#first-overlap-input");
        let secondOverlap = d3__WEBPACK_IMPORTED_MODULE_1__["select"]("#second-overlap-input");
        let t = this;
        firstOverlap.on("change", function () {
            let overlap = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this).property("value");
            let _do = {
                func: t.applyFirstOverlap.bind(t),
                args: [overlap]
            };
            let _undo = {
                func: t.applyFirstOverlap.bind(t),
                args: [t.config.firstOverlap]
            };
            t.comm.emit("apply", ["applyFirstOverlap", _do, _undo]);
        });
        secondOverlap.on("change", function () {
            let overlap = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this).property("value");
            let _do = {
                func: t.applySecondOverlap.bind(t),
                args: [overlap]
            };
            let _undo = {
                func: t.applySecondOverlap.bind(t),
                args: [t.config.secondOverlap]
            };
            t.comm.emit("apply", ["applySecondOverlap", _do, _undo]);
        });
    }
    saveConfig(config, update = true) {
        sessionStorage["render_config"] = JSON.stringify(config);
        if (update)
            this.comm.emit("filter-changed", this.config);
    }
    applyFirstAggregation(d) {
        let rc = this.config;
        rc.firstLevelAggregateBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"][d];
        if (rc.secondLevelAggregateBy === rc.firstLevelAggregateBy) {
            rc.secondLevelAggregateBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE;
        }
        if (rc.firstLevelAggregateBy !== _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE &&
            rc.sortBy === _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["SortBy"].SET)
            rc.sortBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["SortBy"].DEGREE;
        this.saveConfig(rc);
        this.update();
    }
    applySecondAggregation(d) {
        let rc = this.config;
        rc.secondLevelAggregateBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"][d];
        if (rc.secondLevelAggregateBy !== _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE &&
            rc.sortBy === _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["SortBy"].SET)
            rc.sortBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["SortBy"].DEGREE;
        this.saveConfig(rc);
        this.update();
    }
    applySortBy(d) {
        let rc = this.config;
        rc.sortBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["SortBy"][d];
        this.saveConfig(rc);
        this.update();
    }
    applyFirstOverlap(d) {
        let rc = this.config;
        rc.firstOverlap = d;
        this.saveConfig(rc);
        this.update();
    }
    applySecondOverlap(d) {
        let rc = this.config;
        rc.secondOverlap = d;
        this.saveConfig(rc);
        this.update();
    }
    applyMinDegreeChange(d) {
        let rc = this.config;
        rc.minDegree = d;
        this.saveConfig(rc);
        this.update();
    }
    applyMaxDegreeChange(d) {
        let rc = this.config;
        rc.maxDegree = d;
        this.saveConfig(rc);
        this.update();
    }
    applyHideEmpty(d) {
        let rc = this.config;
        rc.hideEmptyIntersection = d;
        this.saveConfig(rc);
        this.update();
    }
    applySortBySet(id) {
        let rc = this.config;
        rc.firstLevelAggregateBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE;
        rc.secondLevelAggregateBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE;
        rc.sortBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["SortBy"].SET;
        rc.sortBySetid = id;
        this.saveConfig(rc);
        this.update();
    }
    unApplySortBySet(rc) {
        this.saveConfig(rc);
        this.update();
    }
    applySortByCardinality() {
        let rc = this.config;
        rc.firstLevelAggregateBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE;
        rc.secondLevelAggregateBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE;
        rc.sortBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["SortBy"].CARDINALITY;
        this.saveConfig(rc);
        this.update();
    }
    unApplySortByCardinality(rc) {
        this.saveConfig(rc);
        this.update();
    }
    applySortByDeviation() {
        let rc = this.config;
        rc.firstLevelAggregateBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE;
        rc.secondLevelAggregateBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE;
        rc.sortBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["SortBy"].DEVIATION;
        this.saveConfig(rc);
        this.update();
    }
    unApplySortByDeviation(rc) {
        this.saveConfig(rc);
        this.update();
    }
}


/***/ }),

/***/ "./src/FilterBoxView/FilterBoxViewModel.ts":
/*!*************************************************!*\
  !*** ./src/FilterBoxView/FilterBoxViewModel.ts ***!
  \*************************************************/
/*! exports provided: FilterBoxViewModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FilterBoxViewModel", function() { return FilterBoxViewModel; });
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.scss */ "./src/FilterBoxView/styles.scss");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../DataStructure/AggregateAndFilters */ "./src/DataStructure/AggregateAndFilters.ts");



class FilterBoxViewModel extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__["ViewModelBase"] {
    get config() {
        if (!sessionStorage["render_config"])
            this.saveConfig(new _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_2__["RenderConfig"]());
        return JSON.parse(sessionStorage["render_config"]);
    }
    constructor(view, app) {
        super(view, app);
        this.comm.on("filter-changed", (config) => {
            this.App.emit("filter-changed", config, null);
        });
        this.App.on("sort-by-set", (id) => {
            this.comm.emit("sort-by-set", id);
        });
        this.App.on("sort-by-cardinality", () => {
            this.comm.emit("sort-by-cardinality");
        });
        this.App.on("sort-by-deviation", () => {
            this.comm.emit("sort-by-deviation");
        });
        this.App.on("change-dataset", d => {
            let rc = this.config;
            rc.currentFile = d;
            this.saveConfig(rc);
        });
        this.registerFunctions("applyFirstAggregation", view.applyFirstAggregation, view);
        this.registerFunctions("applySecondAggregation", view.applySecondAggregation, view);
        this.registerFunctions("applySortBy", view.applySortBy, view);
        this.registerFunctions("applyFirstOverlap", view.applyFirstOverlap, view);
        this.registerFunctions("applySecondOverlap", view.applySecondOverlap, view);
        this.registerFunctions("applyMinDegreeChange", view.applyMinDegreeChange, view);
        this.registerFunctions("applyMaxDegreeChange", view.applyMaxDegreeChange, view);
        this.registerFunctions("applyHideEmpty", view.applyHideEmpty, view);
        this.registerFunctions("sortBySet", view.applySortBySet, view);
        this.registerFunctions("sortByCardinality", view.applySortByCardinality, view);
        this.registerFunctions("sortByDeviation", view.applySortByDeviation, view);
        /** Undo Registration */
        this.registerFunctions("applyFirstAggregation", view.applyFirstAggregation, view, false);
        this.registerFunctions("applySecondAggregation", view.applySecondAggregation, view, false);
        this.registerFunctions("applySortBy", view.applySortBy, view, false);
        this.registerFunctions("applyFirstOverlap", view.applyFirstOverlap, view, false);
        this.registerFunctions("applySecondOverlap", view.applySecondOverlap, view, false);
        this.registerFunctions("applyMinDegreeChange", view.applyMinDegreeChange, view, false);
        this.registerFunctions("applyMaxDegreeChange", view.applyMaxDegreeChange, view, false);
        this.registerFunctions("applyHideEmpty", view.applyHideEmpty, view, false);
        this.registerFunctions("sortBySet", view.unApplySortBySet, view, false);
        this.registerFunctions("sortByCardinality", view.unApplySortByCardinality, view, false);
        this.registerFunctions("sortByDeviation", view.unApplySortByDeviation, view, false);
        this.comm.on("apply", args => {
            console.log(args);
            console.log(this.App.graph);
            this.apply(args);
        });
    }
    saveConfig(config, update = true) {
        sessionStorage["render_config"] = JSON.stringify(config);
        if (update)
            this.comm.emit("filter-changed", this.config);
    }
}


/***/ }),

/***/ "./src/FilterBoxView/filterbox.view.html":
/*!***********************************************!*\
  !*** ./src/FilterBoxView/filterbox.view.html ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<div class="container is-fluid override">
  <div>
    <div class="make-bold">
      First, aggregate by:
    </div>
    <div class="dropdown is-hoverable">
      <div id="firstAggByDropdown" class="dropdown-trigger navbar-link">
        temp
      </div>
      <div class="dropdown-menu">
        <div id="firstAggByOptions" class="dropdown-content">
          <!-- <div class="dropdown-item">Test</div> -->
        </div>
      </div>
    </div>
  </div>
  <div id="overlap-one">
    Overlap Degree:
    <input id="first-overlap-input" type="text">
  </div>


  <div id="secondAgg">
    <div>
      <div class="make-bold">
        Then, aggregate by:
      </div>
      <div class="dropdown is-hoverable">
        <div id="secondAggByDropdown" class="dropdown-trigger navbar-link">
          temp
        </div>
        <div class="dropdown-menu">
          <div id="secondAggByOptions" class="dropdown-content">
            <!-- <div class="dropdown-item">Test</div> -->
          </div>
        </div>
      </div>
    </div>

    <div id="overlap-two">
      Overlap Degree:
      <input id="second-overlap-input" type="text">
    </div>

  </div>

  <div class="make-bold">
    Sort By:
  </div>

  <div id="sortByOptions" class="control">
    <!-- <div>
      <label for="" class="radio">
        <input type="radio" name="answer"> Test
      </label>
    </div> -->
  </div>

  <div id="collaseOptions">
    <div>
      <button class="button">Collapse All</button>
    </div>
    <div>
      <button class="button">Expand All</button>
    </div>
  </div>

  <div id="Data">
    <div class="make-bold">Data:</div>

    <div class="field">
      <label for="" class="label">Min Degree:</label>
      <div class="control">
        <input id="minDegree" type="text" class="input">
      </div>
    </div>
    <div class="field">
      <label for="" class="label">Max Degree</label>
      <div class="control">
        <input id="maxDegree" type="text" class="input">
      </div>
    </div>
    <div class="field">
      <div class="control">
        <input id="hideEmpty" type="checkbox">
        <label class="checkbox">Hide Empty Intersections</label>
      </div>
    </div>

  </div>

</div>`);

/***/ }),

/***/ "./src/FilterBoxView/styles.scss":
/*!***************************************!*\
  !*** ./src/FilterBoxView/styles.scss ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader!../../node_modules/postcss-loader/lib??ref--5-3!../../node_modules/sass-loader/lib/loader.js!./styles.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/FilterBoxView/styles.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/NavBarView/NavBarView.ts":
/*!**************************************!*\
  !*** ./src/NavBarView/NavBarView.ts ***!
  \**************************************/
/*! exports provided: NavBarView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavBarView", function() { return NavBarView; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _navbar_view_html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navbar.view.html */ "./src/NavBarView/navbar.view.html");
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:38:29
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-08 12:00:29
 */



class NavBarView extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__["ViewBase"] {
    constructor(root) {
        super(root);
    }
    create() {
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root).html(_navbar_view_html__WEBPACK_IMPORTED_MODULE_2__["default"]);
        this.comm.on("change-dataset", this.setDSS);
    }
    update(datasets) {
        let datasets_options = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root)
            .select("#dropdown-item-container")
            .selectAll("a")
            .data(datasets)
            .enter()
            .append("a")
            .text((d, i) => {
            return `${d.Name} (${d.SetCount} sets, ${d.AttributeCount} attributes)`;
        })
            .attr("class", "dropdown-item")
            .on("click", (d) => {
            this.comm.emit("change-dataset", d);
        });
        let rc = null;
        let d = null;
        if (sessionStorage["render_config"]) {
            rc = JSON.parse(sessionStorage["render_config"]);
        }
        if (rc) {
            d = rc.currentFile;
        }
        if (!d) {
            d = datasets_options
                .filter((d, i) => {
                return i == 0;
            })
                .data()[0];
        }
        if (d) {
            this.comm.emit("change-dataset", d);
        }
    }
    setDSS(data) {
        d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#data-dropdown-btn").text(`${data.Name} (${data.SetCount} sets, ${data.AttributeCount} attributes)`);
    }
}


/***/ }),

/***/ "./src/NavBarView/NavBarViewModel.ts":
/*!*******************************************!*\
  !*** ./src/NavBarView/NavBarViewModel.ts ***!
  \*******************************************/
/*! exports provided: NavBarViewModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavBarViewModel", function() { return NavBarViewModel; });
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../DataStructure/DataUtils */ "./src/DataStructure/DataUtils.ts");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles.scss */ "./src/NavBarView/styles.scss");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_2__);
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:38:33
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-16 11:15:54
 */



class NavBarViewModel extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__["ViewModelBase"] {
    constructor(view, app, dsLocation) {
        super(view, app);
        this.datasets = [];
        this.populateDatasetSelector(dsLocation);
        this.comm.on("change-dataset", dataset => {
            this.App.emit("change-dataset", dataset);
        });
    }
    populateDatasetSelector(dsLocation) {
        let results = [];
        let p = fetch(dsLocation)
            .then(results => results.json())
            .then(jsondata => {
            jsondata.forEach((d) => {
                let a = fetch(d).then(res => res.json());
                results.push(a);
            });
        })
            .then(() => {
            Promise.all(results)
                .then(d => {
                d.forEach(j => {
                    let a = _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_1__["DataUtils"].getDataSetJSON(j);
                    this.datasets.push(_DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_1__["DataUtils"].getDataSetInfo(a));
                });
            })
                .then(() => {
                this.comm.emit("update", this.datasets);
            });
        });
    }
}


/***/ }),

/***/ "./src/NavBarView/navbar.view.html":
/*!*****************************************!*\
  !*** ./src/NavBarView/navbar.view.html ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <div class="navbar-item">
      UpSet - Visualizing Intersecting Sets
    </div>
  </div>
  <div class="navbar-menu">
    <div class="navbar-end">
      <div class="navbar-item">
        <div style="font-weight: bold">Choose Dataset</div>
      </div>

      <div class="navbar-item has-dropdown is-hoverable" style="min-width: 500px; ">
        <div id="data-dropdown-btn" class="navbar-link">Dataset</div>

        <div id="dropdown-item-container" class="navbar-dropdown">
        </div>
      </div>

      <div class="navbar-item">
        <a class="button is-small is-primary">Load Data</a>
      </div>

      <div class="navbar-item">
        <a href="http://caleydo.org/tools/upset/ ">About UpSet</a>
      </div>

      <div class="navbar-item">
        <a href="https://github.com/hms-dbmi/UpSetR/ ">UpSet for R</a>
      </div>
      <div class="navbar-item">
        <div id="embed-modal">
          <a class="button is-small is-primary show">Embed</a>
        </div>
      </div>
    </div>
  </div>
</nav>`);

/***/ }),

/***/ "./src/NavBarView/styles.scss":
/*!************************************!*\
  !*** ./src/NavBarView/styles.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader!../../node_modules/postcss-loader/lib??ref--5-3!../../node_modules/sass-loader/lib/loader.js!./styles.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/NavBarView/styles.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/ProvenanceView/ProvenanceView.ts":
/*!**********************************************!*\
  !*** ./src/ProvenanceView/ProvenanceView.ts ***!
  \**********************************************/
/*! exports provided: ProvenanceView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProvenanceView", function() { return ProvenanceView; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _provenance_view_html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./provenance.view.html */ "./src/ProvenanceView/provenance.view.html");
/* harmony import */ var _uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./uiBuilderFunctions */ "./src/ProvenanceView/uiBuilderFunctions.ts");
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:38:29
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-10-09 14:41:41
 */




class ProvenanceView extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__["ViewBase"] {
    constructor(root) {
        super(root);
    }
    create() {
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root).html(_provenance_view_html__WEBPACK_IMPORTED_MODULE_2__["default"]);
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root)
            .select("#save-btn")
            .on("click", () => {
            this.comm.emit("save-graph");
        });
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root)
            .select("#load-btn")
            .on("click", () => {
            this.comm.emit("load-graph");
        });
        let undo = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root).select(".undo");
        let redo = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root).select(".redo");
        undo
            .append("img")
            .attr("src", "assets/arrow.svg")
            .attr("class", "img")
            .attr("height", 80)
            .attr("width", 80);
        redo
            .append("img")
            .attr("src", "assets/arrow.svg")
            .attr("class", "img")
            .attr("height", 80)
            .attr("width", 80);
        undo.on("click", () => {
            this.comm.emit("undo");
        });
        redo.on("click", () => {
            this.comm.emit("redo");
        });
        d3__WEBPACK_IMPORTED_MODULE_0__["select"]("html").on("keydown", () => {
            if (d3__WEBPACK_IMPORTED_MODULE_0__["event"].code === "ArrowLeft")
                this.comm.emit("undo");
            if (d3__WEBPACK_IMPORTED_MODULE_0__["event"].code === "ArrowRight")
                this.comm.emit("redo");
        });
    }
    update(graph) {
        Object(_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_3__["createButtons"])(d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root), graph);
        Object(_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_3__["createGraph"])(d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root).select(".graph-view"), graph, this.comm);
    }
}


/***/ }),

/***/ "./src/ProvenanceView/ProvenanceViewModel.ts":
/*!***************************************************!*\
  !*** ./src/ProvenanceView/ProvenanceViewModel.ts ***!
  \***************************************************/
/*! exports provided: ProvenanceViewModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProvenanceViewModel", function() { return ProvenanceViewModel; });
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.scss */ "./src/ProvenanceView/styles.scss");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_1__);
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:38:33
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-07 18:03:39
 */


class ProvenanceViewModel extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__["ViewModelBase"] {
    constructor(view, app) {
        super(view, app);
        this.App.graph.on("currentChanged", this.update.bind(this));
        this.comm.on("undo", this.undo, this);
        this.comm.on("redo", this.redo, this);
        this.comm.on("go-to-node", this.goTo, this);
        this.comm.on("save-graph", this.saveGraph, this);
        this.comm.on("load-graph", this.loadGraph, this);
        this.update();
    }
    update() {
        window.graph = this.App.graph;
        this.comm.emit("update", this.App.graph);
    }
    undo() {
        if (this.App.graph.current.label === "Root")
            return;
        this.traverser.toStateNode(this.App.graph.current.parent.id);
        this.update();
    }
    redo() {
        if (this.App.graph.current.children.length === 0)
            return;
        this.traverser.toStateNode(this.App.graph.current.children[0].id);
        this.update();
    }
    goTo(id) {
        this.traverser.toStateNode(id);
        this.update();
    }
    saveGraph() {
        localStorage["graph"] = JSON.stringify(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__["ProvenanceGraph"].serializeProvenanceGraph(this.App.graph));
    }
    loadGraph() {
        this.App.graph = provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__["ProvenanceGraph"].restoreProvenanceGraph(JSON.parse(localStorage["graph"]));
        this.App.emit("graph-loaded", this.App.graph);
        this.App.graph.on("currentChanged", this.update.bind(this));
        this.goTo(this.App.graph.root.id);
    }
}


/***/ }),

/***/ "./src/ProvenanceView/provenance.view.html":
/*!*************************************************!*\
  !*** ./src/ProvenanceView/provenance.view.html ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<div>
  <a id="save-btn" class="button">Save</a>
  <a id="load-btn" class="button">Load</a>
</div>

<div class="columns">
  <div class="column is-1 undo"></div>
  <div class="column is-10 graph-view"></div>
  <div class="column is-1 redo"></div>
</div>`);

/***/ }),

/***/ "./src/ProvenanceView/styles.scss":
/*!****************************************!*\
  !*** ./src/ProvenanceView/styles.scss ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader!../../node_modules/postcss-loader/lib??ref--5-3!../../node_modules/sass-loader/lib/loader.js!./styles.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/ProvenanceView/styles.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/ProvenanceView/uiBuilderFunctions.ts":
/*!**************************************************!*\
  !*** ./src/ProvenanceView/uiBuilderFunctions.ts ***!
  \**************************************************/
/*! exports provided: createButtons, createGraph */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createButtons", function() { return createButtons; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createGraph", function() { return createGraph; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");

function createButtons(el, graph) {
    el.select(".redo").classed("disable", false);
    el.select(".undo").classed("disable", false);
    if (graph.current.children.length === 0) {
        el.select(".redo").classed("disable", true);
    }
    if (graph.current.label === "Root") {
        el.select(".undo").classed("disable", true);
    }
}
function createGraph(el, graph, comm) {
    addSvg(el);
    let g = el.select(".graph-group");
    let h = el.node().getBoundingClientRect().width * 0.9;
    let height = h;
    let width = 150;
    let treeMap = d3__WEBPACK_IMPORTED_MODULE_0__["tree"]().size([width, height]);
    let root = d3__WEBPACK_IMPORTED_MODULE_0__["hierarchy"](graph.root, d => {
        return d.children;
    });
    let nodes = treeMap(root);
    let link = addLinks(g, nodes);
    let node = addNodes(g, nodes);
    addClickToNodes(node, comm);
    translateNodesToPosition(node);
    addNodeElements(node, graph.current.id);
}
function addNodeElements(node, current) {
    node
        .append("circle")
        .attr("r", 5)
        .attr("class", d => {
        if (d.data.id === current) {
            return "current";
        }
        return "";
    });
    node
        .append("text")
        .attr("dy", "0.35em")
        .attr("x", d => {
        return d.children ? -13 : 13;
    })
        .style("text-anchor", d => {
        return d.children ? "end" : "start";
    })
        .text((d, i) => {
        return i;
    });
}
function translateNodesToPosition(node) {
    node.attr("transform", d => {
        return `translate(${d.y}, ${d.x})`;
    });
}
function addClickToNodes(node, comm) {
    node.on("click", (d, i) => {
        comm.emit("go-to-node", d.data.id);
    });
}
function addNodes(g, nodes) {
    return g
        .selectAll(".node")
        .data(nodes.descendants())
        .enter()
        .append("g")
        .attr("class", d => {
        return `node ${d.children ? "node-internal" : "node-leaf"}`;
    });
}
function addLinks(g, nodes) {
    return g
        .selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d => {
        return `M ${d.y}, ${d.x}
              C ${(d.y + d.parent.y) / 2}, ${d.x} 
                ${(d.y + d.parent.y) / 2}, ${d.parent.x} 
                ${d.parent.y}, ${d.parent.x}`;
    });
}
function addSvg(el) {
    let _graphGroup = el.selectAll(".graph-svg").data([1]);
    _graphGroup.exit().remove();
    _graphGroup
        .enter()
        .append("svg")
        .attr("class", "graph-svg")
        .attr("width", "100%")
        .merge(_graphGroup)
        .html("")
        .append("g")
        .attr("class", "graph-group")
        .attr("transform", `translate(20, 0)`);
}


/***/ }),

/***/ "./src/UnusedSetsView/UnusedSetView.ts":
/*!*********************************************!*\
  !*** ./src/UnusedSetsView/UnusedSetView.ts ***!
  \*********************************************/
/*! exports provided: UnusedSetView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnusedSetView", function() { return UnusedSetView; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _unusedset_view_html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unusedset.view.html */ "./src/UnusedSetsView/unusedset.view.html");
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:24
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-05 18:26:24
 */



class UnusedSetView extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__["ViewBase"] {
    constructor(root) {
        super(root);
    }
    create() {
        this.headerVis = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root);
        let view = this.headerVis.append("div").attr("class", "unused-set-view");
        view.html(view.html() + _unusedset_view_html__WEBPACK_IMPORTED_MODULE_2__["default"]);
    }
    update(data) {
        let dropDown = this.headerVis
            .select(".unused-set-view")
            .select("#unsed-set-dropdown");
        let options = this.headerVis
            .select(".unused-set-view")
            .select("#unused-set-options");
        this.updateDropdownOptions(options, data.unusedSets);
        if (data.unusedSets.length < 1) {
            dropDown.style("display", "none");
        }
        else {
            dropDown.style("display", "block");
        }
    }
    updateDropdownOptions(opt, data) {
        let options = opt.selectAll(".dropdown-item").data(data);
        options.exit().remove();
        options
            .enter()
            .append("div")
            .merge(options)
            .attr("class", "dropdown-item")
            .text((d, i) => {
            return d.elementName;
        })
            .on("click", (d, i) => {
            this.comm.emit("add-set-trigger", d);
        });
    }
}


/***/ }),

/***/ "./src/UnusedSetsView/UnusedSetViewModel.ts":
/*!**************************************************!*\
  !*** ./src/UnusedSetsView/UnusedSetViewModel.ts ***!
  \**************************************************/
/*! exports provided: UnusedSetViewModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnusedSetViewModel", function() { return UnusedSetViewModel; });
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/UnusedSetsView/style.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_1__);
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:29
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-08 15:33:52
 */


class UnusedSetViewModel extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__["ViewModelBase"] {
    constructor(view, app) {
        super(view, app);
        this.datasets = [];
        this.App.on("render-rows-changed", this.update, this);
        this.registerFunctions("add-set", (d) => {
            this.App.emit("add-set", d);
        }, this);
        this.registerFunctions("add-set", (d) => {
            this.App.emit("remove-set", d);
        }, this, false);
        this.comm.on("add-set-trigger", (d) => {
            let _do = {
                func: (d) => {
                    this.App.emit("add-set", d);
                },
                args: [d]
            };
            let _undo = {
                func: (d) => {
                    this.App.emit("remove-set", d);
                },
                args: [d]
            };
            this.apply.call(this, ["add_set", _do, _undo]);
        });
    }
    update(data) {
        this.comm.emit("update", data);
    }
}


/***/ }),

/***/ "./src/UnusedSetsView/style.scss":
/*!***************************************!*\
  !*** ./src/UnusedSetsView/style.scss ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader!../../node_modules/postcss-loader/lib??ref--5-3!../../node_modules/sass-loader/lib/loader.js!./style.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/UnusedSetsView/style.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/UnusedSetsView/unusedset.view.html":
/*!************************************************!*\
  !*** ./src/UnusedSetsView/unusedset.view.html ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<div class="dropdown is-hoverable">
  <div id="unsed-set-dropdown" class="dropdown-trigger navbar-link">
    Add Sets
  </div>
  <div class="dropdown-menu">
    <div id="unused-set-options" class="dropdown-content">
      <!-- <div class="dropdown-item">Test</div> -->
    </div>
  </div>
</div>`);

/***/ }),

/***/ "./src/UpsetView/UpsetView.ts":
/*!************************************!*\
  !*** ./src/UpsetView/UpsetView.ts ***!
  \************************************/
/*! exports provided: UpsetView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpsetView", function() { return UpsetView; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles.scss */ "./src/UpsetView/styles.scss");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _upset_view_html__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./upset.view.html */ "./src/UpsetView/upset.view.html");
/* harmony import */ var _uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./uiBuilderFunctions */ "./src/UpsetView/uiBuilderFunctions.ts");
/* harmony import */ var _ui_params__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ui_params */ "./src/UpsetView/ui_params.ts");
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:32
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-20 14:00:11
 */






class UpsetView extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__["ViewBase"] {
    constructor(root, config) {
        super(root);
        this.config = config;
    }
    create() {
        let root = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root);
        root.html(root.html() + _upset_view_html__WEBPACK_IMPORTED_MODULE_3__["default"]);
        this.svg = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root)
            .select("#vis")
            .append("svg");
        this.headerGroup = this.svg.append("g").attr("class", "header");
        this.selectedSetHeaderGroup = this.headerGroup
            .append("g")
            .attr("class", "selected-sets-header");
        this.cardinalityScaleGroup = this.headerGroup
            .append("g")
            .attr("class", "cardinality-scale-group");
        this.deviationGroup = this.headerGroup
            .append("g")
            .attr("class", "deviation-group");
        this.attributeHeaders = this.headerGroup
            .append("g")
            .attr("class", "attribute-headers");
        this.bodyGroup = this.svg
            .append("g")
            .attr("class", "body")
            .attr("transform", `translate(0,${_ui_params__WEBPACK_IMPORTED_MODULE_5__["default"].header_body_padding})`);
        this.setsComboGroup = this.bodyGroup
            .append("g")
            .attr("class", "sets-combo-group");
    }
    update(data) {
        Object(_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_4__["usedSetsHeader"])(data.usedSets, this.selectedSetHeaderGroup, d3__WEBPACK_IMPORTED_MODULE_0__["max"](data.sets, d => {
            return d.setSize;
        }), this.comm);
        Object(_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_4__["addRenderRows"])(data, this.setsComboGroup, data.usedSets.length, this.config);
        if (!this.config || this.config.CardinalityBars) {
            Object(_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_4__["addCardinalityHeader"])(data.allItems.length, d3__WEBPACK_IMPORTED_MODULE_0__["max"](data.renderRows.map(d => d.data.setSize)), this.cardinalityScaleGroup, this.comm);
        }
        if (!this.config || this.config.DeviationBars) {
            Object(_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_4__["addDeviationHeaders"])(this.deviationGroup, d3__WEBPACK_IMPORTED_MODULE_0__["max"](data.renderRows.map(d => Math.abs(d.data.disproportionality))), this.comm);
        }
        this.svg.attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_5__["default"].svg_height).attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_5__["default"].svg_width);
    }
}


/***/ }),

/***/ "./src/UpsetView/UpsetViewModel.ts":
/*!*****************************************!*\
  !*** ./src/UpsetView/UpsetViewModel.ts ***!
  \*****************************************/
/*! exports provided: UpsetViewModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpsetViewModel", function() { return UpsetViewModel; });
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__);

class UpsetViewModel extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__["ViewModelBase"] {
    constructor(view, app) {
        super(view, app);
        this.App.on("render-rows-changed", this.update, this);
        this.comm.on("sort-by-set", (id) => {
            this.App.emit("sort-by-set", id);
        });
        this.comm.on("sort-by-cardinality", () => {
            this.App.emit("sort-by-cardinality");
        });
        this.comm.on("sort-by-deviation", () => {
            this.App.emit("sort-by-deviation");
        });
        this.registerFunctions("remove_set", (d) => {
            this.App.emit("remove-set", d);
        }, this);
        this.registerFunctions("remove_set", (d) => {
            this.App.emit("add-set", d);
        }, this, false);
        this.comm.on("remove-set-trigger", (d) => {
            let _do = {
                func: (d) => {
                    this.App.emit("remove-set", d);
                },
                args: [d]
            };
            let _undo = {
                func: (d) => {
                    this.App.emit("add-set", d);
                },
                args: [d]
            };
            this.apply.call(this, ["remove_set", _do, _undo]);
        });
        this.comm.on("set-filter", idx => {
            this.App.emit("filter-changed", null, idx);
            this.App.emit("set-agg-none");
        });
    }
    update(data) {
        this.comm.emit("update", data);
    }
}


/***/ }),

/***/ "./src/UpsetView/styles.scss":
/*!***********************************!*\
  !*** ./src/UpsetView/styles.scss ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader!../../node_modules/postcss-loader/lib??ref--5-3!../../node_modules/sass-loader/lib/loader.js!./styles.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/UpsetView/styles.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/UpsetView/uiBuilderFunctions.ts":
/*!*********************************************!*\
  !*** ./src/UpsetView/uiBuilderFunctions.ts ***!
  \*********************************************/
/*! exports provided: usedSetsHeader, addCardinalityHeader, addDeviationHeaders, addRenderRows */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "usedSetsHeader", function() { return usedSetsHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addCardinalityHeader", function() { return addCardinalityHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addDeviationHeaders", function() { return addDeviationHeaders; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addRenderRows", function() { return addRenderRows; });
/* harmony import */ var _ui_params__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui_params */ "./src/UpsetView/ui_params.ts");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../DataStructure/RowType */ "./src/DataStructure/RowType.ts");



let excludeSets = ["Name", "Set Count", "Sets"];
// ################################################################################################
function usedSetsHeader(data, el, maxSetSize, comm) {
    addHeaderBars(data, el, maxSetSize, comm);
    addConnectors(data, el, comm);
}
function addHeaderBars(data, el, maxSetSize, comm) {
    let headerBarGroup = el.selectAll(".header-bar-group").data([1]);
    headerBarGroup.exit().remove();
    let _headers = headerBarGroup
        .enter()
        .append("g")
        .attr("class", "header-bar-group")
        .merge(headerBarGroup)
        .selectAll(".header")
        .data(data);
    _headers
        .exit()
        .transition()
        .duration(100)
        .remove();
    let headers = _headers
        .enter()
        .append("g")
        .merge(_headers)
        .html("")
        .attr("class", "header");
    headers
        .transition()
        .duration(100)
        .attr("transform", (d, i) => {
        return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width * i}, 0)`;
    });
    headers
        .on("click", (d, i) => {
        comm.emit("remove-set-trigger", d);
    })
        .on("mouseover", (d, i) => {
        d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](`.S_${i}`).classed("highlight", true);
    })
        .on("mouseout", (d, i) => {
        d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](`.S_${i}`).classed("highlight", false);
    });
    addBackgroundBars(headers);
    addForegroundBars(headers, maxSetSize);
}
function addBackgroundBars(headers) {
    headers
        .append("rect")
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].used_set_header_height)
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width)
        .attr("class", (d, i) => {
        return `used-set-background S_${i}`;
    });
}
function addForegroundBars(headers, maxSetSize) {
    let scale = d3__WEBPACK_IMPORTED_MODULE_1__["scaleLinear"]()
        .domain([0, maxSetSize])
        .nice()
        .range([0, _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].used_set_header_height]);
    headers
        .append("rect")
        .attr("height", (d, i) => {
        return scale(d.setSize);
    })
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width)
        .attr("class", "used-set-foreground")
        .attr("transform", (d, i) => {
        return `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].used_set_header_height -
            scale(d.setSize)})`;
    });
}
function addConnectors(data, el, comm) {
    let connectorGroup = el.selectAll(".connector-group").data([1]);
    connectorGroup.exit().remove();
    let _connectors = connectorGroup
        .enter()
        .append("g")
        .merge(connectorGroup)
        .attr("class", "connector-group")
        .attr("transform", `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].used_set_header_height})`)
        .selectAll(".connector")
        .data(data);
    _connectors
        .exit()
        .transition()
        .duration(100)
        .remove();
    let connectors = _connectors
        .enter()
        .append("g")
        .merge(_connectors)
        .html("")
        .attr("class", "connector")
        .on("mouseover", (d, i) => {
        d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](`.S_${i}`).classed("highlight", true);
    })
        .on("mouseout", (d, i) => {
        d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](`.S_${i}`).classed("highlight", false);
    });
    connectors
        .transition()
        .duration(100)
        .attr("transform", (d, i) => {
        return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width * i}, 0)`;
    });
    connectors.on("click", (d, i) => {
        comm.emit("sort-by-set", i);
    });
    addConnectorBars(connectors);
    addConnectorLabels(connectors);
}
function addConnectorBars(connectors) {
    connectors
        .append("rect")
        .attr("class", (d, i) => {
        return `connector-rect S_${i}`;
    })
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width)
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].used_set_connector_height)
        .attr("transform", `skewX(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].used_set_connector_skew})`);
}
function addConnectorLabels(connectors) {
    connectors
        .append("text")
        .text((d) => {
        return d.elementName;
    })
        .attr("class", "set-label")
        .attr("text-anchor", "end")
        .attr("transform", `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].skew_offset +
        (_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width *
            Math.sin(Object(_ui_params__WEBPACK_IMPORTED_MODULE_0__["deg2rad"])(_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].used_set_connector_skew))) /
            2},${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].used_set_connector_height})rotate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].used_set_connector_skew})`);
}
// ################################################################################################
function addCardinalityHeader(totalSize, maxSetSize, el, comm) {
    el.attr("transform", `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].skew_offset +
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].combinations_width +
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width}, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].header_height -
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].header_body_padding -
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_scale_group_height})`);
    el.html("");
    let overviewAxis = el.append("g").attr("class", "overview-axis");
    let detailsAxis = el.append("g").attr("class", "details-axis");
    let cardinalitySlider = el.append("g").attr("class", "cardinality-slider");
    let sliderBrush = el.append("g").attr("class", "slider-brush-group");
    let cardinalityLabel = el
        .append("g")
        .attr("class", "cardinality-label-group")
        .on("click", () => {
        comm.emit("sort-by-cardinality");
    });
    let scaleOverview = getCardinalityScale(totalSize, _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width);
    addOverviewAxis(overviewAxis, scaleOverview, totalSize);
    addCardinalitySlider(cardinalitySlider, maxSetSize, scaleOverview, comm);
    addBrush(sliderBrush, scaleOverview(maxSetSize));
    addCardinalityLabel(cardinalityLabel);
    let scaleDetails = getCardinalityScale(maxSetSize, _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width);
    addDetailAxis(detailsAxis, scaleDetails, maxSetSize);
}
function addOverviewAxis(el, scale, totalSize) {
    el.attr("transform", "translate(0,0)");
    let top = el.append("g").attr("class", "top-axis");
    top
        .append("path")
        .attr("class", "axis")
        .attr("d", "M0,6 V0 h200 v6");
    let ticksArr = calculateTicksToShow(totalSize);
    let ticksG = addTicks(top, ticksArr, scale, 0);
    addTickLabels(ticksG);
    let bottom = el.append("g").attr("class", "bottom-axis");
    bottom
        .append("path")
        .attr("class", "axis")
        .attr("d", `M0,${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].axis_offset} H200`);
    addTicks(bottom, ticksArr, scale, _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].axis_offset - 6);
}
function addCardinalitySlider(el, maxSetSize, scale, comm) {
    el.attr("transform", `translate(${scale(maxSetSize)},${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].axis_offset / 2 - 7})`);
    addDragEvents(el, scale, comm);
    let slider = el
        .append("rect")
        .attr("class", "cardinality-slider-rect")
        .attr("transform", "rotate(45)")
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_slider_dims)
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_slider_dims);
}
function addBrush(el, pos) {
    el.append("rect")
        .attr("class", "slider-brush")
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].axis_offset)
        .attr("width", pos);
}
function addCardinalityLabel(el) {
    let textGroup = el
        .append("g")
        .attr("class", "inner-text-group")
        .attr("transform", `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_scale_group_height / 2 -
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_label_height / 2})`);
    let sliderInfluence = el.append("g").attr("class", "slider-influence hide");
    textGroup
        .append("rect")
        .attr("class", "cardinality-label-rect")
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width)
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_label_height);
    textGroup
        .append("text")
        .text("Cardinality")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width / 2},${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_bar_height})`);
    sliderInfluence.append("path").attr("class", "slider-brush-path");
}
function updateBrushAndSlider(pos) {
    d3__WEBPACK_IMPORTED_MODULE_1__["select"](".slider-brush").attr("width", pos);
    d3__WEBPACK_IMPORTED_MODULE_1__["select"](".slider-influence")
        .select(".slider-brush-path")
        .attr("d", `M ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width} ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_scale_group_height -
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].axis_offset} H0 V ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].axis_offset} H${pos}`);
}
function addDragEvents(el, scale, comm) {
    comm.on("slider-moved", (d) => {
        adjustCardinalityBars(d);
        updateDetailsScale(d);
        updateBrushAndSlider(scale(d));
    });
    el.call(d3__WEBPACK_IMPORTED_MODULE_1__["drag"]()
        .on("start", dragStart)
        .on("drag", dragged)
        .on("end", dragEnd));
    function dragStart() {
        d3__WEBPACK_IMPORTED_MODULE_1__["select"](this)
            .raise()
            .classed("active", true);
        d3__WEBPACK_IMPORTED_MODULE_1__["select"](".inner-text-group").classed("hide", true);
        d3__WEBPACK_IMPORTED_MODULE_1__["select"](".slider-influence").classed("hide", false);
    }
    function dragged() {
        let x = d3__WEBPACK_IMPORTED_MODULE_1__["event"].x;
        if (x > scale(6) && x <= _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width) {
            if (Math.abs(x - 0) <= 0.9)
                x = 1;
            if (Math.abs(x - _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width) <= 0.9)
                x = _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width;
            d3__WEBPACK_IMPORTED_MODULE_1__["select"](this).attr("transform", `translate(${x}, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].axis_offset / 2 - 7})`);
            comm.emit("slider-moved", scale.invert(x));
        }
    }
    function dragEnd() {
        d3__WEBPACK_IMPORTED_MODULE_1__["select"](this).classed("active", false);
        d3__WEBPACK_IMPORTED_MODULE_1__["select"](".slider-influence").classed("hide", true);
        d3__WEBPACK_IMPORTED_MODULE_1__["select"](".inner-text-group").classed("hide", false);
    }
}
function updateDetailsScale(setSize) {
    let el = d3__WEBPACK_IMPORTED_MODULE_1__["select"](".details-axis");
    let scale = getCardinalityScale(setSize, _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width);
    addDetailAxis(el, scale, Math.floor(setSize));
}
function addDetailAxis(el, scale, size) {
    el.attr("transform", `translate(0,${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_scale_group_height - _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].axis_offset})`);
    el.html("");
    let top = el.append("g").attr("class", "top-axis");
    top
        .append("path")
        .attr("class", "axis")
        .attr("d", "M0,6 V0 h200 v6");
    let ticksArr = calculateTicksToShow(size);
    let ticksG = addTicks(top, ticksArr, scale, 0);
    addTickLabels(ticksG);
    let bottom = el.append("g").attr("class", "bottom-axis");
    bottom
        .append("path")
        .attr("class", "axis")
        .attr("d", `M0,${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].axis_offset} H200 `);
    addTicks(bottom, ticksArr, scale, _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].axis_offset - 6);
}
function addTicks(el, ticksArr, scale, y_offset, x_offset = 0) {
    let g = el.selectAll(".tick-group").data([1]);
    g.exit().remove();
    let _g = g
        .enter()
        .append("g")
        .merge(g)
        .attr("class", "tick-group")
        .attr("transform", `translate(${x_offset}, 0)`);
    let ticksG = _g.selectAll(".tick-g").data(ticksArr);
    ticksG.exit().remove();
    let ticks = ticksG
        .enter()
        .append("g")
        .attr("class", "tick-g")
        .merge(ticksG)
        .attr("transform", (d, i) => {
        return `translate(${scale(d)}, ${y_offset})`;
    });
    ticks
        .append("path")
        .attr("class", "tick")
        .attr("d", "M0,6 V0");
    return ticks;
}
function addTickLabels(ticks, skipDenominator = 2, offset = 20) {
    ticks
        .append("text")
        .attr("class", "tick-label")
        .text((d, i) => {
        if (i % skipDenominator === 0)
            return d;
    })
        .attr("text-anchor", "middle")
        .attr("dy", offset);
}
function calculateTicksToShow(setSize) {
    if (setSize <= 10)
        return [...Array(setSize).keys(), setSize];
    else if (setSize <= 25)
        return [
            ...[...Array(setSize).keys()].filter(n => {
                return n % 2 === 0;
            }),
            setSize
        ];
    else if (setSize <= 100)
        return [
            ...[...Array(setSize).keys()].filter(n => {
                return n % 20 === 0;
            }),
            setSize
        ];
    else if (setSize <= 300)
        return [
            ...[...Array(setSize).keys()].filter(n => {
                return n % 40 === 0;
            }),
            setSize
        ];
    else if (setSize <= 1000)
        return [
            ...[...Array(setSize).keys()].filter(n => {
                return n % 100 === 0;
            }),
            setSize
        ];
    else if (setSize <= 2000)
        return [
            ...[...Array(setSize).keys()].filter(n => {
                return n % 200 === 0;
            }),
            setSize
        ];
    else if (setSize <= 6000)
        return [
            ...[...Array(setSize).keys()].filter(n => {
                return n % 500 === 0;
            }),
            setSize
        ];
    else
        return [
            ...[...Array(setSize).keys()].filter(n => {
                return n % 2000 === 0;
            }),
            setSize
        ];
}
// ################################################################################################
function addDeviationHeaders(el, maxDisprop, comm) {
    el.html("");
    el.attr("transform", `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].skew_offset +
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].combinations_width +
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width +
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width * 3}, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].header_height -
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].header_body_padding -
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_scale_group_height +
        3})`);
    addDeviationLabel(el, comm);
    addDeviationScale(el, Math.ceil((maxDisprop * 100) / 5) * 5);
}
function addDeviationLabel(el, comm) {
    el.append("rect")
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_label_height)
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_width)
        .attr("class", "deviation-label")
        .on("click", () => {
        comm.emit("sort-by-deviation");
    });
    el.append("text")
        .text("Deviation")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_width / 2}, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_bar_height})`);
}
function addDeviationScale(el, maxSize) {
    let scale = d3__WEBPACK_IMPORTED_MODULE_1__["scaleLinear"]()
        .domain([-maxSize, maxSize])
        .range([-_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_width / 2, _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_width / 2]);
    let domain = [];
    let start = -maxSize;
    while (start <= maxSize) {
        domain.push(start);
        start += 5;
    }
    let g = el.append("g").attr("class", "scale-group");
    g.attr("transform", `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_scale_group_height - _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].axis_offset})`);
    g.append("path")
        .attr("class", "axis")
        .attr("d", `M0,${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_scale_group_height -
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].axis_offset -
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].header_body_padding} H${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_width}`);
    let ticks = addTicks(g, domain, scale, _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].axis_offset - _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].header_body_padding - 6, _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_width / 2);
    addTickLabels(ticks, 1, -2);
}
// ################################################################################################
function addRenderRows(data, el, usedSetCount, config) {
    el.attr("transform", `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].used_set_group_height})`);
    _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_group_height = _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height * data.renderRows.length;
    _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].combinations_width = _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width * usedSetCount;
    _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].used_sets = usedSetCount;
    let rows;
    let groups;
    let subsets;
    if (config && !config.CardinalityBars)
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width = 0;
    if (config && !config.DeviationBars)
        _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_width = 0;
    setupColumnBackgrounds(el, usedSetCount);
    [rows, groups, subsets] = addRows(data.renderRows, el);
    setupSubsets(subsets);
    setupGroups(groups);
    if (!config || config.CardinalityBars) {
        addCardinalityBars(rows, data.renderRows);
    }
    if (!config || config.DeviationBars) {
        addDeviationBars(rows, data.renderRows);
    }
    addAttributes(rows, data);
}
/** ************* */
function setupColumnBackgrounds(el, usedSets) {
    let _bg = el.selectAll(".column-background-group").data([1]);
    _bg.exit().remove();
    let backgroundGroup = _bg
        .enter()
        .append("g")
        .merge(_bg)
        .html("")
        .attr("class", "column-background-group")
        .attr("transform", `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].skew_offset}, 0)`);
    let arr = [...Array(usedSets).keys()];
    let rects = backgroundGroup.selectAll(".vert-set-rect").data(arr);
    rects.exit().remove();
    rects
        .enter()
        .append("rect")
        .merge(rects)
        .attr("class", (d, i) => {
        return `vert-set-rect S_${i}`;
    })
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width)
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_group_height)
        .attr("transform", (d, i) => {
        return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width * i}, 0)`;
    });
}
function addRows(data, el) {
    let _rows = el.selectAll(".row").data(data);
    _rows
        .exit()
        .transition()
        .duration(100)
        .remove();
    let rows = _rows
        .enter()
        .append("g")
        .merge(_rows)
        .html("")
        .attr("class", (d, i) => {
        return `row ${d.data.type}`;
    });
    rows
        .transition()
        .duration(100)
        .attr("transform", (d, i) => {
        if (d.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_2__["RowType"].GROUP)
            return `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height * i})`;
        return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].skew_offset}, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height * i})`;
    });
    setupElementGroups(rows);
    let groups = rows.filter((d, i) => {
        return d.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_2__["RowType"].GROUP;
    });
    groups.append("g").attr("class", "group-label-g");
    let subsets = rows.filter((d, i) => {
        return d.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_2__["RowType"].SUBSET;
    });
    return [rows, groups, subsets];
}
function setupElementGroups(rows) {
    rows.append("g").attr("class", "background-rect-g");
    rows
        .append("g")
        .attr("class", "cardinality-bar-group")
        .attr("transform", (d, i) => {
        if (d.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_2__["RowType"].GROUP)
            return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].skew_offset +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].combinations_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width}, ${(_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height -
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_bar_height) /
                2})`;
        return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].combinations_width +
            _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width}, ${(_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height -
            _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_bar_height) /
            2})`;
    });
    rows
        .append("g")
        .attr("class", "deviation-bar-group")
        .attr("transform", (d, i) => {
        if (d.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_2__["RowType"].GROUP)
            return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].skew_offset +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].combinations_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width * 3},${(_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height -
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_bar_height) /
                2})`;
        else
            return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].combinations_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width * 2},${(_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height -
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_bar_height) /
                2})`;
    });
    rows
        .append("g")
        .attr("class", "attribute-group")
        .attr("transform", d => {
        if (d.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_2__["RowType"].GROUP)
            return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].skew_offset +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].combinations_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width * 4},${(_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height -
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_bar_height) /
                2})`;
        else
            return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].combinations_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width * 3},${(_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height -
                _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_bar_height) /
                2})`;
    });
}
/** ************* */
/** ************* */
function setupSubsets(subsets) {
    subsets
        .on("mouseover", function () {
        d3__WEBPACK_IMPORTED_MODULE_1__["select"](this)
            .select("rect")
            .classed("highlight highlight2", true);
    })
        .on("mouseout", function () {
        d3__WEBPACK_IMPORTED_MODULE_1__["select"](this)
            .select("rect")
            .classed("highlight highlight2", false);
    });
    addSubsetBackgroundRects(subsets);
    addCombinations(subsets);
}
function addSubsetBackgroundRects(subsets) {
    subsets
        .selectAll(".background-rect-g")
        .append("rect")
        .attr("class", `subset-background-rect`)
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height)
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].subset_row_width);
}
function addCombinations(subset) {
    let combinationsGroup = subset.append("g").attr("class", "combination");
    combinationsGroup.each(function (d) {
        let membershipDetails = d.data.combinedSets;
        let degree = membershipDetails.reduce((i, j) => i + j, 0);
        let comboGroup = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this)
            .selectAll(".set-membership")
            .data(membershipDetails);
        addCombinationCircles(comboGroup);
        addRowHighlight(this);
        if (degree > 1) {
            let first = membershipDetails.indexOf(1);
            let last = membershipDetails.lastIndexOf(1);
            addCombinationLine(this, first, last);
        }
    });
}
function addCombinationCircles(comboGroup) {
    comboGroup
        .exit()
        .transition()
        .duration(100)
        .remove();
    comboGroup
        .enter()
        .append("circle")
        .merge(comboGroup)
        .attr("r", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].combo_circle_radius)
        .attr("cy", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height / 2)
        .attr("cx", (d, i) => {
        return _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width / 2 + _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width * i;
    })
        .attr("class", (d, i) => {
        if (d === 0)
            return `set-membership not-member`;
        return `set-membership member`;
    })
        .on("mouseover", function (d, i) {
        let parentG = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this).node().parentNode;
        let rect = d3__WEBPACK_IMPORTED_MODULE_1__["select"](parentG).node().parentNode;
        d3__WEBPACK_IMPORTED_MODULE_1__["select"](rect)
            .select("rect")
            .classed("highlight highlight2", true);
        d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](`.S_${i}`).classed("highlight", true);
    })
        .on("mouseout", function (d, i) {
        let parentG = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this).node().parentNode;
        let rect = d3__WEBPACK_IMPORTED_MODULE_1__["select"](parentG).node().parentNode;
        d3__WEBPACK_IMPORTED_MODULE_1__["select"](rect)
            .select("rect")
            .classed("highlight highlight2", false);
        d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](`.S_${i}`).classed("highlight", false);
    });
}
function addCombinationLine(el, first, last) {
    d3__WEBPACK_IMPORTED_MODULE_1__["select"](el)
        .append("line")
        .attr("class", "combination-line")
        .attr("x1", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width / 2 + _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width * first)
        .attr("x2", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width / 2 + _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].column_width * last)
        .attr("y1", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height / 2)
        .attr("y2", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height / 2);
}
function addRowHighlight(el) {
    d3__WEBPACK_IMPORTED_MODULE_1__["select"](el)
        .on("mouseover", function (d) {
        d.data.combinedSets.forEach((idx, i) => {
            if (idx === 1)
                d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](`.S_${i}`).classed("highlight", true);
        });
    })
        .on("mouseout", function (d, i) {
        d.data.combinedSets.forEach((idx, i) => {
            d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](`.S_${i}`).classed("highlight", false);
        });
    });
}
/** ************* */
/** ************* */
function setupGroups(groups) {
    addGroupBackgroundRects(groups);
    addGroupLabels(groups);
}
function addGroupBackgroundRects(groups) {
    groups
        .selectAll(".background-rect-g")
        .append("rect")
        .attr("class", "group-background-rect")
        .classed("group-background-rect2", (d, i) => {
        if (d.data.level === 2)
            return true;
        return false;
    })
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height)
        .attr("width", (d) => {
        if (d.data.level === 2)
            return _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].group_row_width - 20;
        return _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].group_row_width;
    })
        .attr("transform", (d) => {
        if (d.data.level === 2)
            return `translate(20, 0)`;
        return "translate(0,0)";
    })
        .attr("rx", 5)
        .attr("ry", 10);
}
function addGroupLabels(groups) {
    groups
        .selectAll(".group-label-g")
        .append("text")
        .attr("class", "group-label-g")
        .text((d, i) => {
        return d.data.elementName;
    })
        .attr("transform", (d, i) => {
        if (d.data.level === 2)
            return `translate(30, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height - 4})`;
        return `translate(10, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].row_height - 4})`;
    });
}
/** ************* */
/** ************* */
function addCardinalityBars(rows, data) {
    let maxSubsetSize = d3__WEBPACK_IMPORTED_MODULE_1__["max"](data.map(d => d.data.setSize));
    let scale = getCardinalityScale(maxSubsetSize, _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width);
    let cardinalityGroups = rows.selectAll(".cardinality-bar-group");
    renderCardinalityBars(cardinalityGroups, scale);
}
function adjustCardinalityBars(maxDomain) {
    let scale = getCardinalityScale(maxDomain, _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width);
    let el = d3__WEBPACK_IMPORTED_MODULE_1__["selectAll"](".row").selectAll(".cardinality-bar-group");
    renderCardinalityBars(el, scale);
}
function renderCardinalityBars(el, scale) {
    el.html("");
    el.each(function (d, i) {
        let g = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this);
        let width = scale(d.data.setSize);
        let loop = Math.floor(width / _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width) + 1;
        let rem = width % _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width;
        let brk = false;
        if (loop > 3) {
            brk = true;
            loop = 4;
            rem = 0;
        }
        let offset = _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].horizon_offset;
        let hb = g.selectAll(".cardinality-bar").data([...Array(loop).keys()]);
        hb.exit().remove();
        hb.enter()
            .append("rect")
            .merge(hb)
            .attr("class", (d, i) => {
            return `cardinality-bar cardinality-bar${i}`;
        })
            .attr("width", (d, i) => {
            if (i + 1 === loop)
                return rem;
            return _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width;
        })
            .attr("height", (d, i) => {
            let height = _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_bar_height - offset * i;
            if (height < 0)
                return 2;
            return height;
        })
            .attr("transform", (d, i) => {
            return `translate(0, ${((_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_bar_height - offset) * i) /
                4})`;
        });
        if (brk) {
            g.append("line")
                .attr("class", "break-bar")
                .attr("y1", 0)
                .attr("y2", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_bar_height)
                .attr("x1", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width - 20)
                .attr("x2", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width - 10);
            g.append("line")
                .attr("class", "break-bar")
                .attr("y1", 0)
                .attr("y2", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_bar_height)
                .attr("x1", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width - 25)
                .attr("x2", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width - 15);
        }
        g.append("text")
            .attr("class", "cardinality-text")
            .text(d.data.setSize)
            .attr("transform", (d, i) => {
            return loop > 1
                ? `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_width +
                    5}, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_bar_height / 2})`
                : `translate(${rem + 5}, ${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].cardinality_bar_height / 2})`;
        })
            .attr("dy", "0.4em");
    });
}
function getCardinalityScale(maxSize, maxWidth) {
    if (maxSize > 8000) {
        return d3__WEBPACK_IMPORTED_MODULE_1__["scalePow"]()
            .exponent(0.75)
            .domain([0.01, maxSize])
            .range([0.01, maxWidth]);
    }
    if (maxSize > 2000) {
        return d3__WEBPACK_IMPORTED_MODULE_1__["scalePow"]()
            .exponent(0.8)
            .domain([0.01, maxSize])
            .range([0.01, maxWidth]);
    }
    return d3__WEBPACK_IMPORTED_MODULE_1__["scaleLinear"]()
        .domain([0, maxSize])
        .range([0, maxWidth]);
}
/** ************* */
/** ************* */
function addDeviationBars(rows, data) {
    let maxDeviation = d3__WEBPACK_IMPORTED_MODULE_1__["max"](data.map(r => Math.abs(r.data.disproportionality * 100)));
    maxDeviation = Math.ceil(maxDeviation / 5) * 5;
    let scale = getDeviationScale(maxDeviation, _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_width / 2);
    let deviationGroup = rows.selectAll(".deviation-bar-group");
    renderDeviationBars(deviationGroup, scale);
}
function getDeviationScale(maxSize, maxWidth) {
    return d3__WEBPACK_IMPORTED_MODULE_1__["scaleLinear"]()
        .domain([0, maxSize])
        .range([0, maxWidth]);
}
function renderDeviationBars(el, scale) {
    el.html("")
        .append("rect")
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_width)
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_bar_height)
        .style("fill", "none");
    el.append("rect")
        .attr("class", (d, i) => {
        return d.data.disproportionality >= 0
            ? `disproportionality positive`
            : `disproportionality negative`;
    })
        .attr("height", (d, i) => {
        return _ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_bar_height;
    })
        .attr("width", (d, i) => {
        return scale(Math.abs(d.data.disproportionality) * 100);
    })
        .attr("transform", (d, i) => {
        return d.data.disproportionality >= 0
            ? `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_width / 2}, 0)`
            : `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_0__["default"].deviation_width / 2 +
                scale(d.data.disproportionality * 100)}, 0)`;
    });
}
/** ************* */
/** ************* */
// ! Undefined function???
function addAttributes(rows, data) { }


/***/ }),

/***/ "./src/UpsetView/ui_params.ts":
/*!************************************!*\
  !*** ./src/UpsetView/ui_params.ts ***!
  \************************************/
/*! exports provided: default, deg2rad */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deg2rad", function() { return deg2rad; });
let params = {
    header_body_padding: 5,
    used_sets: 0,
    column_width: 20,
    row_height: 20,
    used_set_header_height: 75,
    used_set_connector_height: 100,
    used_set_connector_skew: 45,
    get used_set_group_height() {
        return params.used_set_header_height + params.used_set_connector_height;
    },
    get skew_offset() {
        return (params.used_set_connector_height /
            Math.tan(deg2rad(params.used_set_connector_skew)));
    },
    row_group_height: 20,
    combinations_width: 0,
    get subset_row_width() {
        return (params.combinations_width +
            params.cardinality_width +
            params.deviation_width +
            params.attribute_group_width +
            params.column_width * 6);
    },
    get group_row_width() {
        return params.skew_offset + params.subset_row_width;
    },
    combo_circle_radius: 9,
    cardinality_width: 200,
    get cardinality_bar_height() {
        return params.row_height - 4;
    },
    cardinality_scale_group_height: 90,
    axis_offset: 30,
    cardinality_label_height: 24,
    cardinality_slider_dims: 10,
    horizon_offset: 6,
    deviation_width: 200,
    get deviation_bar_height() {
        return params.row_height - 4;
    },
    deviation_scale_group_height: 60,
    deviation_label_height: 24,
    no_attributes_shown: 0,
    attribute_width: 100,
    get attribute_group_width() {
        return params.no_attributes_shown * (params.attribute_width + 20);
    },
    get header_height() {
        return params.used_set_group_height;
    },
    get svg_height() {
        return (params.used_set_group_height +
            params.row_group_height +
            params.header_body_padding +
            5);
    },
    get svg_width() {
        return `${100}%`;
    }
};
/* harmony default export */ __webpack_exports__["default"] = (params);
function deg2rad(deg) {
    return (deg * Math.PI) / 180;
}


/***/ }),

/***/ "./src/UpsetView/upset.view.html":
/*!***************************************!*\
  !*** ./src/UpsetView/upset.view.html ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<div id="vis"></div>`);

/***/ }),

/***/ "./src/app/ViewFactory.ts":
/*!********************************!*\
  !*** ./src/app/ViewFactory.ts ***!
  \********************************/
/*! exports provided: ViewFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewFactory", function() { return ViewFactory; });
class ViewFactory {
    constructor() {
        this.views = {};
    }
}


/***/ }),

/***/ "./src/app/app.ts":
/*!************************!*\
  !*** ./src/app/app.ts ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var popper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! popper.js */ "./node_modules/popper.js/dist/esm/popper.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _DataSetInfoView_DataSetInfoView__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../DataSetInfoView/DataSetInfoView */ "./src/DataSetInfoView/DataSetInfoView.ts");
/* harmony import */ var _DataSetInfoView_DataSetInfoViewModel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../DataSetInfoView/DataSetInfoViewModel */ "./src/DataSetInfoView/DataSetInfoViewModel.ts");
/* harmony import */ var _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../DataStructure/DataUtils */ "./src/DataStructure/DataUtils.ts");
/* harmony import */ var _EmbedGenView_EmbedGenView__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../EmbedGenView/EmbedGenView */ "./src/EmbedGenView/EmbedGenView.ts");
/* harmony import */ var _FilterBoxView_FilterBoxView__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../FilterBoxView/FilterBoxView */ "./src/FilterBoxView/FilterBoxView.ts");
/* harmony import */ var _FilterBoxView_FilterBoxViewModel__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../FilterBoxView/FilterBoxViewModel */ "./src/FilterBoxView/FilterBoxViewModel.ts");
/* harmony import */ var _NavBarView_NavBarView__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../NavBarView/NavBarView */ "./src/NavBarView/NavBarView.ts");
/* harmony import */ var _NavBarView_NavBarViewModel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../NavBarView/NavBarViewModel */ "./src/NavBarView/NavBarViewModel.ts");
/* harmony import */ var _ProvenanceView_ProvenanceView__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../ProvenanceView/ProvenanceView */ "./src/ProvenanceView/ProvenanceView.ts");
/* harmony import */ var _ProvenanceView_ProvenanceViewModel__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../ProvenanceView/ProvenanceViewModel */ "./src/ProvenanceView/ProvenanceViewModel.ts");
/* harmony import */ var _UnusedSetsView_UnusedSetView__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../UnusedSetsView/UnusedSetView */ "./src/UnusedSetsView/UnusedSetView.ts");
/* harmony import */ var _UpsetView_UpsetView__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../UpsetView/UpsetView */ "./src/UpsetView/UpsetView.ts");
/* harmony import */ var _UnusedSetsView_UnusedSetViewModel__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./../UnusedSetsView/UnusedSetViewModel */ "./src/UnusedSetsView/UnusedSetViewModel.ts");
/* harmony import */ var _UpsetView_UpsetViewModel__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./../UpsetView/UpsetViewModel */ "./src/UpsetView/UpsetViewModel.ts");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./styles.scss */ "./src/app/styles.scss");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _ViewFactory__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./ViewFactory */ "./src/app/ViewFactory.ts");
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:08
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-10-09 15:38:44
 */



















function run() {
    let application = new provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_2__["Application"]("Upset2.0", "1.0.0");
    _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_5__["DataUtils"].app = application;
    _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_5__["DataUtils"].app.on("change-dataset", _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_5__["DataUtils"].processDataSet);
    if (sessionStorage["provenance-graph"]) {
        application.graph = JSON.parse(sessionStorage["provenance-graph"]);
        application.registry = JSON.parse(sessionStorage["provenance-registry"]);
    }
    let vf = new _ViewFactory__WEBPACK_IMPORTED_MODULE_18__["ViewFactory"]();
    vf.views["FilterBox"] = new _FilterBoxView_FilterBoxViewModel__WEBPACK_IMPORTED_MODULE_8__["FilterBoxViewModel"](new _FilterBoxView_FilterBoxView__WEBPACK_IMPORTED_MODULE_7__["FilterBoxView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#filter-box").node()), application);
    vf.views["DataSetInfo"] = new _DataSetInfoView_DataSetInfoViewModel__WEBPACK_IMPORTED_MODULE_4__["DataSetInfoViewModel"](new _DataSetInfoView_DataSetInfoView__WEBPACK_IMPORTED_MODULE_3__["DataSetInfoView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#dataset-info-box").node()), application);
    vf.views["NavBar"] = new _NavBarView_NavBarViewModel__WEBPACK_IMPORTED_MODULE_10__["NavBarViewModel"](new _NavBarView_NavBarView__WEBPACK_IMPORTED_MODULE_9__["NavBarView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#navigation-bar").node()), application, "data/datasets.json");
    vf.views["Upset"] = new _UnusedSetsView_UnusedSetViewModel__WEBPACK_IMPORTED_MODULE_15__["UnusedSetViewModel"](new _UnusedSetsView_UnusedSetView__WEBPACK_IMPORTED_MODULE_13__["UnusedSetView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#mid-bar").node()), application);
    vf.views["Provenance"] = new _ProvenanceView_ProvenanceViewModel__WEBPACK_IMPORTED_MODULE_12__["ProvenanceViewModel"](new _ProvenanceView_ProvenanceView__WEBPACK_IMPORTED_MODULE_11__["ProvenanceView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"](".provenance-view").node()), application);
    let isIFrame = window.self !== window.top;
    let ec = null;
    if (!isIFrame) {
        Object(_EmbedGenView_EmbedGenView__WEBPACK_IMPORTED_MODULE_6__["EmbedGenView"])(d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#embed-modal"));
    }
    else {
        ec = renderIFrame();
    }
    vf.views["Upset"] = new _UpsetView_UpsetViewModel__WEBPACK_IMPORTED_MODULE_16__["UpsetViewModel"](new _UpsetView_UpsetView__WEBPACK_IMPORTED_MODULE_14__["UpsetView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#mid-bar").node(), ec), application);
}
run();
function renderIFrame() {
    let iframe = d3__WEBPACK_IMPORTED_MODULE_0__["select"](window.self.frameElement);
    console.log(window.self);
    let ec = getEmbedConfig(iframe);
    if (!ec.NavBar)
        d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#navigation-bar").style("display", "none");
    if (!ec.FilterBox)
        d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#filter-box").style("display", "none");
    if (!ec.DataSetInfo)
        d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#dataset-info-box").style("display", "none");
    if (!ec.LeftSideBar)
        d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#left-side-bar").style("display", "none");
    if (!ec.RightSideBar)
        d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#right-side-bar").style("display", "none");
    if (!ec.ProvenanceView)
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](".provenance-view").style("display", "none");
    return ec;
}
function getEmbedConfig(iframe) {
    return JSON.parse(iframe.attr("data"));
}


/***/ }),

/***/ "./src/app/styles.scss":
/*!*****************************!*\
  !*** ./src/app/styles.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader!../../node_modules/postcss-loader/lib??ref--5-3!../../node_modules/sass-loader/lib/loader.js!./styles.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/app/styles.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ })

/******/ });
//# sourceMappingURL=app.a1d114c4cea4fbb17699.js.map
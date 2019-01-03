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

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/DatasetSelectionView/styles.scss":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader!./node_modules/postcss-loader/lib??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/DatasetSelectionView/styles.scss ***!
  \*******************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/ElementView/styles.scss":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader!./node_modules/postcss-loader/lib??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/ElementView/styles.scss ***!
  \**********************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

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

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/lib/dsv_importer/src/FileUploadView/styles.scss":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader!./node_modules/postcss-loader/lib??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/lib/dsv_importer/src/FileUploadView/styles.scss ***!
  \**********************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/lib/dsv_importer/src/TableView/styles.scss":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader!./node_modules/postcss-loader/lib??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/lib/dsv_importer/src/TableView/styles.scss ***!
  \*****************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/lib/dsv_importer/src/app/styles.scss":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader!./node_modules/postcss-loader/lib??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/lib/dsv_importer/src/app/styles.scss ***!
  \***********************************************************************************************************************************************************************************************************************/
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
        let g = new _Group__WEBPACK_IMPORTED_MODULE_0__["Group"](`Group_Deg_${group}`, `Degree ${group}`, level, _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__["AggregateBy"].DEGREE);
        rr.push({ id: g.id.toString(), data: g });
        let subsets = groups[group];
        subsets.forEach(subset => {
            g.addSubSet(subset.data);
            // rr.push({ id: subset.id.toString(), data: subset.data });
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
        let g = new _Group__WEBPACK_IMPORTED_MODULE_0__["Group"](`${group}_Expected_Value`, `${group} Expected Value`, level, _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__["AggregateBy"].DEVIATION);
        rr.push({ id: g.id.toString(), data: g });
        let subsets = groups[group];
        subsets.forEach(subset => {
            g.addSubSet(subset.data);
            // rr.push({ id: subset.id.toString(), data: subset.data });
        });
    }
    return rr;
}
function aggregateByOverlap(data, overlap, level, setNameDictionary) {
    let combinations = data
        .filter(d => {
        return d.data.noCombinedSets.toString() >= overlap.toString();
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
        let names = group.split(" ");
        names.forEach(_ => (_ = _.replace(/ /g, "_")));
        let membership = Object
            .entries(setNameDictionary)
            .map((_) => (names.indexOf(_[1].replace(/ /g, "_")) > -1 ? 1 : 0));
        let g = new _Group__WEBPACK_IMPORTED_MODULE_0__["Group"](group, group, level, _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__["AggregateBy"].OVERLAPS, membership);
        rr.push({ id: g.id.toString(), data: g });
        let subsets = groups[group];
        subsets.forEach(subset => {
            g.addSubSet(subset.data);
            // rr.push({ id: subset.id.toString(), data: subset.data });
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
        let membership = Object
            .entries(setNameDictionary)
            .map((_) => (_[1] === group ? 1 : 0));
        let g = new _Group__WEBPACK_IMPORTED_MODULE_0__["Group"](`Group_Set_${group.replace(" ", "_")}`, `${group}`, level, _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_1__["AggregateBy"].SETS, membership);
        rr.push({ id: g.id.toString(), data: g });
        let subsets = groups[group];
        subsets.forEach(subset => {
            g.addSubSet(subset.data);
            // rr.push({ id: subset.id.toString(), data: subset.data });
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
/* harmony import */ var _Group__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Group */ "./src/DataStructure/Group.ts");
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
        this.memberships = {};
        this.collapsedList = [];
        this.subSetsToRemove = [];
        this.app = app;
        this.renderConfig = new _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["RenderConfig"]();
        this.app.on("filter-changed", (rc) => {
            this.setupRenderRows(rc);
        });
        this.app.on("add-set", this.addSet, this);
        this.app.on("remove-set", this.removeSet, this);
        this.app.on("add-attribute", this.addAttribute, this);
        this.app.on("remove-attribute", this.removeAttribute, this);
        this.app.on("collapse-group", this.collapseGroup, this);
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
    collapseGroup(d, collapseAllFlag = false) {
        let group = d.data;
        group.isCollapsed = !group.isCollapsed;
        group.nestedGroups.map(_ => (_.isCollapsed = group.isCollapsed));
        if (!collapseAllFlag)
            this.app.emit("render-rows-changed", this);
    }
    load(data, dataSetDesc) {
        return __awaiter(this, void 0, void 0, function* () {
            this.name = dataSetDesc.name;
            yield this.getRawData(data, dataSetDesc).then(rawData => {
                this.memberships = {};
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
            this.UpdateDictionary(subset.itemList, subset.id);
        }
        aggregateIntersection = {};
    }
    UpdateDictionary(items, belongsTo) {
        items.forEach(item => {
            if (!this.memberships[item])
                this.memberships[item] = [];
            this.memberships[item].push(belongsTo.toString());
        });
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
    addAttribute(attr) {
        let s = this.attributes.filter(_ => _.name === attr.name);
        if (s.length === 1) {
            this.selectedAttributes.push(s[0]);
            this.app.emit("render-rows-changed", this);
        }
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
    removeAttribute(attr) {
        let s = this.selectedAttributes.filter(_ => _.name === attr.name);
        if (s.length === 1) {
            let idx = this.selectedAttributes.findIndex(_ => _.name === attr.name);
            if (idx !== -1) {
                this.selectedAttributes.splice(idx, 1);
                this.app.emit("render-rows-changed", this);
            }
        }
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
        this.collapsedList = [];
        this.subSetsToRemove = [];
        if (renderConfig) {
            this.renderConfig = renderConfig;
            this.renderRows = this.render(this.renderConfig.firstLevelAggregateBy, this.renderConfig.secondLevelAggregateBy, this.renderConfig.sortBy, this.renderConfig.minDegree, this.renderConfig.maxDegree, this.renderConfig.firstOverlap, this.renderConfig.secondOverlap, this.renderConfig.sortBySetid, this.renderConfig.collapseAll);
        }
        else {
            if (!sortBySetId)
                sortBySetId = 0;
            this.renderRows = this.render(null, null, _AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["SortBy"].SET, this.renderConfig.minDegree, this.renderConfig.maxDegree, this.renderConfig.firstOverlap, this.renderConfig.secondOverlap, this.renderConfig.sortBySetid, this.renderConfig.collapseAll);
        }
        if (this.renderConfig.collapseAll) {
            this.renderRows.forEach(_ => {
                this.collapseGroup(_, true);
            });
        }
        this.app.emit("render-rows-changed", this);
    }
    render(firstAggBy, secondAggBy, sortBy, minDegree, maxDegree, overlap1, overlap2, sortBySetId, collapseAll = false) {
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
        if (!this.renderConfig.hideEmptyIntersection) {
            if (agg.filter(_ => _.data.type === _RowType__WEBPACK_IMPORTED_MODULE_5__["RowType"].GROUP).length > 0)
                agg.forEach(_ => {
                    let group = _.data;
                    group.visibleSets.push(...group.hiddenSets);
                });
        }
        else {
            agg = agg.filter(_ => _.data.setSize > 0);
            if (agg.filter(_ => _.data.type === _RowType__WEBPACK_IMPORTED_MODULE_5__["RowType"].GROUP).length > 0) {
                agg.forEach(row => {
                    let group = row.data;
                    group.nestedGroups = group.nestedGroups.filter(_ => _.setSize > 0);
                });
            }
        }
        if (sortBy)
            agg = applySort(agg, sortBy, sortBySetId);
        agg.filter(_ => _.data instanceof _Group__WEBPACK_IMPORTED_MODULE_7__["Group"]).forEach(group => {
            this.UpdateDictionary(group.data.items, group.id);
        });
        return agg;
    }
}
function applySecondAggregation(agg, aggBy, overlap, setNameDictionary) {
    let rr = [];
    agg.forEach(row => {
        rr.push(row);
        let group = row.data;
        let subsetRows = group.subSets.map(_ => {
            return {
                id: _.id.toString(),
                data: _
            };
        });
        let rendered = _AggregationStrategy__WEBPACK_IMPORTED_MODULE_1__["default"][aggBy](subsetRows, overlap, 2, setNameDictionary);
        rendered.map(_ => row.data.addNestedGroup(_.data));
    });
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
/* harmony import */ var _app_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../app/app */ "./src/app/app.ts");
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
    static getDataSetInfo(data, fromServer = false) {
        let info = {
            Name: "",
            SetCount: 0,
            AttributeCount: 0,
            FromServer: fromServer,
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
        let dataSetDesc = datasetinfo._data;
        if (datasetinfo.FromServer) {
            d3__WEBPACK_IMPORTED_MODULE_0__["dsv"](dataSetDesc.separator, `${_app_app__WEBPACK_IMPORTED_MODULE_2__["serverUrl"]}/download/single/${datasetinfo._data.file}`).then(data => {
                let d = new _Data__WEBPACK_IMPORTED_MODULE_1__["Data"](DataUtils.app).load(data, dataSetDesc);
                d.then((d2) => {
                    DataUtils.app.emit("render-config", d2.renderConfig);
                });
            });
        }
        else {
            d3__WEBPACK_IMPORTED_MODULE_0__["dsv"](dataSetDesc.separator, datasetinfo._data.file).then(data => {
                let d = new _Data__WEBPACK_IMPORTED_MODULE_1__["Data"](DataUtils.app).load(data, dataSetDesc);
                d.then((d2) => {
                    DataUtils.app.emit("render-config", d2.renderConfig);
                });
            });
        }
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
    constructor(groupId, groupName, level, aggBy, setMemberships) {
        super(groupId, groupName);
        if (level === 1) {
            if (groupName.length >= 9) {
                this.elementName = `${groupName.substring(0, 7)}...`;
            }
        }
        else {
            if (groupName.length >= 10) {
                this.elementName = `${groupName.substring(0, 5)}...`;
            }
        }
        this.type = _RowType__WEBPACK_IMPORTED_MODULE_2__["RowType"].GROUP;
        this.isCollapsed = false;
        this.nestedGroups = [];
        this.level = 1;
        if (level)
            this.level = level;
        this.subSets = [];
        this.visibleSets = [];
        this.aggregate = new _Aggregate__WEBPACK_IMPORTED_MODULE_0__["Aggregate"](`empty${groupId}`, "Subsets", level + 1);
        this.setMemberships = setMemberships;
        this.aggBy = aggBy;
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
        // this.items = this.items.concat(group.items);
        // this.setSize += group.setSize;
        // this.expectedProb += group.expectedProb;
        // this.disproportionality += group.disproportionality;
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
    data.sort((a, b) => b.data.disproportionality - a.data.disproportionality);
    if (data.filter(_ => _.data.type === _RowType__WEBPACK_IMPORTED_MODULE_0__["RowType"].GROUP).length > 0) {
        data.forEach(row => {
            let group = row.data;
            group.visibleSets.sort((a, b) => b.disproportionality - a.disproportionality);
            if (group.nestedGroups.length > 0) {
                group.nestedGroups.sort((a, b) => b.disproportionality - a.disproportionality);
                group.nestedGroups.forEach(ng => {
                    ng.visibleSets.sort((a, b) => b.disproportionality - a.disproportionality);
                });
            }
        });
    }
    return data;
}
function sortByCardinality(data) {
    data.sort((a, b) => b.data.setSize - a.data.setSize);
    if (data.filter(_ => _.data.type === _RowType__WEBPACK_IMPORTED_MODULE_0__["RowType"].GROUP).length > 0) {
        data.forEach(row => {
            let group = row.data;
            group.visibleSets.sort((a, b) => b.setSize - a.setSize);
            if (group.nestedGroups.length > 0) {
                group.nestedGroups.sort((a, b) => b.setSize - a.setSize);
                group.nestedGroups.forEach(ng => {
                    ng.visibleSets.sort((a, b) => b.setSize - a.setSize);
                });
            }
        });
    }
    return data;
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

/***/ "./src/DatasetSelectionView/DatasetSelectionView.ts":
/*!**********************************************************!*\
  !*** ./src/DatasetSelectionView/DatasetSelectionView.ts ***!
  \**********************************************************/
/*! exports provided: DatasetSelectionView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DatasetSelectionView", function() { return DatasetSelectionView; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _dataset_selection_modal_view_html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dataset.selection.modal.view.html */ "./src/DatasetSelectionView/dataset.selection.modal.view.html");
/* harmony import */ var _lib_dsv_importer_src_app_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/dsv_importer/src/app/app */ "./src/lib/dsv_importer/src/app/app.ts");
/* harmony import */ var _dataset_list_view_html__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dataset.list.view.html */ "./src/DatasetSelectionView/dataset.list.view.html");
/* harmony import */ var _dataset_info_view_html__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dataset.info.view.html */ "./src/DatasetSelectionView/dataset.info.view.html");
/* harmony import */ var _app_app__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../app/app */ "./src/app/app.ts");
/* harmony import */ var _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../DataStructure/DataUtils */ "./src/DataStructure/DataUtils.ts");








class DatasetSelectionView extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__["ViewBase"] {
    constructor(root) {
        super(root);
        let modalDiv = d3__WEBPACK_IMPORTED_MODULE_0__["select"](root)
            .append("div")
            .html(_dataset_selection_modal_view_html__WEBPACK_IMPORTED_MODULE_2__["default"]);
        this.modal = modalDiv.select("#dataset-modal");
        this.modalContent = modalDiv.select(".modal-content");
        this.setup();
    }
    setup() {
        this.comm.on("open-dataset-selection", this.update, this);
        this.modal.select(".modal-close").on("click", () => {
            this.modal.classed("is-active", false);
        });
    }
    createUploadView() {
        this.modalContent.html("");
        Object(_lib_dsv_importer_src_app_app__WEBPACK_IMPORTED_MODULE_3__["CreateFileUploadView"])(this.modalContent);
    }
    update() {
        this.modal.classed("is-active", true);
        this.modalContent.html("");
        this.modalContent.html(_dataset_list_view_html__WEBPACK_IMPORTED_MODULE_4__["default"]);
        this.modal
            .select("#upload-new-dataset")
            .on("click", this.createUploadView.bind(this));
        let list = this.modalContent.select("#list");
        d3__WEBPACK_IMPORTED_MODULE_0__["json"](`${_app_app__WEBPACK_IMPORTED_MODULE_6__["serverUrl"]}/download/list`).then((res) => {
            let that = this;
            let pres = list.selectAll(".box").data(res);
            pres.exit().remove();
            pres = pres
                .enter()
                .append("div")
                .classed("box", true)
                .merge(pres);
            pres.each(function (d) {
                let el = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this);
                el.html("");
                el.html(_dataset_info_view_html__WEBPACK_IMPORTED_MODULE_5__["default"]);
                el.select("#dataset-name").text(d.info.name);
                el.select("#dataset-username").text(d.info.username);
                el.select("#dataset-description").text(d.info.description);
                el.select("#upload-date").text(new Date(parseInt(d.date)).toDateString());
                el.on("click", () => {
                    that.comm.emit("change-dataset-trigger", _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_7__["DataUtils"].getDataSetInfo(d.info, true));
                });
            });
        });
        // CreateFileUploadView(this.modal.select('.modal-content'));
    }
}


/***/ }),

/***/ "./src/DatasetSelectionView/DatasetSelectionViewModel.ts":
/*!***************************************************************!*\
  !*** ./src/DatasetSelectionView/DatasetSelectionViewModel.ts ***!
  \***************************************************************/
/*! exports provided: DatasetSelectionViewModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DatasetSelectionViewModel", function() { return DatasetSelectionViewModel; });
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.scss */ "./src/DatasetSelectionView/styles.scss");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_1__);


class DatasetSelectionViewModel extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__["ViewModelBase"] {
    constructor(view, app) {
        super(view, app);
        this.App.on("open-dataset-selection", this.update, this);
        this.comm.on("change-dataset-trigger", d => {
            this.App.emit("change-dataset-trigger", d);
        });
    }
    update() {
        this.comm.emit("open-dataset-selection");
    }
}


/***/ }),

/***/ "./src/DatasetSelectionView/dataset.info.view.html":
/*!*********************************************************!*\
  !*** ./src/DatasetSelectionView/dataset.info.view.html ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<div class="card">
  <div class="card-content">
    <div class="media">
      <div class="media-left">
        <div class="media-content">
          <p id="dataset-name" class="title is-4">John Smith</p>
          <p id="dataset-username" class="subtitle is-6">@johnsmith</p>
          <time id="upload-date" datetime="2016-1-1"></time>
        </div>
      </div>

      <div id="dataset-description" class="content">

      </div>
    </div>
  </div>
</div>`);

/***/ }),

/***/ "./src/DatasetSelectionView/dataset.list.view.html":
/*!*********************************************************!*\
  !*** ./src/DatasetSelectionView/dataset.list.view.html ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<div class="container is-fluid">
  <div class="columns">
    <div class="column is-half">
      <div class="title">All Datasets</div>
      <div id="list"></div>
    </div>
    <div class="column is-half">
      <div class="title">
        <button id="upload-new-dataset" class="button is-primary">Upload New Dataset
        </button>
      </div>

    </div>
  </div>
</div>`);

/***/ }),

/***/ "./src/DatasetSelectionView/dataset.selection.modal.view.html":
/*!********************************************************************!*\
  !*** ./src/DatasetSelectionView/dataset.selection.modal.view.html ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<div id="dataset-modal" class="modal">
  <div class="modal-background"></div>
  <div class="modal-content white-background" style="height: 99vh; width: 99vw">
    <!-- Any other Bulma elements you want -->
  </div>
  <button class="modal-close is-large" aria-label="close"></button>
</div>
`);

/***/ }),

/***/ "./src/DatasetSelectionView/styles.scss":
/*!**********************************************!*\
  !*** ./src/DatasetSelectionView/styles.scss ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader!../../node_modules/postcss-loader/lib??ref--5-3!../../node_modules/sass-loader/lib/loader.js!./styles.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/DatasetSelectionView/styles.scss");

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

/***/ "./src/ElementView/ElementView.ts":
/*!****************************************!*\
  !*** ./src/ElementView/ElementView.ts ***!
  \****************************************/
/*! exports provided: ElementView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ElementView", function() { return ElementView; });
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var _VegaFactory_VegaFactory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../VegaFactory/VegaFactory */ "./src/VegaFactory/VegaFactory.ts");
/* harmony import */ var _dropdown_view_html__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dropdown.view.html */ "./src/ElementView/dropdown.view.html");




class ElementView extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__["ViewBase"] {
    constructor(root) {
        super(root);
        this.sortAscending = true;
        this.currentSelection = -1;
        this.comm.on("set-axis1", (d) => {
            this.axis1Selection = d;
            this.createVisualization(this.data[this.currentSelection], this.attributes);
        });
        this.comm.on("set-axis2", (d) => {
            this.axis2Selection = d;
            this.createVisualization(this.data[this.currentSelection], this.attributes);
        });
        this.comm.on("set-axis1-trigger", (d) => {
            let _do = {
                func: (d) => {
                    this.comm.emit("set-axis1", d);
                },
                args: [d]
            };
            let _undo = {
                func: (d) => {
                    this.comm.emit("set-axis1", d);
                },
                args: [this.axis1Selection]
            };
            this.comm.emit("apply", ["set-axis1", _do, _undo]);
        });
        this.comm.on("set-axis2-trigger", (d) => {
            let _do = {
                func: (d) => {
                    this.comm.emit("set-axis2", d);
                },
                args: [d]
            };
            let _undo = {
                func: (d) => {
                    this.comm.emit("set-axis2", d);
                },
                args: [this.axis2Selection]
            };
            this.comm.emit("apply", ["set-axis2", _do, _undo]);
        });
        this.comm.on("remove-selection-trigger", (idx) => {
            if (this.currentSelection === idx)
                this.currentSelection = -1;
            if (this.currentSelection < idx)
                return;
            this.currentSelection--;
            this.renderQueries(this.data);
        });
        this.comm.on("highlight-selection-trigger", (idx) => {
            let _do = {
                func: (d) => {
                    this.comm.emit("highlight-selection", d);
                },
                args: [idx]
            };
            let _undo = {
                func: (d) => {
                    this.comm.emit("highlight-selection", d);
                },
                args: [this.currentSelection]
            };
            this.comm.emit("apply", ["highlight-selection", _do, _undo]);
        });
        this.comm.on("highlight-selection", (idx, update = true) => {
            this.highlightSelection(idx, update);
        });
    }
    create() {
        let base = d3__WEBPACK_IMPORTED_MODULE_1__["select"](this.Root);
        this.ElementQueryDiv = base.append("div").attr("id", "element-query");
        this.ElementQueryDiv.append("div")
            .classed("tag is-large is-white divider", true)
            .text("Element Queries");
        this.ElementQueryDiv.append("br");
        this.ElementQueryDiv.append("div").classed("columns is-multiline", true);
        let elementVis = base.append("div").attr("id", "element-visualization");
        elementVis
            .append("div")
            .classed("tag is-large is-white divider", true)
            .text("Element Visualization");
        this.AttributeDropdownDiv = elementVis
            .append("div")
            .classed("is-centered columns dropdowns", true);
        this.axis1 = this.AttributeDropdownDiv.append("div").classed("column axis1", true);
        this.axis2 = this.AttributeDropdownDiv.append("div").classed("column axis2", true);
        this.axis1.html(_dropdown_view_html__WEBPACK_IMPORTED_MODULE_3__["default"]);
        this.axis1.select(".axis-label").text("Axis 1");
        this.axis2.html(_dropdown_view_html__WEBPACK_IMPORTED_MODULE_3__["default"]);
        this.axis2.select(".axis-label").text("Axis 2");
        this.ElementVisualizationDiv = elementVis
            .append("div")
            .classed("is-centered columns element-vis", true);
        this.ElementQueryFiltersDiv = base
            .append("div")
            .attr("id", "element-query-filters");
        this.ElementQueryFiltersDiv.append("div")
            .classed("tag is-large is-white divider", true)
            .text("Query Filters");
        let tableVis = base.append("div").attr("id", "element-query-results");
        tableVis
            .append("div")
            .classed("tag is-large is-white divider", true)
            .text("Query Results");
        this.ElementQueryResultsDiv = tableVis
            .append("div")
            .classed("columns", true);
    }
    update(data, attributes) {
        this.data = data;
        this.attributes = attributes;
        this.clearAll();
        if (this.currentSelection < 0 || this.currentSelection >= data.length) {
            this.currentSelection = data.length - 1;
            this.comm.emit("highlight-selection", this.currentSelection, false);
        }
        this.renderQueries(data);
        if (this.data.length > 0)
            this.updateVisualizationAndResults(data[this.currentSelection], attributes);
    }
    renderQueries(data) {
        let el = this.ElementQueryDiv.select(".columns");
        let tabs = el.selectAll(".column").data(data);
        tabs.exit().remove();
        tabs = tabs
            .enter()
            .append("div")
            .merge(tabs)
            .classed("column", true)
            .html("");
        let tabContents = tabs.append("a").classed("button", true);
        tabContents
            .append("i")
            .classed("fa fa-square color-swatch", true)
            .style("color", d => d.color);
        tabContents.append("span").text(d => d.data.setSize);
        let closeIcons = tabContents
            .append("i")
            .classed("fa fa-times-circle close-icon", true);
        closeIcons.on("click", (_, i) => {
            this.comm.emit("remove-selection-trigger", i);
            d3__WEBPACK_IMPORTED_MODULE_1__["event"].stopPropagation();
        });
        tabContents.on("click", (d, i) => {
            this.comm.emit("highlight-selection-trigger", i);
        });
        tabContents.classed("is-primary", (_, i) => i === this.currentSelection);
    }
    highlightSelection(idx, update = true) {
        this.currentSelection = idx;
        if (update)
            this.update(this.data, this.attributes);
    }
    updateVisualizationAndResults(data, attributes) {
        this.createVisualization(data, attributes);
        this.createTable(data, attributes);
        this.updateHeights();
    }
    updateHeights() {
        let queryHeight = parsePxToInt(d3__WEBPACK_IMPORTED_MODULE_1__["select"]("#element-query").style("height"));
        let elementVisHeight = parsePxToInt(d3__WEBPACK_IMPORTED_MODULE_1__["select"]("#element-visualization").style("height"));
        let queryFiltersHeight = parsePxToInt(d3__WEBPACK_IMPORTED_MODULE_1__["select"]("#element-query-filters").style("height"));
        let navBarHeight = parsePxToInt(d3__WEBPACK_IMPORTED_MODULE_1__["select"]("#navigation-bar").style("height"));
        let bodyHeight = parsePxToInt(d3__WEBPACK_IMPORTED_MODULE_1__["select"]("body").style("height"));
        d3__WEBPACK_IMPORTED_MODULE_1__["select"]("#element-query-results").style("height", `${bodyHeight -
            (navBarHeight + queryHeight + elementVisHeight + queryFiltersHeight)}px`);
    }
    clearAll() {
        this.ElementVisualizationDiv.html("");
        this.ElementQueryResultsDiv.html("");
    }
    createVisualization(data, attributes) {
        let plottableAttributes = attributes.filter(_ => _.type === "integer" || _.type === "float");
        let op1 = this.axis1
            .select(".options")
            .selectAll("option")
            .data(plottableAttributes);
        op1.exit().remove();
        op1 = op1
            .enter()
            .append("option")
            .merge(op1);
        op1.text(d => d.name);
        let op2 = this.axis2
            .select(".options")
            .selectAll("option")
            .data(plottableAttributes);
        op2.exit().remove();
        op2 = op2
            .enter()
            .append("option")
            .merge(op2);
        op2.text(d => d.name);
        let that = this;
        this.axis1.select(".options").on("input", function (d) {
            that.comm.emit("set-axis1-trigger", this.value);
        });
        this.axis2.select(".options").on("input", function (d) {
            that.comm.emit("set-axis2-trigger", this.value);
        });
        if (!this.axis1Selection)
            this.axis1Selection = this.axis1.select(".options").property("value");
        else {
            this.axis1
                .select(".options")
                .selectAll("option")
                .property("selected", (d) => {
                return d.name === this.axis1Selection;
            });
        }
        if (!this.axis2Selection)
            this.axis2Selection = this.axis2.select(".options").property("value");
        else {
            this.axis2
                .select(".options")
                .selectAll("option")
                .property("selected", (d) => {
                return d.name === this.axis2Selection;
            });
        }
        let a1_attr = attributes.filter(_ => _.name === this.axis1Selection)[0];
        let a2_attr = attributes.filter(_ => _.name === this.axis2Selection)[0];
        if (!a1_attr || !a2_attr)
            return;
        let spec = {
            $schema: "https://vega.github.io/schema/vega-lite/v3.0.0-rc8.json",
            data: { values: data.arr },
            mark: {
                type: "circle",
                tooltip: {
                    content: "data"
                }
            },
            encoding: {
                x: {
                    field: this.axis1Selection,
                    type: "quantitative",
                    scale: { domain: [a1_attr.min, a1_attr.max] }
                },
                y: {
                    field: this.axis2Selection,
                    type: "quantitative",
                    scale: { domain: [a2_attr.min, a2_attr.max] }
                }
            }
        };
        Object(_VegaFactory_VegaFactory__WEBPACK_IMPORTED_MODULE_2__["CreateVegaVis"])(spec, this.ElementVisualizationDiv);
    }
    createTable(data, attributes) {
        let table = this.ElementQueryResultsDiv.append("table");
        let headers = table
            .append("thead")
            .append("tr")
            .selectAll("th")
            .data(attributes.map(_ => _.name));
        headers.exit().remove();
        headers = headers
            .enter()
            .append("th")
            .merge(headers)
            .classed("has-text-white", true);
        headers.text(d => d);
        let rows = table
            .append("tbody")
            .selectAll("tr")
            .data(data.arr);
        rows.exit().remove();
        rows = rows
            .enter()
            .append("tr")
            .merge(rows);
        let cells = rows.selectAll("td").data(d => {
            return attributes.map(_ => _.name).map(k => {
                return {
                    value: d[k],
                    name: k
                };
            });
        });
        cells.exit().remove();
        cells = cells
            .enter()
            .append("td")
            .merge(cells);
        cells.attr("data-th", d => d.name);
        cells.text(d => d.value);
        let that = this;
        headers.on("click", function (d) {
            headers.attr("class", "header has-text-white");
            if (that.sortAscending) {
                rows.sort((a, b) => {
                    return b[d] - a[d];
                });
                that.sortAscending = !that.sortAscending;
                this.className = "aes has-text-white";
            }
            else {
                rows.sort((a, b) => {
                    return a[d] - b[d];
                });
                that.sortAscending = !that.sortAscending;
                this.className = "des has-text-white";
            }
        });
    }
}
function parsePxToInt(pixel) {
    return parseInt(pixel, 10);
}


/***/ }),

/***/ "./src/ElementView/ElementViewModel.ts":
/*!*********************************************!*\
  !*** ./src/ElementView/ElementViewModel.ts ***!
  \*********************************************/
/*! exports provided: ElementViewModel, colorList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ElementViewModel", function() { return ElementViewModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "colorList", function() { return colorList; });
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.scss */ "./src/ElementView/styles.scss");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_1__);


class ElementViewModel extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_0__["ViewModelBase"] {
    constructor(view, app) {
        super(view, app);
        this.selectedSets = [];
        this.App.on("render-rows-changed", (data) => {
            if (!this.dataset || this.dataset.name != data.name) {
                this.dataset = data;
                this.selectedSets = [];
                this.getDefault();
            }
        });
        this.App.on("add-selection", this.addSelection, this);
        this.App.on("remove-selection", this.removeSelection, this);
        this.App.on("add-selection-trigger", (d) => {
            this.comm.emit("add-selection-trigger", d);
        }, this);
        this.App.on("remove-selection-trigger", (idx) => {
            this.comm.emit("remove-selection-trigger", idx);
        }, this);
        this.comm.on("add-selection-trigger", (d) => {
            let _do = {
                func: (d) => {
                    this.App.emit("add-selection", d);
                },
                args: [d]
            };
            let _undo = {
                func: (idx) => {
                    this.App.emit("remove-selection", idx);
                },
                args: [this.selectedSets.length]
            };
            this.apply.call(this, ["add-selection", _do, _undo]);
        });
        this.comm.on("remove-selection-trigger", (idx) => {
            let _do = {
                func: (idx) => {
                    this.App.emit("remove-selection", idx);
                },
                args: [idx]
            };
            let _undo = {
                func: (d) => {
                    this.App.emit("add-selection", d);
                },
                args: [this.selectedSets[idx]]
            };
            this.apply.call(this, ["remove-selection", _do, _undo]);
        });
        this.comm.on("apply", ([name, _do, _undo]) => {
            this.apply.call(this, [name, _do, _undo]);
        });
        this.register();
    }
    register() {
        this.registerFunctions("highlight-selection", (idx) => {
            this.comm.emit("highlight-selection", idx);
        }, this);
        this.registerFunctions("highlight-selection", (idx) => {
            this.comm.emit("highlight-selection", idx);
        }, this, false);
        this.registerFunctions("add-selection", (d) => {
            this.App.emit("add-selection", d);
        }, this);
        this.registerFunctions("add-selection", (idx) => {
            this.App.emit("remove-selection", idx);
        }, this, false);
        this.registerFunctions("remove-selection", (idx) => {
            this.App.emit("remove-selection", idx);
        }, this);
        this.registerFunctions("remove-selection", (d) => {
            this.App.emit("add-selection", d);
        }, this, false);
        this.registerFunctions("set-axis1", (d) => {
            this.comm.emit("set-axis1", d);
        }, this);
        this.registerFunctions("set-axis1", (d) => {
            this.comm.emit("set-axis1", d);
        }, this, false);
        this.registerFunctions("set-axis2", (d) => {
            this.comm.emit("set-axis2", d);
        }, this);
        this.registerFunctions("set-axis2", (d) => {
            this.comm.emit("set-axis2", d);
        }, this, false);
    }
    addSelection(sel) {
        this.selectedSets = this.selectedSets.filter(_ => _.id !== "DEFAULT");
        let validAttributes = this.dataset.attributes.filter(_ => _.name !== "Sets");
        let n_row = createObjectsFromSubsets(sel, validAttributes);
        this.selectedSets.push(n_row);
        this.update();
    }
    removeSelection(idx) {
        let el = this.selectedSets.splice(idx, 1);
        removeColor(el[0].color);
        if (this.selectedSets.length === 0) {
            this.getDefault();
        }
        else
            this.update();
    }
    getDefault() {
        let validAttributes = this.dataset.attributes.filter(_ => _.name !== "Sets");
        this.comm.emit("update", [createObjectFromItems(this.dataset.allItems, validAttributes)], validAttributes);
    }
    update() {
        let validAttributes = this.dataset.attributes.filter(_ => _.name !== "Sets");
        this.comm.emit("update", this.selectedSets, validAttributes);
    }
}
function createObjectsFromSubsets(row, attributes) {
    let items = row.data.items;
    let arr = items.map(i => {
        let obj = {};
        attributes.forEach((attr) => {
            obj[attr.name] = attr.values[i];
        });
        return obj;
    });
    return {
        id: row.id,
        data: row.data,
        arr: arr,
        color: selectColor()
    };
}
function createObjectFromItems(items, attributes) {
    let arr = items.map(i => {
        let obj = {};
        attributes.forEach((attr) => {
            obj[attr.name] = attr.values[i];
        });
        return obj;
    });
    return {
        id: "DEFAULT",
        data: {
            setSize: items.length
        },
        arr: arr,
        color: selectColor()
    };
}
let chosenColor = [];
function selectColor() {
    let availableColors = colorList.filter(c => chosenColor.indexOf(c) < 0);
    if (availableColors.length === 0)
        return "#000";
    chosenColor.push(availableColors[0]);
    return availableColors[0];
}
function removeColor(color) {
    if (chosenColor.indexOf(color) < 0)
        return;
    let idx = chosenColor.indexOf(color);
    chosenColor.splice(idx, 1);
}
const colorList = [
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#f032e6",
    "#bcf60c",
    "#fabebe",
    "#008080",
    "#9a6324",
    "#800000",
    "#aaffc3",
    "#808000",
    "#000075",
    "#000000"
];


/***/ }),

/***/ "./src/ElementView/dropdown.view.html":
/*!********************************************!*\
  !*** ./src/ElementView/dropdown.view.html ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<span class="axis-label">Axis 1</span>
<div class="select is-small">
  <select class="options">
    <!-- <option>With options</option> -->
  </select>
</div>`);

/***/ }),

/***/ "./src/ElementView/styles.scss":
/*!*************************************!*\
  !*** ./src/ElementView/styles.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader!../../node_modules/postcss-loader/lib??ref--5-3!../../node_modules/sass-loader/lib/loader.js!./styles.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/ElementView/styles.scss");

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
            .attr("height", 500)
            .attr("width", 1000)
            .attr("data", () => {
            return JSON.stringify(_DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].getConfig());
        })
            .attr("class", "upset")
            .attr("src", `https://vdl.sci.utah.edu/upset2/embed.html#${JSON.stringify(_DataStructure_EmbedConfig__WEBPACK_IMPORTED_MODULE_0__["EmbedConfig"].getConfig())}`);
        let _i = d3__WEBPACK_IMPORTED_MODULE_2__["select"](".embeded-view");
        base.select(".code").property("value", _i.html());
        base.select(".code").node().select();
        document.execCommand("copy");
        _i.html("");
        _i.remove();
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
        this.comm.on("do-collapse-all", this.updateCollapseAll.bind(this));
    }
    update() {
        this.updateAggregationDropdowns();
        // this.updateCollapseAll();
        this.updateSortByOptions();
        this.updateOverlaps();
        this.updateDataFields();
    }
    updateCollapseAll() {
        let curr = this.config.collapseAll;
        let _do = {
            func: this.applyCollapseAll.bind(this),
            args: [!curr]
        };
        let _undo = {
            func: this.applyCollapseAll.bind(this),
            args: [curr]
        };
        this.comm.emit("apply", ["apply-collapse-all", _do, _undo]);
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
        if (rc.firstLevelAggregateBy === _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE)
            rc.secondLevelAggregateBy = _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].NONE;
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
    applyCollapseAll(val) {
        let rc = this.config;
        rc.collapseAll = val;
        this.saveConfig(rc);
        this.update();
    }
    applySortByCardinality() {
        let rc = this.config;
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
        this.App.on('do-collapse-all', () => {
            this.comm.emit('do-collapse-all');
        });
        this.App.on('build-collapse', ([expand, collapse]) => {
            this.comm.emit('build-collapse', expand, collapse);
        });
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
        this.registerFunctions("apply-collapse-all", view.applyCollapseAll, view);
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
        this.registerFunctions("apply-collapse-all", view.applyCollapseAll, view, false);
        this.comm.on("apply", args => {
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
/* harmony default export */ __webpack_exports__["default"] = (`<div class="container is-fluid override  is-size-7">
  <div>
    <div class="make-bold  is-size-6">
      First, aggregate by:
    </div>
    <div class="dropdown is-hoverable">
      <div id="firstAggByDropdown" class="dropdown-trigger navbar-link">
      </div>
      <div class="dropdown-menu">
        <div id="firstAggByOptions" class="dropdown-content">
          <!-- <div class="dropdown-item">Test</div> -->
        </div>
      </div>
    </div>
  </div>
  <!-- <div id='overlap-one'>
    Overlap Degree:
    <input style="display:block" id='first-overlap-input' type="text">
  </div> -->

  <div class="field">
    <label for="" class="label  is-size-7">Overlap Degree:</label>
    <div class="control" id="overlap-one">
      <input id="first-overlap-input" type="number" class="input is-small">
    </div>
  </div>

  <div id="secondAgg">
    <div>
      <div class="make-bold  is-size-6">
        Then, aggregate by:
      </div>
      <div class="dropdown is-hoverable">
        <div id="secondAggByDropdown" class="dropdown-trigger navbar-link">
        </div>
        <div class="dropdown-menu">
          <div id="secondAggByOptions" class="dropdown-content">
            <!-- <div class="dropdown-item">Test</div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- <div id='overlap-two'>
      Overlap Degree:
      <input id='second-overlap-input' type="text">
    </div> -->

    <div class="field">
      <label for="" class="label  is-size-7">Overlap Degree:</label>
      <div class="control" id="overlap-two">
        <input id="second-overlap-input" type="number" class="input is-small">
      </div>
    </div>

  </div>

  <div class="make-bold  is-size-6">
    Sort By:
  </div>

  <div id="sortByOptions" class="control  is-size-7">
  </div>>


  <div id="Data">
    <div class="make-bold is-size-6">Data:</div>

    <div class="field">
      <label for="" class="label is-size-7">Min Degree:</label>
      <div class="control">
        <input id="minDegree" type="number" class="input is-small">
      </div>
    </div>
    <div class="field">
      <label for="" class="label is-size-7">Max Degree</label>
      <div class="control">
        <input id="maxDegree" type="number" class="input is-small">
      </div>
    </div>

    <div class="field">
      <div class="control">
        <input id="hideEmpty" type="checkbox">
        <label class="checkbox is-size-7">Hide Empty</label>
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
        this.comm.on('change-dataset', this.setDSS);
        d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root)
            .select('#load-data')
            .on('click', () => {
            this.comm.emit('load-data');
        });
    }
    update(datasets) {
        let datasets_options = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.Root)
            .select('#dropdown-item-container')
            .selectAll('a')
            .data(datasets)
            .enter()
            .append('a')
            .text((d, i) => {
            return `${d.Name} (${d.SetCount} sets, ${d.AttributeCount} attributes)`;
        })
            .attr('class', 'dropdown-item')
            .on('click', (d) => {
            this.comm.emit('change-dataset-trigger', d);
        });
        let rc = null;
        let d = null;
        if (sessionStorage['render_config']) {
            rc = JSON.parse(sessionStorage['render_config']);
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
            this.oldDataset = d;
            this.comm.emit('change-dataset', d);
        }
    }
    setDSS(data) {
        d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#data-dropdown-btn').text(`${data.Name} (${data.SetCount} sets, ${data.AttributeCount} attributes)`);
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
/* harmony import */ var _app_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../app/app */ "./src/app/app.ts");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! provenance_mvvm_framework */ "./node_modules/provenance_mvvm_framework/dist/lib/index.js");
/* harmony import */ var provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../DataStructure/DataUtils */ "./src/DataStructure/DataUtils.ts");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles.scss */ "./src/NavBarView/styles.scss");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_3__);

/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:38:33
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-07-16 11:15:54
 */



class NavBarViewModel extends provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_1__["ViewModelBase"] {
    constructor(view, app, dsLocation) {
        super(view, app);
        this.datasets = [];
        this.populateDatasetSelector(dsLocation);
        // this.populateDatasetSelectorFromServer();
        this.comm.on("load-data", () => {
            this.App.emit("open-dataset-selection");
        });
        this.comm.on("change-dataset", dataset => {
            view.oldDataset = dataset;
            this.App.emit("change-dataset", dataset);
        });
        this.App.on("change-dataset-trigger", d => {
            this.comm.emit("change-dataset-trigger", d);
        });
        this.comm.on("change-dataset-trigger", (d) => {
            let _do = {
                func: (d) => {
                    this.comm.emit("change-dataset", d);
                },
                args: [d]
            };
            let _undo = {
                func: (d) => {
                    this.comm.emit("change-dataset", d);
                },
                args: [view.oldDataset]
            };
            this.apply.call(this, ["change-dataset", _do, _undo]);
        });
        this.registerFunctions("change-dataset", (d) => {
            this.comm.emit("change-dataset", d);
        }, this);
        this.registerFunctions("change-dataset", (d) => {
            this.comm.emit("change-dataset", d);
        }, this, false);
    }
    populateDatasetSelectorFromServer() {
        let results = [];
        let p = fetch(`${_app_app__WEBPACK_IMPORTED_MODULE_0__["serverUrl"]}/download/list`)
            .then(results => results.json())
            .then(jsondata => {
            jsondata.forEach((d) => {
                results.push(d.info);
            });
        })
            .then(() => {
            results.forEach(j => {
                let a = _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_2__["DataUtils"].getDataSetJSON(j);
                a.file = `${_app_app__WEBPACK_IMPORTED_MODULE_0__["serverUrl"]}/download/single/${a.file}`;
                this.datasets.push(_DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_2__["DataUtils"].getDataSetInfo(a));
            });
        })
            .then(() => {
            this.comm.emit("update", this.datasets);
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
                    let a = _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_2__["DataUtils"].getDataSetJSON(j);
                    this.datasets.push(_DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_2__["DataUtils"].getDataSetInfo(a));
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
    <div class="navbar-item has-text-weight-bold is-size-5">
      UpSet - Visualizing Intersecting Sets
    </div>
  </div>
  <div class="navbar-menu">
    <div class="navbar-start">

      <div class="navbar-item is-paddingless">
        <div id="undo-redo-group" class=""></div>
      </div>

      <!-- <div class="navbar-item is-paddingless">
        <div class="field">
          <div class="control">
            <input id="collapseAll" type="checkbox">
            <label class="checkbox">Collapse All</label>
          </div>
        </div>
      </div> -->

    </div>

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
        <a id="load-data" class="button is-small is-primary">Load Data</a>
      </div>

      <div class="navbar-item">
        <div id="embed-modal">
          <a class="button is-small is-primary show">Embed</a>
        </div>
      </div>

      <div class="navbar-item">
        <a class=" has-text-white-ter" href="http://caleydo.org/tools/upset/ ">About UpSet</a>
      </div>
      <!-- 
      <div class="navbar-item">
        <a href="https://github.com/hms-dbmi/UpSetR/ ">UpSet for R</a>
      </div> -->

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
        let size = 20;
        let root = d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#undo-redo-group");
        root.html(_provenance_view_html__WEBPACK_IMPORTED_MODULE_2__["default"]);
        // d3.select(this.Root)
        //   .select("#save-btn")
        //   .on("click", () => {
        //     this.comm.emit("save-graph");
        //   });
        // d3.select(this.Root)
        //   .select("#load-btn")
        //   .on("click", () => {
        //     this.comm.emit("load-graph");
        //   });
        let undo = root.select(".undo");
        let redo = root.select(".redo");
        // undo
        //   .append("img")
        //   .attr("src", "assets/arrow.svg")
        //   .attr("class", "img")
        //   .attr("height", size)
        //   .attr("width", size);
        // redo
        //   .append("img")
        //   .attr("src", "assets/arrow.svg")
        //   .attr("class", "img")
        //   .attr("height", size)
        //   .attr("width", size);
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
        Object(_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_3__["createButtons"])(d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#undo-redo-group"), graph);
        // createGraph(d3.select(this.Root).select(".graph-view"), graph, this.comm);
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
        let length = this.graph.current.children.length - 1;
        this.traverser.toStateNode(this.App.graph.current.children[length].id);
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
/* harmony default export */ __webpack_exports__["default"] = (`<!-- <div>
  <a id="save-btn" class="button">Save</a>
  <a id="load-btn" class="button">Load</a>
</div> -->

<div class="columns">
  <div title="Undo" class="column undo">
    <i class="fas fa-undo"></i>
  </div>
  <!-- <div class="column is-10 graph-view"></div> -->
  <div title="Redo" class="column redo">
    <i class="fas fa-redo"></i>
  </div>
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
    el.select(".redo").classed("has-text-grey", false);
    el.select(".undo").classed("has-text-grey", false);
    if (graph.current.children.length === 0) {
        el.select(".redo").classed("has-text-grey", true);
    }
    if (graph.current.label === "Root") {
        el.select(".undo").classed("has-text-grey", true);
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
/* harmony import */ var _UpsetView_ui_params__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../UpsetView/ui_params */ "./src/UpsetView/ui_params.ts");
/* harmony import */ var _UpsetView_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../UpsetView/uiBuilderFunctions */ "./src/UpsetView/uiBuilderFunctions.ts");
/* harmony import */ var _collapseall_view_html__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./collapseall.view.html */ "./src/UnusedSetsView/collapseall.view.html");
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
        let dropDownControls = this.headerVis
            .append("div")
            .attr("class", "unused-set-view");
        dropDownControls.classed("dropdown-position", true);
        this.comm.on("update-position", () => {
            dropDownControls.style("left", `${_UpsetView_ui_params__WEBPACK_IMPORTED_MODULE_3__["default"].combinations_width}px`);
        });
        dropDownControls.html(dropDownControls.html() + _unusedset_view_html__WEBPACK_IMPORTED_MODULE_2__["default"]);
        let expandCollapseControls = this.headerVis
            .append("div")
            .classed("expand-collapse", true);
        expandCollapseControls.classed("expand-collapse-position", true);
        expandCollapseControls.html(expandCollapseControls.html() + _collapseall_view_html__WEBPACK_IMPORTED_MODULE_5__["default"]);
        expandCollapseControls.style("top", `${_UpsetView_ui_params__WEBPACK_IMPORTED_MODULE_3__["default"].header_height - 20}px`);
        let icons = expandCollapseControls.selectAll(".collapse-icon");
        let exp = expandCollapseControls.select(".expand-all");
        let col = expandCollapseControls.select(".collapse-all");
        let that = this;
        icons.on("click", function () {
            let icon = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this);
            that.comm.emit("do-collapse-all");
            if (icon.classed("collapse-all")) {
                col.classed("is-invisible", true);
                exp.classed("is-invisible", false);
            }
            else {
                col.classed("is-invisible", false);
                exp.classed("is-invisible", true);
            }
        });
    }
    update(data) {
        let collapseAll = false;
        if (sessionStorage['render_config']) {
            let config = JSON.parse(sessionStorage['render_config']);
            collapseAll = config.collapseAll;
        }
        let expand = d3__WEBPACK_IMPORTED_MODULE_0__["select"](".expand-all");
        let collapse = d3__WEBPACK_IMPORTED_MODULE_0__["select"](".collapse-all");
        if (collapseAll) {
            collapse.classed("is-invisible", true);
            expand.classed("is-invisible", false);
        }
        else {
            collapse.classed("is-invisible", false);
            expand.classed("is-invisible", true);
        }
        let dropDown = this.headerVis
            .select(".unused-set-view")
            .select("#unsed-set-dropdown");
        let options = this.headerVis
            .select(".unused-set-view")
            .select("#unused-set-options");
        if (data.unusedSets.length < 1) {
            dropDown.style("display", "none");
        }
        else {
            dropDown.style("display", "block");
            this.updateDropdownOptions(options, data.unusedSets);
        }
        let attrDropdown = this.headerVis
            .select(".unused-set-view")
            .select("#unused-attribute-dropdown");
        let attrOptions = this.headerVis
            .select(".unused-set-view")
            .select("#unused-attribute-options");
        let unselectedAttributes = data.attributes
            .filter(d => _UpsetView_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_4__["excludeSets"].indexOf(d.name) < 0)
            .filter(d => data.selectedAttributes.map(_ => _.name).indexOf(d.name) < 0);
        if (unselectedAttributes.length < 1) {
            attrDropdown.style("display", "none");
        }
        else {
            attrDropdown.style("display", "block");
            this.updateAttributeDropdownOptions(attrOptions, unselectedAttributes);
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
    updateAttributeDropdownOptions(opt, data) {
        let options = opt.selectAll(".dropdown-item").data(data);
        options.exit().remove();
        options
            .enter()
            .append("div")
            .merge(options)
            .classed("dropdown-item", true)
            .text((d) => d.name)
            .on("click", (d) => {
            this.comm.emit("add-attribute-trigger", d);
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
        this.comm.on('do-collapse-all', () => {
            this.App.emit('do-collapse-all');
        });
        this.App.on("render-rows-changed", this.update, this);
        this.App.on("used-set-changed", () => {
            this.comm.emit("update-position");
        });
        this.registerFunctions("add-set", (d) => {
            this.App.emit("add-set", d);
        }, this);
        this.registerFunctions("add-set", (d) => {
            this.App.emit("remove-set", d);
        }, this, false);
        this.registerFunctions("add-attribute", (d) => {
            this.App.emit("add-attribute", d);
        }, this);
        this.registerFunctions("add-attribute", (d) => {
            this.App.emit("remove-attribute", d);
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
            this.apply.call(this, ["add-set", _do, _undo]);
        });
        this.comm.on("add-attribute-trigger", (d) => {
            let _do = {
                func: (d) => {
                    this.App.emit("add-attribute", d);
                },
                args: [d]
            };
            let _undo = {
                func: (d) => {
                    this.App.emit("remove-attribute");
                },
                args: [d]
            };
            this.apply.call(this, ["add-attribute", _do, _undo]);
        });
    }
    update(data) {
        this.comm.emit("update", data);
    }
}


/***/ }),

/***/ "./src/UnusedSetsView/collapseall.view.html":
/*!**************************************************!*\
  !*** ./src/UnusedSetsView/collapseall.view.html ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<div id="collapse-all-icon">
  <span class="collapse-all collapse-icon"><i class="fas fa-compress"></i></span>
  <span class="expand-all collapse-icon is-invisible"><i class="fas fa-expand-arrows-alt"></i></span>
</div>`);

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
/* harmony default export */ __webpack_exports__["default"] = (`<div id="unused-sets" class="dropdown is-hoverable">
  <div id="unsed-set-dropdown" class="dropdown-trigger navbar-link">
    Add Sets
  </div>
  <div class="dropdown-menu">
    <div id="unused-set-options" class="dropdown-content">
      <!-- <div class="dropdown-item">Test</div> -->
    </div>
  </div>
</div>

<div id="unused-attributes" class="dropdown is-hoverable">
  <div id="unused-attribute-dropdown" class="dropdown-trigger navbar-link">
    Add Attributes
  </div>
  <div class="dropdown-menu">
    <div id="unused-attribute-options" class="dropdown-content">
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
 * @Last Modified time: 2018-10-10 07:23:53
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
        this.dropdownGroup = this.headerGroup
            .append("g")
            .classed("dropdown-header", true);
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
        let excludeSets = ["Name", "Set Count", "Sets"];
        Object(_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_4__["usedSetsHeader"])(data.usedSets, this.selectedSetHeaderGroup, d3__WEBPACK_IMPORTED_MODULE_0__["max"](data.sets, d => {
            return d.setSize;
        }), this.comm);
        Object(_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_4__["addRenderRows"])(data, this.setsComboGroup, data.usedSets.length, this.config, this.comm);
        if (!this.config || this.config.CardinalityBars) {
            Object(_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_4__["addCardinalityHeader"])(data.allItems.length, d3__WEBPACK_IMPORTED_MODULE_0__["max"](data.renderRows.map(d => d.data.setSize)), this.cardinalityScaleGroup, this.comm);
        }
        if (!this.config || this.config.DeviationBars) {
            Object(_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_4__["addDeviationHeaders"])(this.deviationGroup, d3__WEBPACK_IMPORTED_MODULE_0__["max"](data.renderRows.map(d => Math.abs(d.data.disproportionality))), this.comm);
        }
        if (true) {
            Object(_uiBuilderFunctions__WEBPACK_IMPORTED_MODULE_4__["addAttributeHeaders"])(this.attributeHeaders, data, this.comm);
        }
        this.svg.attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_5__["default"].svg_height).attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_5__["default"].svg_width);
        this.app.emit("used-set-changed");
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
        view.app = app;
        this.comm.on("add-selection-trigger", (d) => {
            this.App.emit("add-selection-trigger", d);
        });
        this.App.on("highlight-selection", ([d, color]) => {
            this.comm.emit("highlight-selection", d, color);
        });
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
        this.comm.on("collapse-group", (d) => {
            this.App.emit("collapse-group", d);
        });
        this.registerFunctions("remove-set", (d) => {
            this.App.emit("remove-set", d);
        }, this);
        this.registerFunctions("remove-set", (d) => {
            this.App.emit("add-set", d);
        }, this, false);
        this.registerFunctions("remove-attribute", (d) => {
            this.App.emit("remove-attribute", d);
        }, this);
        this.registerFunctions("remove-attribute", (d) => {
            this.App.emit("add-attribute", d);
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
            this.apply.call(this, ["remove-set", _do, _undo]);
        });
        this.comm.on("remove-attribute-trigger", (d) => {
            let _do = {
                func: (d) => {
                    this.App.emit("remove-attribute", d);
                },
                args: [d]
            };
            let _undo = {
                func: (d) => {
                    this.App.emit("add-attribute", d);
                },
                args: [d]
            };
            this.apply.call(this, ["remove-attribute", _do, _undo]);
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
/*! exports provided: excludeSets, usedSetsHeader, addCardinalityHeader, addDeviationHeaders, addRenderRows, addAttributeHeaders */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "excludeSets", function() { return excludeSets; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "usedSetsHeader", function() { return usedSetsHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addCardinalityHeader", function() { return addCardinalityHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addDeviationHeaders", function() { return addDeviationHeaders; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addRenderRows", function() { return addRenderRows; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addAttributeHeaders", function() { return addAttributeHeaders; });
/* harmony import */ var _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../DataStructure/AggregateAndFilters */ "./src/DataStructure/AggregateAndFilters.ts");
/* harmony import */ var _ui_params__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui_params */ "./src/UpsetView/ui_params.ts");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../DataStructure/RowType */ "./src/DataStructure/RowType.ts");




const excludeSets = ["Name", "Set Count", "Sets"];
const attributeName = "data-attribute-name";
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
        return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * i}, 0)`;
    });
    headers
        .on("click", (d, i) => {
        comm.emit("remove-set-trigger", d);
    })
        .on("mouseover", (d, i) => {
        d3__WEBPACK_IMPORTED_MODULE_2__["selectAll"](`.S_${i}`).classed("highlight", true);
    })
        .on("mouseout", (d, i) => {
        d3__WEBPACK_IMPORTED_MODULE_2__["selectAll"](`.S_${i}`).classed("highlight", false);
    });
    addBackgroundBars(headers);
    addForegroundBars(headers, maxSetSize);
}
function addBackgroundBars(headers) {
    headers
        .append("rect")
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].used_set_header_height)
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width)
        .attr("class", (d, i) => {
        return `used-set-background S_${i}`;
    });
}
function addForegroundBars(headers, maxSetSize) {
    let scale = d3__WEBPACK_IMPORTED_MODULE_2__["scaleLinear"]()
        .domain([0, maxSetSize])
        .nice()
        .range([0, _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].used_set_header_height]);
    headers
        .append("rect")
        .attr("height", (d, i) => {
        return scale(d.setSize);
    })
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width)
        .attr("class", "used-set-foreground")
        .attr("transform", (d, i) => {
        return `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].used_set_header_height -
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
        .attr("transform", `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].used_set_header_height})`)
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
        d3__WEBPACK_IMPORTED_MODULE_2__["selectAll"](`.S_${i}`).classed("highlight", true);
    })
        .on("mouseout", (d, i) => {
        d3__WEBPACK_IMPORTED_MODULE_2__["selectAll"](`.S_${i}`).classed("highlight", false);
    });
    connectors
        .transition()
        .duration(100)
        .attr("transform", (d, i) => {
        return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * i}, 0)`;
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
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width)
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].used_set_connector_height)
        .attr("transform", `skewX(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].used_set_connector_skew})`);
}
function addConnectorLabels(connectors) {
    connectors
        .append("text")
        .text((d) => {
        return d.elementName;
    })
        .attr("class", "set-label")
        .attr("text-anchor", "end")
        .attr("transform", `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].skew_offset +
        (_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width *
            Math.sin(Object(_ui_params__WEBPACK_IMPORTED_MODULE_1__["deg2rad"])(_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].used_set_connector_skew))) /
            2},${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].used_set_connector_height})rotate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].used_set_connector_skew})`);
}
// ################################################################################################
function addCardinalityHeader(totalSize, maxSetSize, el, comm) {
    el.attr("transform", `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].skew_offset +
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combinations_width +
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width}, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].header_height -
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].header_body_padding -
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_scale_group_height})`);
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
    let scaleOverview = getCardinalityScale(totalSize, _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width);
    addOverviewAxis(overviewAxis, scaleOverview, totalSize);
    addCardinalitySlider(cardinalitySlider, maxSetSize, scaleOverview, comm);
    addBrush(sliderBrush, scaleOverview(maxSetSize));
    addCardinalityLabel(cardinalityLabel);
    let scaleDetails = getCardinalityScale(maxSetSize, _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width);
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
        .attr("d", `M0,${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].axis_offset} H200`);
    addTicks(bottom, ticksArr, scale, _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].axis_offset - 6);
}
function addCardinalitySlider(el, maxSetSize, scale, comm) {
    el.attr("transform", `translate(${scale(maxSetSize)},${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].axis_offset / 2 - 7})`);
    addDragEvents(el, scale, comm);
    let slider = el
        .append("rect")
        .attr("class", "cardinality-slider-rect")
        .attr("transform", "rotate(45)")
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_slider_dims)
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_slider_dims);
}
function addBrush(el, pos) {
    el.append("rect")
        .attr("class", "slider-brush")
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].axis_offset)
        .attr("width", pos);
}
function addCardinalityLabel(el) {
    let textGroup = el
        .append("g")
        .attr("class", "inner-text-group")
        .attr("transform", `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_scale_group_height / 2 -
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_label_height / 2})`);
    let sliderInfluence = el.append("g").attr("class", "slider-influence hide");
    textGroup
        .append("rect")
        .attr("class", "cardinality-label-rect")
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width)
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_label_height);
    textGroup
        .append("text")
        .text("Cardinality")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width / 2},${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_bar_height})`);
    sliderInfluence.append("path").attr("class", "slider-brush-path");
}
function updateBrushAndSlider(pos) {
    d3__WEBPACK_IMPORTED_MODULE_2__["select"](".slider-brush").attr("width", pos);
    d3__WEBPACK_IMPORTED_MODULE_2__["select"](".slider-influence")
        .select(".slider-brush-path")
        .attr("d", `M ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width} ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_scale_group_height -
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].axis_offset} H0 V ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].axis_offset} H${pos}`);
}
function addDragEvents(el, scale, comm) {
    comm.on("slider-moved", (d) => {
        adjustCardinalityBars(d);
        updateDetailsScale(d);
        updateBrushAndSlider(scale(d));
    });
    el.call(d3__WEBPACK_IMPORTED_MODULE_2__["drag"]()
        .on("start", dragStart)
        .on("drag", dragged)
        .on("end", dragEnd));
    function dragStart() {
        d3__WEBPACK_IMPORTED_MODULE_2__["select"](this)
            .raise()
            .classed("active", true);
        d3__WEBPACK_IMPORTED_MODULE_2__["select"](".inner-text-group").classed("hide", true);
        d3__WEBPACK_IMPORTED_MODULE_2__["select"](".slider-influence").classed("hide", false);
    }
    function dragged() {
        let x = d3__WEBPACK_IMPORTED_MODULE_2__["event"].x;
        if (x > scale(6) && x <= _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width) {
            if (Math.abs(x - 0) <= 0.9)
                x = 1;
            if (Math.abs(x - _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width) <= 0.9)
                x = _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width;
            d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).attr("transform", `translate(${x}, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].axis_offset / 2 - 7})`);
            comm.emit("slider-moved", scale.invert(x));
        }
    }
    function dragEnd() {
        d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).classed("active", false);
        d3__WEBPACK_IMPORTED_MODULE_2__["select"](".slider-influence").classed("hide", true);
        d3__WEBPACK_IMPORTED_MODULE_2__["select"](".inner-text-group").classed("hide", false);
    }
}
function updateDetailsScale(setSize) {
    let el = d3__WEBPACK_IMPORTED_MODULE_2__["select"](".details-axis");
    let scale = getCardinalityScale(setSize, _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width);
    addDetailAxis(el, scale, Math.floor(setSize));
}
function addDetailAxis(el, scale, size) {
    el.attr("transform", `translate(0,${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_scale_group_height - _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].axis_offset})`);
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
        .attr("d", `M0,${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].axis_offset} H200 `);
    addTicks(bottom, ticksArr, scale, _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].axis_offset - 6);
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
    el.attr("transform", `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].skew_offset +
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combinations_width +
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width +
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * 3}, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].header_height -
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].header_body_padding -
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_scale_group_height +
        3})`);
    addDeviationLabel(el, comm);
    addDeviationScale(el, Math.ceil((maxDisprop * 100) / 5) * 5);
}
function addDeviationLabel(el, comm) {
    el.append("rect")
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_label_height)
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width)
        .attr("class", "deviation-label")
        .on("click", () => {
        comm.emit("sort-by-deviation");
    });
    el.append("text")
        .text("Deviation")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width / 2}, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_bar_height})`);
}
function addDeviationScale(el, maxSize) {
    let scale = d3__WEBPACK_IMPORTED_MODULE_2__["scaleLinear"]()
        .domain([-maxSize, maxSize])
        .range([-_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width / 2, _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width / 2]);
    let domain = [];
    let start = -maxSize;
    while (start <= maxSize) {
        domain.push(start);
        start += 5;
    }
    let g = el.append("g").attr("class", "scale-group");
    g.attr("transform", `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_scale_group_height - _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].axis_offset})`);
    g.append("path")
        .attr("class", "axis")
        .attr("d", `M0,${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_scale_group_height -
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].axis_offset -
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].header_body_padding} H${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width}`);
    let ticks = addTicks(g, domain, scale, _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].axis_offset - _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].header_body_padding - 6, _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width / 2);
    addTickLabels(ticks, 1, -2);
}
// ################################################################################################
function addChildrenToShowList(rowsToShow, row) {
    if (row.data.nestedGroups.length > 0) {
        rowsToShow.push(row);
        row.data.nestedGroups.forEach(ng => {
            addChildrenToShowList(rowsToShow, {
                id: ng.id.toString(),
                data: ng
            });
        });
    }
    else {
        rowsToShow.push(row);
        if (!row.data.isCollapsed) {
            let children = row.data.visibleSets.map(_ => {
                return {
                    id: _.id.toString(),
                    data: _
                };
            });
            rowsToShow.push(...children);
        }
    }
}
function addRenderRows(data, el, usedSetCount, config, comm) {
    let rowsToShow = [];
    if (data.renderRows.filter(_ => _.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_3__["RowType"].GROUP).length > 0) {
        data.renderRows.forEach(row => {
            addChildrenToShowList(rowsToShow, row);
        });
    }
    else {
        rowsToShow = data.renderRows;
    }
    _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_group_height = _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height * rowsToShow.length;
    setupColumnBackgrounds(el, usedSetCount);
    el.attr("transform", `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].used_set_group_height})`);
    _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combinations_width = _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * usedSetCount;
    _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].used_sets = usedSetCount;
    let rows;
    let groups;
    let subsets;
    if (config && !config.CardinalityBars)
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width = 0;
    if (config && !config.DeviationBars)
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width = 0;
    [rows, groups, subsets] = addRows(rowsToShow, el, comm);
    setupSubsets(subsets, comm);
    setupGroups(data, groups, comm);
    collapseGroups(groups, subsets, comm);
    if (!config || config.CardinalityBars) {
        addCardinalityBars(rows, data.renderRows);
    }
    if (!config || config.DeviationBars) {
        addDeviationBars(rows, data.renderRows);
    }
    comm.on("update-attributes", () => {
        updateBackgroundAndAddAttributes(rows, groups, subsets, data);
    });
    comm.on("add-attribute", attr => {
        data.selectedAttributes = addAttributeToSelected(data.selectedAttributes, attr);
        comm.emit("update-attributes");
    });
    comm.on("remove-attribute", attr => {
        data.selectedAttributes = removeAttributeFromSelected(data.selectedAttributes, attr);
        comm.emit("update-attributes");
    });
    comm.emit("update-attributes");
}
function collapseGroups(groups, subsets, comm) { }
function addAttributeToSelected(selected, attr) {
    if (attr && selected.indexOf(attr) < 0)
        selected.push(attr);
    return selected;
}
function removeAttributeFromSelected(selected, attr) {
    if (attr && selected.indexOf(attr) >= 0)
        selected.splice(selected.indexOf(attr), 1);
    return selected;
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
        .attr("transform", `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].skew_offset}, 0)`);
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
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width)
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_group_height)
        .attr("transform", (d, i) => {
        return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * i}, 0)`;
    });
}
function addRows(data, el, comm) {
    let _rows = el
        .selectAll(".row")
        .data(data, function (d, i) {
        return d.id;
    });
    _rows.exit().remove();
    let rows = _rows
        .enter()
        .append("g")
        .style("opacity", 0)
        .attr("transform", (d, i) => {
        if (d.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_3__["RowType"].GROUP)
            return `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height * i})`;
        return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].skew_offset}, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height * i})`;
    })
        .merge(_rows)
        .html("")
        .attr("class", (d, i) => {
        return `row ${d.data.type}`;
    });
    rows
        .transition()
        .duration(300)
        .attr("transform", (d, i) => {
        if (d.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_3__["RowType"].GROUP)
            return `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height * i})`;
        return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].skew_offset}, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height * i})`;
    })
        .style("opacity", 1);
    setupElementGroups(rows, comm);
    let groups = rows.filter((d, i) => {
        return d.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_3__["RowType"].GROUP;
    });
    groups.append("g").attr("class", "group-collapse-g");
    groups.append("g").attr("class", "group-label-g");
    let subsets = rows.filter((d, i) => {
        return d.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_3__["RowType"].SUBSET;
    });
    return [rows, groups, subsets];
}
function setupElementGroups(rows, comm) {
    rows.on("click", d => {
        comm.emit("add-selection-trigger", d);
    });
    rows.append("g").attr("class", "background-rect-g");
    rows
        .append("g")
        .attr("class", "cardinality-bar-group")
        .attr("transform", (d, i) => {
        if (d.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_3__["RowType"].GROUP)
            return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].skew_offset +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combinations_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width}, ${(_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height -
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_bar_height) /
                2})`;
        return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combinations_width +
            _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width}, ${(_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height -
            _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_bar_height) /
            2})`;
    });
    rows
        .append("g")
        .attr("class", "deviation-bar-group")
        .attr("transform", (d, i) => {
        if (d.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_3__["RowType"].GROUP)
            return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].skew_offset +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combinations_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * 3},${(_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height -
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_bar_height) /
                2})`;
        else
            return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combinations_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * 2},${(_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height -
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_bar_height) /
                2})`;
    });
    rows
        .append("g")
        .attr("class", "attribute-group")
        .attr("transform", d => {
        if (d.data.type === _DataStructure_RowType__WEBPACK_IMPORTED_MODULE_3__["RowType"].GROUP)
            return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].skew_offset +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combinations_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * 4},${(_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height -
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_bar_height) /
                2})`;
        else
            return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combinations_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width +
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * 3},${(_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height -
                _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_bar_height) /
                2})`;
    });
}
/** ************* */
/** ************* */
function setupSubsets(subsets, comm) {
    subsets
        .on("mouseover", function () {
        d3__WEBPACK_IMPORTED_MODULE_2__["select"](this)
            .select("rect")
            .classed("highlight highlight2", true);
    })
        .on("mouseout", function () {
        d3__WEBPACK_IMPORTED_MODULE_2__["select"](this)
            .select("rect")
            .classed("highlight highlight2", false);
    });
    addSubsetBackgroundRects(subsets);
    addCombinations(subsets, comm);
}
function addSubsetBackgroundRects(subsets) {
    subsets
        .selectAll(".background-rect-g")
        .append("rect")
        .attr("class", `subset-background-rect`)
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height)
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].subset_row_width);
}
function updateSubsetBackgroundRects(subsets) {
    subsets
        .selectAll(".background-rect-g")
        .selectAll("rect")
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].subset_row_width);
}
function addCombinations(subset, comm) {
    let combinationsGroup = subset.append("g").attr("class", "combination");
    combinationsGroup.each(function (d) {
        let membershipDetails = d.data.combinedSets;
        let degree = membershipDetails.reduce((i, j) => i + j, 0);
        let comboGroup = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this)
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
        .attr("r", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combo_circle_radius)
        .attr("cy", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height / 2)
        .attr("cx", (d, i) => {
        return _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width / 2 + _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * i;
    })
        .attr("class", (d, i) => {
        if (d === 0)
            return `set-membership not-member`;
        return `set-membership member`;
    })
        .on("mouseover", function (d, i) {
        let parentG = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).node().parentNode;
        let rect = d3__WEBPACK_IMPORTED_MODULE_2__["select"](parentG).node().parentNode;
        d3__WEBPACK_IMPORTED_MODULE_2__["select"](rect)
            .select("rect")
            .classed("highlight highlight2", true);
        d3__WEBPACK_IMPORTED_MODULE_2__["selectAll"](`.S_${i}`).classed("highlight", true);
    })
        .on("mouseout", function (d, i) {
        let parentG = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).node().parentNode;
        let rect = d3__WEBPACK_IMPORTED_MODULE_2__["select"](parentG).node().parentNode;
        d3__WEBPACK_IMPORTED_MODULE_2__["select"](rect)
            .select("rect")
            .classed("highlight highlight2", false);
        d3__WEBPACK_IMPORTED_MODULE_2__["selectAll"](`.S_${i}`).classed("highlight", false);
    });
}
function addCombinationLine(el, first, last) {
    d3__WEBPACK_IMPORTED_MODULE_2__["select"](el)
        .append("line")
        .attr("class", "combination-line")
        .attr("x1", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width / 2 + _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * first)
        .attr("x2", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width / 2 + _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * last)
        .attr("y1", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height / 2)
        .attr("y2", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height / 2);
}
function addRowHighlight(el) {
    d3__WEBPACK_IMPORTED_MODULE_2__["select"](el)
        .on("mouseover", function (d) {
        d.data.combinedSets.forEach((idx, i) => {
            if (idx === 1)
                d3__WEBPACK_IMPORTED_MODULE_2__["selectAll"](`.S_${i}`).classed("highlight", true);
        });
    })
        .on("mouseout", function (d, i) {
        d.data.combinedSets.forEach((idx, i) => {
            d3__WEBPACK_IMPORTED_MODULE_2__["selectAll"](`.S_${i}`).classed("highlight", false);
        });
    });
}
/** ************* */
/** ************* */
function setupGroups(data, groups, comm) {
    addGroupCollapseIcons(groups, comm);
    addGroupBackgroundRects(groups);
    addGroupLabels(groups);
    addGroupCombination(data, groups);
}
function addGroupCollapseIcons(groups, comm) {
    let collapse = groups
        .selectAll(".group-collapse-g")
        .append("text")
        .attr("class", "group-collapse-g")
        .html((d) => {
        if (d.data.isCollapsed)
            return "&#9656;";
        return "&#9662;";
    })
        .attr("transform", (d, i) => {
        if (d.data.level == 2)
            return `translate(23, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height - 4})`;
        return `translate(3, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height - 4})`;
    });
    collapse.style("cursor", "pointer");
    collapse.on("click", (d) => {
        comm.emit("collapse-group", d);
        d3__WEBPACK_IMPORTED_MODULE_2__["event"].stopPropagation();
    });
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
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height)
        .attr("width", (d) => {
        if (d.data.level === 2)
            return _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].group_row_width - 20;
        return _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].group_row_width;
    })
        .attr("transform", (d) => {
        if (d.data.level === 2)
            return `translate(20, 0)`;
        return "translate(0,0)";
    })
        .attr("rx", 5)
        .attr("ry", 10);
}
function updateGroupBackgroundRects(groups) {
    groups
        .selectAll(".background-rect-g")
        .selectAll("rect")
        .attr("width", (d) => {
        if (d.data.level === 2)
            return _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].group_row_width - 20;
        return _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].group_row_width;
    });
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
            return `translate(35, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height - 4})`;
        return `translate(15, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height - 4})`;
    });
}
function addGroupCombination(data, groups) {
    let combinationG = groups.append("g").classed("combination", true);
    combinationG.attr("transform", (d, i) => {
        if (d.data.level === 1) {
            return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].skew_offset}, 0)`;
        }
        else {
            return `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].skew_offset},0)`;
        }
    });
    combinationG.each(function (d) {
        let aggBy = d.data.aggBy;
        if (aggBy === _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].OVERLAPS || aggBy === _DataStructure_AggregateAndFilters__WEBPACK_IMPORTED_MODULE_0__["AggregateBy"].SETS) {
            let comboGroup = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this)
                .selectAll(".set-membership")
                .data(d.data.setMemberships);
            addGroupCombinationCircles(comboGroup);
        }
    });
}
function addGroupCombinationCircles(comboGroup) {
    comboGroup
        .exit()
        .transition()
        .duration(100)
        .remove();
    let cgs = comboGroup
        .enter()
        .append("circle")
        .merge(comboGroup)
        .attr("r", d => {
        if (d === 0)
            return _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combo_circle_radius - 5;
        return _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combo_circle_radius - 1;
    })
        .attr("cy", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height / 2)
        .attr("cx", (d, i) => {
        return _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width / 2 + _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * i;
    })
        .attr("class", (d, i) => {
        // if (d === 0) return `set-membership not-member`;
        return `set-membership member`;
    })
        .on("mouseover", function (d, i) {
        let parentG = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).node().parentNode;
        let rect = d3__WEBPACK_IMPORTED_MODULE_2__["select"](parentG).node().parentNode;
        // d3.select(rect)
        //   .select("rect")
        //   .classed("highlight highlight2", true);
        d3__WEBPACK_IMPORTED_MODULE_2__["selectAll"](`.S_${i}`).classed("highlight", true);
    })
        .on("mouseout", function (d, i) {
        let parentG = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).node().parentNode;
        let rect = d3__WEBPACK_IMPORTED_MODULE_2__["select"](parentG).node().parentNode;
        // d3.select(rect)
        //   .select("rect")
        //   .classed("highlight highlight2", false);
        d3__WEBPACK_IMPORTED_MODULE_2__["selectAll"](`.S_${i}`).classed("highlight", false);
    });
    cgs
        .append("circle")
        .attr("r", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combo_circle_radius - 1)
        .attr("cy", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].row_height / 2)
        .attr("cx", (d, i) => {
        return _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width / 2 + _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * i;
    })
        .classed("set-membership member", true);
}
/** ************* */
/** ************* */
function addCardinalityBars(rows, data) {
    let maxSubsetSize = d3__WEBPACK_IMPORTED_MODULE_2__["max"](data.map(d => d.data.setSize));
    let scale = getCardinalityScale(maxSubsetSize, _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width);
    let cardinalityGroups = rows.selectAll(".cardinality-bar-group");
    renderCardinalityBars(cardinalityGroups, scale);
}
function adjustCardinalityBars(maxDomain) {
    let scale = getCardinalityScale(maxDomain, _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width);
    let el = d3__WEBPACK_IMPORTED_MODULE_2__["selectAll"](".row").selectAll(".cardinality-bar-group");
    renderCardinalityBars(el, scale);
}
function renderCardinalityBars(el, scale) {
    el.html("");
    el.each(function (d, i) {
        let g = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this);
        let width = scale(d.data.setSize);
        let loop = Math.floor(width / _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width) + 1;
        let rem = width % _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width;
        let brk = false;
        if (loop > 3) {
            brk = true;
            loop = 4;
            rem = 0;
        }
        let offset = _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].horizon_offset;
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
            return _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width;
        })
            .attr("height", (d, i) => {
            let height = _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_bar_height - offset * i;
            if (height < 0)
                return 2;
            return height;
        })
            .attr("transform", (d, i) => {
            return `translate(0, ${((_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_bar_height - offset) * i) /
                4})`;
        });
        if (brk) {
            g.append("line")
                .attr("class", "break-bar")
                .attr("y1", 0)
                .attr("y2", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_bar_height)
                .attr("x1", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width - 20)
                .attr("x2", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width - 10);
            g.append("line")
                .attr("class", "break-bar")
                .attr("y1", 0)
                .attr("y2", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_bar_height)
                .attr("x1", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width - 25)
                .attr("x2", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width - 15);
        }
        g.append("text")
            .attr("class", "cardinality-text")
            .text(d.data.setSize)
            .attr("transform", (d, i) => {
            return loop > 1
                ? `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width +
                    5}, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_bar_height / 2})`
                : `translate(${rem + 5}, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_bar_height / 2})`;
        })
            .attr("dy", "0.4em");
    });
}
function getCardinalityScale(maxSize, maxWidth) {
    if (maxSize > 8000) {
        return d3__WEBPACK_IMPORTED_MODULE_2__["scalePow"]()
            .exponent(0.75)
            .domain([0.01, maxSize])
            .range([0.01, maxWidth]);
    }
    if (maxSize > 2000) {
        return d3__WEBPACK_IMPORTED_MODULE_2__["scalePow"]()
            .exponent(0.8)
            .domain([0.01, maxSize])
            .range([0.01, maxWidth]);
    }
    return d3__WEBPACK_IMPORTED_MODULE_2__["scaleLinear"]()
        .domain([0, maxSize])
        .range([0, maxWidth]);
}
/** ************* */
/** ************* */
function addDeviationBars(rows, data) {
    let maxDeviation = d3__WEBPACK_IMPORTED_MODULE_2__["max"](data.map(r => Math.abs(r.data.disproportionality * 100)));
    maxDeviation = Math.ceil(maxDeviation / 5) * 5;
    let scale = getDeviationScale(maxDeviation, _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width / 2);
    let deviationGroup = rows.selectAll(".deviation-bar-group");
    renderDeviationBars(deviationGroup, scale);
}
function getDeviationScale(maxSize, maxWidth) {
    return d3__WEBPACK_IMPORTED_MODULE_2__["scaleLinear"]()
        .domain([0, maxSize])
        .range([0, maxWidth]);
}
function renderDeviationBars(el, scale) {
    el.html("")
        .append("rect")
        .attr("width", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width)
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_bar_height)
        .style("fill", "none");
    el.append("rect")
        .attr("class", (d, i) => {
        return d.data.disproportionality >= 0
            ? `disproportionality positive`
            : `disproportionality negative`;
    })
        .attr("height", (d, i) => {
        return _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_bar_height;
    })
        .attr("width", (d, i) => {
        return scale(Math.abs(d.data.disproportionality) * 100);
    })
        .attr("transform", (d, i) => {
        return d.data.disproportionality >= 0
            ? `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width / 2}, 0)`
            : `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width / 2 +
                scale(d.data.disproportionality * 100)}, 0)`;
    });
}
/** ************* */
function addAttributeHeaders(el, data, comm) {
    el.html("");
    el.attr("transform", `translate(${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].skew_offset +
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].combinations_width +
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].cardinality_width +
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].deviation_width +
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].column_width * 4}, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].header_height -
        _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].header_body_padding -
        29})`);
    let attrHeaders = el.selectAll(".attribute").data(data.selectedAttributes);
    attrHeaders.exit().remove();
    attrHeaders = attrHeaders
        .enter()
        .append("g")
        .classed("attribute", true)
        .merge(attrHeaders)
        .attr("transform", (_, i) => `translate(${i * (_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].attribute_width + 25)}, 0)`);
    addAttrHeaders(attrHeaders, comm);
}
function addAttrHeaders(el, comm) {
    el.each(function (d) {
        let t = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this)
            .html("")
            .append("g");
        // let close = t.append("g").html(html);
        // close.attr("transform", `translate(${params.attribute_width}, -10)`);
        t.on("click", () => comm.emit("remove-attribute-trigger", d));
        t.append("text").text(d.name);
        // t.append("rect")
        //   .attr("width", params.attribute_width)
        //   .attr("height", 20)
        //   .classed("label", true)
        //   .attr("transform", `translate(0, -18)`);
        let scale = d3__WEBPACK_IMPORTED_MODULE_2__["scaleLinear"]()
            .domain([d.min, d.max])
            .range([0, _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].attribute_width]);
        let ax = d3__WEBPACK_IMPORTED_MODULE_2__["axisTop"](scale).ticks(2);
        d3__WEBPACK_IMPORTED_MODULE_2__["select"](this)
            .append("g")
            .attr("transform", `translate(0, 30)`)
            .call(ax);
    });
}
/** ************* */
// ! Undefined function???
function updateBackgroundAndAddAttributes(rows, groups, subset, data) {
    _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].no_attributes_shown = data.selectedAttributes.length;
    updateGroupBackgroundRects(groups);
    updateSubsetBackgroundRects(subset);
    addAttributes(rows, data);
}
function addAttributes(rows, data) {
    let attributeGroups = rows.selectAll(".attribute-group").html("");
    let attrs = attributeGroups
        .selectAll(".attribute")
        .data(data.selectedAttributes);
    attrs.exit().remove();
    attrs = attrs
        .enter()
        .append("g")
        .classed("attribute", true)
        .merge(attrs);
    attrs.attr(attributeName, d => {
        return d.name;
    });
    attrs.attr("transform", (_, i) => {
        return `translate(${i * (_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].attribute_width + 25)}, 0)`;
    });
    attributeGroups.each(function (d) {
        let itemIndices = d.data.items;
        let attrs = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).selectAll(".attribute");
        attrs.each(function (d) {
            let el = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this);
            let attrName = el.attr(attributeName);
            let relevantAttr = data.selectedAttributes.filter(_ => _.name === attrName)[0];
            let overAllMin = d3__WEBPACK_IMPORTED_MODULE_2__["min"](relevantAttr.values);
            let overAllMax = d3__WEBPACK_IMPORTED_MODULE_2__["max"](relevantAttr.values);
            let memberValues = relevantAttr.values.filter((_, i) => itemIndices.indexOf(i) > -1);
            let localStats = getBoxPlotStats(memberValues);
            let boxPlotMaxWidth = _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].attribute_width;
            let bpScale = d3__WEBPACK_IMPORTED_MODULE_2__["scaleLinear"]()
                .domain([overAllMin, overAllMax])
                .range([0, boxPlotMaxWidth]);
            addBoxPlot(el, localStats, bpScale);
        });
    });
}
function getBoxPlotStats(values) {
    values.sort((a, b) => a - b);
    return {
        min: d3__WEBPACK_IMPORTED_MODULE_2__["min"](values),
        max: d3__WEBPACK_IMPORTED_MODULE_2__["max"](values),
        quantile25: d3__WEBPACK_IMPORTED_MODULE_2__["quantile"](values, 0.25),
        quantile50: d3__WEBPACK_IMPORTED_MODULE_2__["quantile"](values, 0.5),
        quantile75: d3__WEBPACK_IMPORTED_MODULE_2__["quantile"](values, 0.75)
    };
}
function addBoxPlot(el, data, scale) {
    let bpGroup = el.append("g");
    bpGroup.attr("transform", `translate(0, ${_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].attribute_bar_height / 4})`);
    addWhiskers(bpGroup, data, scale);
    addBoxes(bpGroup, data, scale);
}
function addWhiskers(el, data, scale) {
    el.append("line")
        .classed("whisker", true)
        .attr("x1", scale(data.min))
        .attr("x2", scale(data.min))
        .attr("y1", 0)
        .attr("y2", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].attribute_bar_height / 2);
    el.append("line")
        .classed("whisker", true)
        .attr("x1", scale(data.max))
        .attr("x2", scale(data.max))
        .attr("y1", 0)
        .attr("y2", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].attribute_bar_height / 2);
    el.append("line")
        .classed("whisker", true)
        .attr("x1", scale(data.min))
        .attr("x2", scale(data.max))
        .attr("y1", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].attribute_bar_height / 4)
        .attr("y2", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].attribute_bar_height / 4);
}
function addBoxes(el, data, scale) {
    el.append("rect")
        .classed("boxplot-box", true)
        .attr("height", _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].attribute_bar_height / 2)
        .attr("width", scale(data.quantile75) - scale(data.quantile25))
        .attr("x", scale(data.quantile25));
    el.append("line")
        .classed("whisker", true)
        .attr("x1", scale(data.quantile50))
        .attr("x2", scale(data.quantile50))
        .attr("y1", 0 - _ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].attribute_bar_height / 4)
        .attr("y2", (_ui_params__WEBPACK_IMPORTED_MODULE_1__["default"].attribute_bar_height * 3) / 4);
}


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
    get attribute_bar_height() {
        return params.row_height - 4;
    },
    attribute_group_height: 100,
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
/* harmony default export */ __webpack_exports__["default"] = (`<div id="vis" class="position-relative"></div>
<div id="test"></div>`);

/***/ }),

/***/ "./src/VegaFactory/VegaFactory.ts":
/*!****************************************!*\
  !*** ./src/VegaFactory/VegaFactory.ts ***!
  \****************************************/
/*! exports provided: CreateVegaVis */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateVegaVis", function() { return CreateVegaVis; });
/* harmony import */ var vega_embed__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vega-embed */ "./node_modules/vega-embed/build/src/embed.js");
/* harmony import */ var vega__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vega */ "./node_modules/vega/index.js");


function CreateVegaVis(spec, el) {
    vega_embed__WEBPACK_IMPORTED_MODULE_0__["default"](el.node(), spec, {
        mode: "vega-lite",
        hover: false,
        renderer: "svg",
        runAsync: true,
        logLevel: vega__WEBPACK_IMPORTED_MODULE_1__["None"],
        actions: false
    });
}


/***/ }),

/***/ "./src/app/app.ts":
/*!************************!*\
  !*** ./src/app/app.ts ***!
  \************************/
/*! exports provided: serverUrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "serverUrl", function() { return serverUrl; });
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
/* harmony import */ var _ElementView_ElementViewModel__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../ElementView/ElementViewModel */ "./src/ElementView/ElementViewModel.ts");
/* harmony import */ var _ElementView_ElementView__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../ElementView/ElementView */ "./src/ElementView/ElementView.ts");
/* harmony import */ var _DatasetSelectionView_DatasetSelectionViewModel__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../DatasetSelectionView/DatasetSelectionViewModel */ "./src/DatasetSelectionView/DatasetSelectionViewModel.ts");
/* harmony import */ var _DatasetSelectionView_DatasetSelectionView__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../DatasetSelectionView/DatasetSelectionView */ "./src/DatasetSelectionView/DatasetSelectionView.ts");
/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:08
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-10-09 16:10:33
 */






















const serverUrl = "http://18.224.213.250";
function run() {
    let application = new provenance_mvvm_framework__WEBPACK_IMPORTED_MODULE_2__["Application"]("Upset2.0", "1.0.0");
    _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_5__["DataUtils"].app = application;
    _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_5__["DataUtils"].app.on("change-dataset", _DataStructure_DataUtils__WEBPACK_IMPORTED_MODULE_5__["DataUtils"].processDataSet);
    if (sessionStorage["provenance-graph"]) {
        application.graph = JSON.parse(sessionStorage["provenance-graph"]);
        application.registry = JSON.parse(sessionStorage["provenance-registry"]);
    }
    new _DatasetSelectionView_DatasetSelectionViewModel__WEBPACK_IMPORTED_MODULE_20__["DatasetSelectionViewModel"](new _DatasetSelectionView_DatasetSelectionView__WEBPACK_IMPORTED_MODULE_21__["DatasetSelectionView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"]("body").node()), application);
    new _DataSetInfoView_DataSetInfoViewModel__WEBPACK_IMPORTED_MODULE_4__["DataSetInfoViewModel"](new _DataSetInfoView_DataSetInfoView__WEBPACK_IMPORTED_MODULE_3__["DataSetInfoView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#dataset-info-box").node()), application);
    new _NavBarView_NavBarViewModel__WEBPACK_IMPORTED_MODULE_10__["NavBarViewModel"](new _NavBarView_NavBarView__WEBPACK_IMPORTED_MODULE_9__["NavBarView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#navigation-bar").node()), application, "data/datasets.json");
    new _FilterBoxView_FilterBoxViewModel__WEBPACK_IMPORTED_MODULE_8__["FilterBoxViewModel"](new _FilterBoxView_FilterBoxView__WEBPACK_IMPORTED_MODULE_7__["FilterBoxView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#filter-box").node()), application);
    new _ProvenanceView_ProvenanceViewModel__WEBPACK_IMPORTED_MODULE_12__["ProvenanceViewModel"](new _ProvenanceView_ProvenanceView__WEBPACK_IMPORTED_MODULE_11__["ProvenanceView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"](".provenance-view").node()), application);
    let isIFrame = window.self !== window.top;
    let ec = null;
    if (!isIFrame) {
        Object(_EmbedGenView_EmbedGenView__WEBPACK_IMPORTED_MODULE_6__["EmbedGenView"])(d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#embed-modal"));
    }
    else {
        ec = renderIFrame();
    }
    new _UpsetView_UpsetViewModel__WEBPACK_IMPORTED_MODULE_16__["UpsetViewModel"](new _UpsetView_UpsetView__WEBPACK_IMPORTED_MODULE_14__["UpsetView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#mid-bar").node(), ec), application);
    new _UnusedSetsView_UnusedSetViewModel__WEBPACK_IMPORTED_MODULE_15__["UnusedSetViewModel"](new _UnusedSetsView_UnusedSetView__WEBPACK_IMPORTED_MODULE_13__["UnusedSetView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#vis").node()), application);
    new _ElementView_ElementViewModel__WEBPACK_IMPORTED_MODULE_18__["ElementViewModel"](new _ElementView_ElementView__WEBPACK_IMPORTED_MODULE_19__["ElementView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#right-side-bar").node()), application);
}
run();
function renderIFrame() {
    let ec = JSON.parse(unescape(window.location.hash.replace("#", "")));
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

/***/ }),

/***/ "./src/lib/dsv_importer/src/DataTypes/DatasetInfo.ts":
/*!***********************************************************!*\
  !*** ./src/lib/dsv_importer/src/DataTypes/DatasetInfo.ts ***!
  \***********************************************************/
/*! exports provided: getBlankDSInfo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBlankDSInfo", function() { return getBlankDSInfo; });
function getBlankDSInfo() {
    return {
        username: "",
        email: "",
        file: "",
        name: "",
        header: 0,
        separator: "",
        skip: -1,
        meta: [],
        sets: [],
        author: "",
        description: "",
        source: "",
        text: ""
    };
}


/***/ }),

/***/ "./src/lib/dsv_importer/src/FileUploadView/FileUpload.ts":
/*!***************************************************************!*\
  !*** ./src/lib/dsv_importer/src/FileUploadView/FileUpload.ts ***!
  \***************************************************************/
/*! exports provided: FileUpload */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileUpload", function() { return FileUpload; });
/* harmony import */ var _app_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../app/app */ "./src/lib/dsv_importer/src/app/app.ts");
/* harmony import */ var _DataTypes_DatasetInfo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../DataTypes/DatasetInfo */ "./src/lib/dsv_importer/src/DataTypes/DatasetInfo.ts");
/* harmony import */ var _FileUpload_view_html__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FileUpload.view.html */ "./src/lib/dsv_importer/src/FileUploadView/FileUpload.view.html");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles.scss */ "./src/lib/dsv_importer/src/FileUploadView/styles.scss");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! d3 */ "./src/lib/dsv_importer/node_modules/d3/index.js");
/* harmony import */ var _Utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Utils/utils */ "./src/lib/dsv_importer/src/Utils/utils.ts");







function FileUpload(root) {
    root.html(_FileUpload_view_html__WEBPACK_IMPORTED_MODULE_2__["default"]);
    let datasetInfo = Object(_DataTypes_DatasetInfo__WEBPACK_IMPORTED_MODULE_1__["getBlankDSInfo"])();
    let file;
    let fileInputElement = root.select(".file-input");
    let form = root.select(".input-form");
    let isFirstCall = true;
    let submitBtn = root.select("#submit-btn");
    submitBtn.property("disabled", true);
    _app_app__WEBPACK_IMPORTED_MODULE_0__["pubsub"].on("file-uploaded", (file, info) => {
        processFileUploadForm(form, file, info, isFirstCall);
        isFirstCall = false;
    });
    _app_app__WEBPACK_IMPORTED_MODULE_0__["pubsub"].on("broadcast-dataset-info", info => {
        console.log("Info", info);
        datasetInfo = info;
    });
    fileInputElement.on("input", () => {
        file = getUploadedFile();
        if (file) {
            root.select(".file-name").text(file.name);
            datasetInfo.separator = root.select(".delimiter").property("value");
            console.log(datasetInfo.separator);
            _app_app__WEBPACK_IMPORTED_MODULE_0__["pubsub"].emit("file-uploaded", file, datasetInfo);
        }
    });
    let delimiterDropdown = root.select(".delimiter");
    delimiterDropdown.on("input", function () {
        datasetInfo.separator = d3__WEBPACK_IMPORTED_MODULE_4__["select"](this).property("value");
        _app_app__WEBPACK_IMPORTED_MODULE_0__["pubsub"].emit("file-uploaded", file, datasetInfo);
        _app_app__WEBPACK_IMPORTED_MODULE_0__["pubsub"].emit("broadcast-dataset-info", datasetInfo);
    });
}
function processFileUploadForm(inputForm, file, datasetInfo, firstCall = false) {
    let submitBtn = inputForm.select("#submit-btn");
    if (firstCall) {
        inputForm.selectAll("input").on("input", () => {
            processFileUploadForm(inputForm, file, datasetInfo);
        });
        inputForm.selectAll("textarea").on("input", () => {
            processFileUploadForm(inputForm, file, datasetInfo);
        });
        submitBtn.on("click", () => {
            let fd = new FormData();
            fd.append("file", d3__WEBPACK_IMPORTED_MODULE_4__["select"](".file-input").property("files")[0]);
            fd.append("metadata", JSON.stringify(datasetInfo).replace(/\\\\/g, "\\"));
            let xhr = new XMLHttpRequest();
            xhr.open("POST", `${_app_app__WEBPACK_IMPORTED_MODULE_0__["serverUrl"]}upload/single`);
            xhr.send(fd);
        });
    }
    let warningDiv = inputForm.select(".notification");
    let warnings = [];
    let name = inputForm.select("input[name=fullname]").property("value");
    let email = inputForm.select("input[name=email]").property("value");
    let datasetName = inputForm.select("input[name=dataset]").property("value");
    let authors = inputForm.select("input[name=authors]").property("value");
    let description = inputForm
        .select("textarea[name=description")
        .property("value");
    if (!file) {
        warnings.push("Please select file to upload");
    }
    if (file.size > 5242880) {
        warnings.push("File too large");
    }
    if (!name || !name.trim()) {
        warnings.push("Please enter Full Name");
    }
    if (!email || !email.trim()) {
        warnings.push("Please enter a valid email id.");
    }
    else if (!Object(_Utils_utils__WEBPACK_IMPORTED_MODULE_5__["isValidEmail"])(email)) {
        warnings.push("Please enter a valid email id");
    }
    if (!datasetName || !datasetName.trim()) {
        warnings.push("Please enter name for the dataset");
    }
    if (warnings.length > 0) {
        warningDiv.classed("is-hidden", false);
        warningDiv.html("");
        warnings.forEach(w => {
            warningDiv.append("div").text(w);
        });
        submitBtn.property("disabled", true);
        return;
    }
    warningDiv.classed("is-hidden", true);
    submitBtn.property("disabled", false);
    datasetInfo.username = name;
    datasetInfo.email = email;
    datasetInfo.name = datasetName;
    datasetInfo.author = authors;
    datasetInfo.description = description;
    _app_app__WEBPACK_IMPORTED_MODULE_0__["pubsub"].emit("broadcast-dataset-info", datasetInfo);
}
function getUploadedFile() {
    if (window.File &&
        window.FileReader &&
        window.FileList &&
        window.Blob) {
    }
    else {
        alert("The File APIs are not fully supported in this browser.");
        throw new Error();
    }
    let file = event.target.files[0];
    return file;
}


/***/ }),

/***/ "./src/lib/dsv_importer/src/FileUploadView/FileUpload.view.html":
/*!**********************************************************************!*\
  !*** ./src/lib/dsv_importer/src/FileUploadView/FileUpload.view.html ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<div class="file-upload">
  <div class="columns is-vcentered">

    <div class="column is-narrow">
      <section class="hero">
        <div class="hero-body">
          <div class="is">
            <h1 class="title has-text-centered">
              Dataset Importer
            </h1>
            <h2 class="subtitle has-text-centered">
              Prepare your dataset
            </h2>

            <div class="file is-centered has-name is-boxed">
              <label class="file-label">
                <input class="file-input" type="file" name="resume">
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload"></i>
                  </span>
                  <span class="file-label">
                    Choose a dataset…
                  </span>
                </span>
                <span class="file-name has-text-centered">
                  ...
                </span>
              </label>
            </div>

            <div class="field has-text-centered">
              <label class="label">Select Delimiter</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select class="delimiter">
                    <option value=";">Semicolon ;</option>
                    <option value=",">Comma ,</option>
                    <option value=" ">Space</option>
                    <option value="\t">Tab \t</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>

    <div class="column input-form">
      <div class="columns is-vcentered is-centered">

        <div class="column is-half">
          <div class="field">
            <label class="label">Full Name*</label>
            <div class="control">
              <input class="input" type="text" placeholder="John Doe" name="fullname" value="Test">
            </div>
          </div>

          <div class="field">
            <label class="label">Email ID*</label>
            <div class="control">
              <input class="input" type="email" placeholder="johndoe@email.com" name="email" value="test@test.com">
            </div>
          </div>

          <div class="field">
            <label class="label">Dataset Name*</label>
            <div class="control">
              <input class="input" type="text" placeholder="Dataset Name" name="dataset" value="Test">
            </div>
          </div>


        </div>
        <div class="column is-half">

          <div class="field">
            <label class="label">Authors</label>
            <div class="control">
              <input class="input" type="text" placeholder="List of Authors" name="authors">
            </div>
          </div>



          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea class="textarea resize-none" placeholder="Enter dataset description." rows="4" name="description"></textarea>
            </div>
          </div>


        </div>

      </div>

      <div class="field">
        <div class="control">
          <button id="submit-btn" class="button">Upload</button>
        </div>
      </div>

      <div class="notification is-warning is-hidden">
      </div>
    </div>
  </div>
</div>`);

/***/ }),

/***/ "./src/lib/dsv_importer/src/FileUploadView/styles.scss":
/*!*************************************************************!*\
  !*** ./src/lib/dsv_importer/src/FileUploadView/styles.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/mini-css-extract-plugin/dist/loader.js!../../../../../node_modules/css-loader!../../../../../node_modules/postcss-loader/lib??ref--5-3!../../../../../node_modules/sass-loader/lib/loader.js!./styles.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/lib/dsv_importer/src/FileUploadView/styles.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/lib/dsv_importer/src/FileView/FileView.ts":
/*!*******************************************************!*\
  !*** ./src/lib/dsv_importer/src/FileView/FileView.ts ***!
  \*******************************************************/
/*! exports provided: FileView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileView", function() { return FileView; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./src/lib/dsv_importer/node_modules/d3/index.js");
/* harmony import */ var _file_view_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./file.view.html */ "./src/lib/dsv_importer/src/FileView/file.view.html");
/* harmony import */ var _FileUploadView_FileUpload__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../FileUploadView/FileUpload */ "./src/lib/dsv_importer/src/FileUploadView/FileUpload.ts");
/* harmony import */ var _TableView_TableView__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../TableView/TableView */ "./src/lib/dsv_importer/src/TableView/TableView.ts");




function FileView(container, state) {
    let root = d3__WEBPACK_IMPORTED_MODULE_0__["select"](container.getElement()[0]);
    root.html(_file_view_html__WEBPACK_IMPORTED_MODULE_1__["default"]);
    let fileUpload = root.select(".file-upload-view");
    Object(_FileUploadView_FileUpload__WEBPACK_IMPORTED_MODULE_2__["FileUpload"])(fileUpload);
    let tableview = root.select(".table-view");
    Object(_TableView_TableView__WEBPACK_IMPORTED_MODULE_3__["TableView"])(tableview);
}


/***/ }),

/***/ "./src/lib/dsv_importer/src/FileView/file.view.html":
/*!**********************************************************!*\
  !*** ./src/lib/dsv_importer/src/FileView/file.view.html ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<div class="file-upload-view"></div>
<div class="table-view"></div>
<div id="test" class="test-view"></div>`);

/***/ }),

/***/ "./src/lib/dsv_importer/src/TableView/ColumnType.ts":
/*!**********************************************************!*\
  !*** ./src/lib/dsv_importer/src/TableView/ColumnType.ts ***!
  \**********************************************************/
/*! exports provided: ColumnType, ColumnTypeDictionary */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColumnType", function() { return ColumnType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColumnTypeDictionary", function() { return ColumnTypeDictionary; });
var ColumnType;
(function (ColumnType) {
    ColumnType[ColumnType["Number"] = 0] = "Number";
    ColumnType[ColumnType["Label"] = 1] = "Label";
    ColumnType[ColumnType["Set"] = 2] = "Set";
    ColumnType[ColumnType["Set_List"] = 3] = "Set_List";
    ColumnType[ColumnType["Categorical"] = 4] = "Categorical";
})(ColumnType || (ColumnType = {}));
let ColumnTypeDictionary = {
    0: "Number",
    1: "Label",
    2: "Set",
    3: "Set List",
    4: "Categorical"
};


/***/ }),

/***/ "./src/lib/dsv_importer/src/TableView/TableView.ts":
/*!*********************************************************!*\
  !*** ./src/lib/dsv_importer/src/TableView/TableView.ts ***!
  \*********************************************************/
/*! exports provided: TableView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableView", function() { return TableView; });
/* harmony import */ var _ColumnType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ColumnType */ "./src/lib/dsv_importer/src/TableView/ColumnType.ts");
/* harmony import */ var _app_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../app/app */ "./src/lib/dsv_importer/src/app/app.ts");
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! d3 */ "./src/lib/dsv_importer/node_modules/d3/index.js");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles.scss */ "./src/lib/dsv_importer/src/TableView/styles.scss");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _dropdown_view_html__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dropdown.view.html */ "./src/lib/dsv_importer/src/TableView/dropdown.view.html");
/* harmony import */ var _Utils_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Utils/utils */ "./src/lib/dsv_importer/src/Utils/utils.ts");






function TableView(root) {
    let dsInfo;
    _app_app__WEBPACK_IMPORTED_MODULE_1__["pubsub"].on("file-uploaded", (file, info) => {
        dsInfo = info;
        processDataset(file, info);
    });
    _app_app__WEBPACK_IMPORTED_MODULE_1__["pubsub"].on("data-processed", (data) => {
        _app_app__WEBPACK_IMPORTED_MODULE_1__["pubsub"].on("update-dataset-info", (cdt) => {
            updateDatasetInfoWithSets(data, dsInfo, cdt);
        });
        processRawData(data, root);
    });
}
function processDataset(file, info) {
    let reader = getReader(parseDSV, info);
    reader.readAsDataURL(file);
}
function getReader(parseDSV, info) {
    let reader = new FileReader();
    reader.onload = event => parseDSV(event.target.result, info);
    return reader;
}
function parseDSV(url, info) {
    let temp = JSON.stringify(info).replace(/\\\\/g, "\\");
    console.log(JSON.parse(temp));
    d3__WEBPACK_IMPORTED_MODULE_2__["dsv"](JSON.parse(temp).separator, url).then(data => {
        _app_app__WEBPACK_IMPORTED_MODULE_1__["pubsub"].emit("data-processed", data);
    });
}
function processRawData(data, root) {
    let columns = data.columns.slice();
    columns.unshift("ID");
    data.forEach((d, i) => {
        d["ID"] = i + 1;
    });
    let subSet = getSubsetOfLength(data, 15);
    let table = buildTable(root, subSet, columns);
}
function getSubsetOfLength(data, offset) {
    let length = data.length - 1;
    let subSet = [];
    subSet = data.slice(0, offset);
    subSet.push(...data.slice(length - offset, length));
    return subSet;
}
function buildTable(root, data, columns) {
    let columnDataTypes = readDefaultColumnTypes(data, columns);
    _app_app__WEBPACK_IMPORTED_MODULE_1__["pubsub"].emit("update-dataset-info", columnDataTypes);
    _app_app__WEBPACK_IMPORTED_MODULE_1__["pubsub"].on("column-type-changed", (colName, newType) => {
        columnDataTypes[colName] = newType;
        _app_app__WEBPACK_IMPORTED_MODULE_1__["pubsub"].emit("update-dataset-info", columnDataTypes);
    });
    root.classed("table-view", true).style("height", () => {
        let header_height = d3__WEBPACK_IMPORTED_MODULE_2__["select"](".file-upload").style("height");
        return `calc(99vh - ${header_height})`;
    });
    let table = root.selectAll(".table-container").data([1]);
    table.exit().remove();
    table = table
        .enter()
        .append("div")
        .classed("table-container", true)
        .merge(table)
        .html("");
    table.append("table");
    let thead = table.append("thead");
    let tbody = table.append("tbody");
    let rows = buildBody(tbody, data, columns);
    buildHeader(thead, columnDataTypes);
    return table;
}
function buildBody(root, data, columns) {
    data.splice(15, 0, null);
    let rows = root
        .selectAll("tr")
        .data(data)
        .enter()
        .append("tr");
    let cells = rows
        .selectAll("td")
        .data((row, rowidx) => {
        if (row === null) {
            return columns.map(col => {
                return {
                    column: col,
                    value: "..."
                };
            });
        }
        return columns.map(col => {
            return {
                column: col,
                value: row[col]
            };
        });
    })
        .enter()
        .append("td")
        .text(d => d.value);
    return rows;
}
function buildHeader(root, columns) {
    let headerRow = root.append("tr");
    let header_group = addHeaderGroup(headerRow, columns);
    let header_selectors = addHeaderSelectors(header_group);
    addHeaderLabels(header_group);
    setUpDropdowns(header_selectors);
}
function addHeaderGroup(headerRow, columns) {
    let header_group = headerRow
        .selectAll(".header-group")
        .data(d3__WEBPACK_IMPORTED_MODULE_2__["entries"](columns));
    header_group.exit().remove();
    header_group = header_group
        .enter()
        .append("th")
        .merge(header_group)
        .classed("header-group", true)
        .html("");
    return header_group;
}
function addHeaderSelectors(header_group) {
    return header_group
        .append("div")
        .classed("header-selector", true)
        .html(_dropdown_view_html__WEBPACK_IMPORTED_MODULE_4__["default"])
        .each(function (d) {
        d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).select("select");
    });
}
function addHeaderLabels(header_group) {
    return header_group
        .append("div")
        .classed("header-label", true)
        .text(d => {
        return d.key;
    });
}
function setUpDropdowns(header_selectors) {
    header_selectors.each(function (column) {
        let selector = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).select("select");
        selector
            .select(`option[value=${_ColumnType__WEBPACK_IMPORTED_MODULE_0__["ColumnTypeDictionary"][column.value]}]`)
            .property("selected", true);
        selector.on("input", function (d) {
            let selectedOption = d3__WEBPACK_IMPORTED_MODULE_2__["select"](this).property("value");
            _app_app__WEBPACK_IMPORTED_MODULE_1__["pubsub"].emit("column-type-changed", d.key, parseInt(Object.keys(_ColumnType__WEBPACK_IMPORTED_MODULE_0__["ColumnTypeDictionary"]).find((k) => _ColumnType__WEBPACK_IMPORTED_MODULE_0__["ColumnTypeDictionary"][k] === selectedOption)));
        });
    });
}
function readDefaultColumnTypes(data, columns) {
    let cdt = {};
    columns.forEach(column => {
        let columnValues = data.map(d => d[column]);
        let type = getColumnType(columnValues);
        cdt[column] = type;
    });
    return cdt;
}
function getColumnType(arr) {
    if (isNumericArray(arr)) {
        if (isSetArray(arr))
            return _ColumnType__WEBPACK_IMPORTED_MODULE_0__["ColumnType"].Set;
        if (isDecimalArray(arr))
            return _ColumnType__WEBPACK_IMPORTED_MODULE_0__["ColumnType"].Number;
        if (isCategoricalArray(arr))
            return _ColumnType__WEBPACK_IMPORTED_MODULE_0__["ColumnType"].Categorical;
        return _ColumnType__WEBPACK_IMPORTED_MODULE_0__["ColumnType"].Number;
    }
    else {
        if (isCategoricalArray(arr))
            return _ColumnType__WEBPACK_IMPORTED_MODULE_0__["ColumnType"].Categorical;
    }
    return _ColumnType__WEBPACK_IMPORTED_MODULE_0__["ColumnType"].Label;
}
function isNumericArray(arr) {
    return !arr.every(isNaN);
}
function isDecimalArray(arr) {
    return arr.some(i => i % 1 !== 0);
}
function isTextArray(arr) {
    return arr.some(isNaN);
}
function isSetArray(arr) {
    let uniqueVals = [...new Set(arr)];
    return uniqueVals.length > 0 && uniqueVals.length <= 2;
}
function isCategoricalArray(arr) {
    let uniqueVals = [...new Set(arr)];
    return uniqueVals.length > 0 && uniqueVals.length < 10;
}
function isSetList(arr, seperator) {
    return arr.some(i => i.includes(seperator));
}
function updateDatasetInfoWithSets(data, info, cdt) {
    let sets = Object(_Utils_utils__WEBPACK_IMPORTED_MODULE_5__["FilterWithIndices"])(data.columns, (d) => cdt[d] === 2);
    let attributes = Object(_Utils_utils__WEBPACK_IMPORTED_MODULE_5__["FilterWithIndices"])(data.columns, (d) => cdt[d] !== 2);
    let consecutiveSets = sets.reduce((resultArray, item, idx, arr) => {
        if (item !== undefined) {
            if (arr[idx - 1] === undefined || arr[idx - 1] + 1 !== item) {
                resultArray.push([]);
            }
            resultArray[resultArray.length - 1].push(item);
        }
        return resultArray;
    }, []);
    info.sets = [];
    consecutiveSets.forEach((s) => {
        info.sets.push({
            format: "binary",
            start: s[0],
            end: s[s.length - 1]
        });
    });
    info.meta = [];
    attributes.forEach((attrIdx) => {
        let metaData = {
            type: "string",
            index: attrIdx,
            name: data.columns[attrIdx]
        };
        if (cdt[data.columns[attrIdx]] === _ColumnType__WEBPACK_IMPORTED_MODULE_0__["ColumnType"].Label)
            metaData.type = "id";
        let values = data.map(d => d[metaData.name]);
        if (isNumericArray(values)) {
            if (isDecimalArray(values.map(parseFloat))) {
                metaData.type = "float";
                metaData.min = d3__WEBPACK_IMPORTED_MODULE_2__["min"](values.map(parseFloat));
                metaData.max = d3__WEBPACK_IMPORTED_MODULE_2__["max"](values.map(parseFloat));
            }
            else {
                metaData.type = "integer";
                metaData.min = d3__WEBPACK_IMPORTED_MODULE_2__["min"](values.map(parseInt));
                metaData.max = d3__WEBPACK_IMPORTED_MODULE_2__["max"](values.map(parseInt));
            }
        }
        info.meta.push(metaData);
    });
    _app_app__WEBPACK_IMPORTED_MODULE_1__["pubsub"].emit("broadcast-dataset-info", info);
}


/***/ }),

/***/ "./src/lib/dsv_importer/src/TableView/dropdown.view.html":
/*!***************************************************************!*\
  !*** ./src/lib/dsv_importer/src/TableView/dropdown.view.html ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// HTML
/* harmony default export */ __webpack_exports__["default"] = (`<div class="select">
  <select>
    <option value="Number">Number</option>
    <option value="Label">Label</option>
    <option value="Set">Set</option>
    <option value="Set List">Set List</option>
    <option value="Categorical">Categorical</option>
  </select>
</div>`);

/***/ }),

/***/ "./src/lib/dsv_importer/src/TableView/styles.scss":
/*!********************************************************!*\
  !*** ./src/lib/dsv_importer/src/TableView/styles.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/mini-css-extract-plugin/dist/loader.js!../../../../../node_modules/css-loader!../../../../../node_modules/postcss-loader/lib??ref--5-3!../../../../../node_modules/sass-loader/lib/loader.js!./styles.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/lib/dsv_importer/src/TableView/styles.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/lib/dsv_importer/src/Utils/PubSub.ts":
/*!**************************************************!*\
  !*** ./src/lib/dsv_importer/src/Utils/PubSub.ts ***!
  \**************************************************/
/*! exports provided: mitt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mitt", function() { return mitt; });
function mitt(all) {
    all = all || Object.create(null);
    return {
        on(type, handler, ctx) {
            if (ctx)
                (all[type] || (all[type] = [])).push(handler.bind(ctx));
            (all[type] || (all[type] = [])).push(handler);
        },
        off(type, handler) {
            if (all[type])
                all[type].splice(all[type].indexOf(handler) >>> 0, 1);
        },
        emit(type, ...evt) {
            (all[type] || []).slice().map(handler => {
                handler(...evt);
            });
        }
    };
}


/***/ }),

/***/ "./src/lib/dsv_importer/src/Utils/utils.ts":
/*!*************************************************!*\
  !*** ./src/lib/dsv_importer/src/Utils/utils.ts ***!
  \*************************************************/
/*! exports provided: isValidEmail, stringIsNumber, enumToArray, FilterWithIndices */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isValidEmail", function() { return isValidEmail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringIsNumber", function() { return stringIsNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enumToArray", function() { return enumToArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FilterWithIndices", function() { return FilterWithIndices; });
function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const stringIsNumber = (val) => isNaN(Number(val)) === false;
function enumToArray(enm) {
    return Object.keys(enm)
        .filter(stringIsNumber)
        .map(k => {
        return {
            key: k,
            value: enm[k]
        };
    });
}
function FilterWithIndices(arr, predicate) {
    let temp = [];
    arr.forEach((item, idx) => {
        if (predicate(item))
            temp.push(idx);
    });
    return temp;
}


/***/ }),

/***/ "./src/lib/dsv_importer/src/app/app.ts":
/*!*********************************************!*\
  !*** ./src/lib/dsv_importer/src/app/app.ts ***!
  \*********************************************/
/*! exports provided: pubsub, serverUrl, CreateFileUploadView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pubsub", function() { return pubsub; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "serverUrl", function() { return serverUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateFileUploadView", function() { return CreateFileUploadView; });
/* harmony import */ var _layout_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layout_config */ "./src/lib/dsv_importer/src/app/layout_config.ts");
/* harmony import */ var golden_layout_dist_goldenlayout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! golden-layout/dist/goldenlayout */ "./src/lib/dsv_importer/node_modules/golden-layout/dist/goldenlayout.js");
/* harmony import */ var golden_layout_dist_goldenlayout__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(golden_layout_dist_goldenlayout__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var golden_layout_src_css_goldenlayout_base_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! golden-layout/src/css/goldenlayout-base.css */ "./src/lib/dsv_importer/node_modules/golden-layout/src/css/goldenlayout-base.css");
/* harmony import */ var golden_layout_src_css_goldenlayout_base_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(golden_layout_src_css_goldenlayout_base_css__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles.scss */ "./src/lib/dsv_importer/src/app/styles.scss");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _FileView_FileView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../FileView/FileView */ "./src/lib/dsv_importer/src/FileView/FileView.ts");
/* harmony import */ var _Utils_PubSub__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Utils/PubSub */ "./src/lib/dsv_importer/src/Utils/PubSub.ts");






const pubsub = Object(_Utils_PubSub__WEBPACK_IMPORTED_MODULE_5__["mitt"])();
const serverUrl = "http://18.224.213.250/";
let views = [
    {
        componentName: "FileView",
        componentState: {},
        type: "component",
        factory: _FileView_FileView__WEBPACK_IMPORTED_MODULE_4__["FileView"]
    },
    {
        componentName: "DatasetInfo",
        componentState: {},
        type: "component",
        factory: function (c, s) { }
    }
];
function CreateFileUploadView(root) {
    let layout;
    if (root)
        layout = new golden_layout_dist_goldenlayout__WEBPACK_IMPORTED_MODULE_1___default.a(_layout_config__WEBPACK_IMPORTED_MODULE_0__["default"], root.node());
    else
        layout = new golden_layout_dist_goldenlayout__WEBPACK_IMPORTED_MODULE_1___default.a(_layout_config__WEBPACK_IMPORTED_MODULE_0__["default"]);
    views.forEach(view => {
        layout.registerComponent(view.componentName, view.factory);
    });
    layout.init();
}
CreateFileUploadView();
// function test() {
//   vega
//     .loader()
//     .load("https://vega.github.io/vega/examples/bar-chart.vg.json")
//     .then(data => {
//       renderer(JSON.parse(data));
//     });
//   function renderer(data: any) {
//     let view = new vega.View(vega.parse(data))
//       .renderer("svg")
//       .initialize(".table-view")
//       .hover()
//       .run();
//     view.toImageURL("png").then(url => console.log(url));
//   }
// }


/***/ }),

/***/ "./src/lib/dsv_importer/src/app/layout_config.ts":
/*!*******************************************************!*\
  !*** ./src/lib/dsv_importer/src/app/layout_config.ts ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const config = {
    settings: {
        hasHeaders: false
    },
    content: [
        {
            type: "row",
            content: [
                {
                    type: "component",
                    componentName: "FileView",
                    componentState: {
                        label: "FileView"
                    },
                    width: 80
                },
                {
                    type: "component",
                    componentName: "DatasetInfo",
                    componentState: {
                        label: "DatasetInfo"
                    },
                    width: 20
                }
            ]
        }
    ]
};
/* harmony default export */ __webpack_exports__["default"] = (config);


/***/ }),

/***/ "./src/lib/dsv_importer/src/app/styles.scss":
/*!**************************************************!*\
  !*** ./src/lib/dsv_importer/src/app/styles.scss ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/mini-css-extract-plugin/dist/loader.js!../../../../../node_modules/css-loader!../../../../../node_modules/postcss-loader/lib??ref--5-3!../../../../../node_modules/sass-loader/lib/loader.js!./styles.scss */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/index.js!./node_modules/postcss-loader/lib/index.js??ref--5-3!./node_modules/sass-loader/lib/loader.js!./src/lib/dsv_importer/src/app/styles.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ 8:
/*!****************************!*\
  !*** node-fetch (ignored) ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 9:
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

/******/ });
//# sourceMappingURL=app.392842fbf8b68509d366.js.map
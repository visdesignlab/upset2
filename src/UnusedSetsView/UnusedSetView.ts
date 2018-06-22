/*
 * @Author: Kiran Gadhave
 * @Date: 2018-06-03 14:36:24
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-05 18:26:24
 */
import * as d3 from "d3";
import { ViewBase } from "provenance_mvvm_framework";
import { IDataSetInfo } from "./../DataStructure/IDataSetInfo";

export class UnusedSetInfoView extends ViewBase {
  constructor(root: HTMLElement) {
    super(root);
  }

  create() {}

  update(data: IDataSetInfo) {}
}

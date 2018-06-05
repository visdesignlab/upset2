/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 16:44:35 
 * @Last Modified by: Kiran Gadhave
 * @Last Modified time: 2018-06-03 16:50:12
 */

import { RowType } from "./RowType";

/**
 * * Base element for all rows(sets, groups, subsets and aggregates)
 *
 * @export
 * @class BaseElement
 */
export class BaseElement {
  id: number | string;
  elementName: string;
  items: number[];
  setSize: number;
  dataRatio: number;
  type: RowType;
  /**
   * Creates an instance of BaseElement.
   * @param {number} id
   * @param {string} elementName
   * @memberof BaseElement
   */
  constructor(id: number | string, elementName: string) {
    this.id = id;
    this.elementName = elementName;
    this.items = [];
    this.setSize = 0;
    this.dataRatio = 0.0;
  }
}

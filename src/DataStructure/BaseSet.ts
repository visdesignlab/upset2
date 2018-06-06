/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 16:44:40 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 16:44:40 
 */
import { BaseElement } from "./BaseElement";
import { interpolateSpectral } from "d3";
/**
 * Base class for Sets, subsets and groups
 *
 * @export
 * @class BaseSet
 * @extends {BaseElement}
 */
export class BaseSet extends BaseElement {
  combinedSets: number[];
  noCombinedSets: number;
  depth: number;
  /**
   *Creates an instance of BaseSet.
   * @param {number} setId
   * @param {string} setName
   * @param {number[]} combinedSets
   * @param {number[]} setData
   * @memberof BaseSet
   */
  constructor(
    setId: number | string,
    setName: string,
    combinedSets: number[],
    setData: number[],
    depth: number = 0
  ) {
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

  getSimilarityScore(
    set: BaseSet,
    index: (intersection: number, length1: number, length2: number) => number
  ): number {
    let intersection = [...new Set(set.items)].filter(x =>
      new Set(this.items).has(x)
    ).length;
    return index(intersection, this.items.length, set.items.length);
  }
}

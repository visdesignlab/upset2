/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 16:57:43 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 16:57:43 
 */
import { IDataSetJSON } from "./IDataSetJSON";
export type IDataSetInfo = {
  Name: string;
  SetCount: number;
  AttributeCount: number;
  _data: IDataSetJSON;
};

/*
 * @Author: Kiran Gadhave 
 * @Date: 2018-06-03 16:57:48 
 * @Last Modified by:   Kiran Gadhave 
 * @Last Modified time: 2018-06-03 16:57:48 
 */
import { ISetInfo } from "./ISetInfo";
import { IMetaData } from "./IMetaData";

export type IDataSetJSON = {
  file: string;
  name: string;
  header: number;
  separator: string;
  skip: number;
  meta: Array<IMetaData>;
  sets: Array<ISetInfo>;
  author: string;
  description: string;
  source: string;
};

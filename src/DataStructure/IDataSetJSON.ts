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

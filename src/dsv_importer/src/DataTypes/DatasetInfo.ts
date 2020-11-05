export type IMetaData = {
  type: string;
  index: number;
  name: string;
  min?: number;
  max?: number;
};

export type ISetInfo = {
  format: string;
  start: number;
  end: number;
};

export type DatasetInfo = {
  username: string;
  email: string;
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
  text: string;
};

export function getBlankDSInfo(): DatasetInfo {
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

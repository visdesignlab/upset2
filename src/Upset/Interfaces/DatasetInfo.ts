export type MetaData = {
  type: string;
  index: number;
  name: string;
  min?: number;
  max?: number;
};

export type SetInfo = {
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
  meta: Array<MetaData>;
  sets: Array<SetInfo>;
  author: string;
  description: string;
  source: string;
};

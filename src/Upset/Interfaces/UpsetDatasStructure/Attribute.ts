export interface Attribute {
  name: string;
  sort: number;
  type: string;
  values: any[];
  min?: number;
  max?: number;
}

export type Attributes = Attribute[];

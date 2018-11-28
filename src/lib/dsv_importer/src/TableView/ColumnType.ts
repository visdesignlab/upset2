export enum ColumnType {
  Number,
  Label,
  Set,
  Set_List,
  Categorical
}

export let ColumnTypeDictionary: { [key: number]: string } = {
  0: "Number",
  1: "Label",
  2: "Set",
  3: "Set List",
  4: "Categorical"
};

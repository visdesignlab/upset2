export enum StateOption {
  YES,
  MAYBE,
  NO
}

export type State = {
  state: StateOption;
};

export type Clause = {
  [key: string]: State;
};

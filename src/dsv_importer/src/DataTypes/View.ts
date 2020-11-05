import { Container } from "golden-layout";
export type View = {
  componentName: string;
  componentState: Object;
  type: string;
  factory: (container: Container, state: any) => void;
};

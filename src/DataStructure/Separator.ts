import { BaseElement } from "./BaseElement";
import { RowType } from "./RowType";

export class Separator extends BaseElement {
  constructor(id: string | number, elementName: string) {
    super(id, elementName);
    this.type = RowType.SEPERATOR;
  }
}

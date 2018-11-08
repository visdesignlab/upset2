import { Attribute } from "./../DataStructure/Attribute";
import { Data } from "./../DataStructure/Data";
import { RenderRow } from "./../type_declarations/types";
import { ElementView } from "./ElementView";
import { Application } from "provenance_mvvm_framework";
import { ViewModelBase } from "provenance_mvvm_framework";
import "./styles.scss";

export type ElementRenderRow = RenderRow & {
  arr: any[];
  color: string;
};

export type ElementRenderRows = ElementRenderRow[];

export class ElementViewModel extends ViewModelBase {
  private selectedSets: ElementRenderRows;
  private dataset: Data;

  constructor(view: ElementView, app: Application) {
    super(view, app);
    this.selectedSets = [];

    this.App.on("render-rows-changed", (data: Data) => {
      if (!this.dataset || this.dataset.name != data.name) {
        this.dataset = data;
        this.selectedSets = [];
        this.update();
      }
    });

    this.App.on("add-selection", this.addSelection, this);
    this.App.on("remove-selection", this.removeSelection, this);
    this.App.on(
      "add-selection-trigger",
      (d: RenderRow) => {
        this.comm.emit("add-selection-trigger", d);
      },
      this
    );

    this.App.on(
      "remove-selection-trigger",
      (idx: number) => {
        this.comm.emit("remove-selection-trigger", idx);
      },
      this
    );

    this.comm.on("add-selection-trigger", (d: RenderRow) => {
      let _do = {
        func: (d: RenderRow) => {
          this.App.emit("add-selection", d);
        },
        args: [d]
      };
      let _undo = {
        func: (idx: number) => {
          this.App.emit("remove-selection", idx);
        },
        args: [this.selectedSets.length]
      };
      this.apply.call(this, ["add-selection", _do, _undo]);
    });

    this.comm.on("remove-selection-trigger", (idx: number) => {
      let _do = {
        func: (idx: number) => {
          this.App.emit("remove-selection", idx);
        },
        args: [idx]
      };
      let _undo = {
        func: (d: RenderRow) => {
          this.App.emit("add-selection", d);
        },
        args: [this.selectedSets[idx]]
      };
      this.apply.call(this, ["remove-selection", _do, _undo]);
    });

    this.comm.on("apply", ([name, _do, _undo]) => {
      console.log(this.registry);
      this.apply.call(this, [name, _do, _undo]);
    });

    this.register();
  }

  register() {
    this.registerFunctions(
      "highlight-selection",
      (idx: number) => {
        this.comm.emit("highlight-selection", idx);
      },
      this
    );

    this.registerFunctions(
      "highlight-selection",
      (idx: number) => {
        this.comm.emit("highlight-selection", idx);
      },
      this,
      false
    );

    this.registerFunctions(
      "add-selection",
      (d: RenderRow) => {
        this.App.emit("add-selection", d);
      },
      this
    );

    this.registerFunctions(
      "add-selection",
      (idx: number) => {
        this.App.emit("remove-selection", idx);
      },
      this,
      false
    );

    this.registerFunctions(
      "remove-selection",
      (idx: number) => {
        this.App.emit("remove-selection", idx);
      },
      this
    );

    this.registerFunctions(
      "remove-selection",
      (d: RenderRow) => {
        this.App.emit("add-selection", d);
      },
      this,
      false
    );
  }

  addSelection(sel: RenderRow) {
    let validAttributes = this.dataset.attributes.filter(
      _ => _.name !== "Sets"
    );
    let n_row = createObjectsFromSubsets(sel, validAttributes);
    this.selectedSets.push(n_row);
    this.update();
  }

  removeSelection(idx: number) {
    let el = this.selectedSets.splice(idx, 1);
    removeColor(el[0].color);
    this.update();
  }

  update() {
    let validAttributes = this.dataset.attributes.filter(
      _ => _.name !== "Sets"
    );
    this.comm.emit("update", this.selectedSets, validAttributes);
  }
}

function createObjectsFromSubsets(
  row: RenderRow,
  attributes: Attribute[]
): ElementRenderRow {
  let items = row.data.items;
  let arr = items.map(i => {
    let obj: any = {};
    attributes.forEach((attr: Attribute) => {
      obj[attr.name] = attr.values[i];
    });

    return obj;
  });
  return {
    id: row.id,
    data: row.data,
    arr: arr,
    color: selectColor()
  };
}

let chosenColor: string[] = [];

function selectColor(): string {
  let availableColors = colorList.filter(c => chosenColor.indexOf(c) < 0);
  if (availableColors.length === 0) return "#000";
  chosenColor.push(availableColors[0]);
  return availableColors[0];
}

function removeColor(color: string) {
  if (chosenColor.indexOf(color) < 0) return;
  let idx = chosenColor.indexOf(color);
  chosenColor.splice(idx, 1);
}

export const colorList = [
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
  "#f032e6",
  "#bcf60c",
  "#fabebe",
  "#008080",
  "#9a6324",
  "#800000",
  "#aaffc3",
  "#808000",
  "#000075",
  "#000000"
];

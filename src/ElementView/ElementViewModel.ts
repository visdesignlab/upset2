import { Attribute } from "./../DataStructure/Attribute";
import { Data } from "./../DataStructure/Data";
import { RenderRow } from "./../type_declarations/types";
import { ElementView } from "./ElementView";
import { Application } from "provenance_mvvm_framework";
import { ViewModelBase } from "provenance_mvvm_framework";
import "./styles.scss";
import { HashCode } from "../lib/Utils";

export type ElementRenderRow = RenderRow & {
  arr: any[];
  color: string;
  idx: number[];
  hash: string;
  name: string;
  shown: boolean;
};

export type ElementRenderRows = ElementRenderRow[];

export class ElementViewModel extends ViewModelBase {
  private bookmarks: ElementRenderRows;
  private dataset: Data;
  private tempSelection: ElementRenderRow;

  constructor(view: ElementView, app: Application) {
    super(view, app);
    this.bookmarks = [];

    this.App.on("render-rows-changed", (data: Data) => {
      if (!this.dataset || this.dataset.name != data.name) {
        this.dataset = data;
        this.bookmarks = [];
        this.getDefault();
      }
    });

    this.App.on("new-bookmark-trigger", (d: RenderRow) => {
      let previousSelection = Object.assign({}, this.tempSelection);
      this.tempSelection = createObjectsFromSubsets(d, this.validAttributes());
      let _do = {
        func: (sel: ElementRenderRow) => {
          this.comm.emit("new-temp-selection", sel);
          this.update();
        },
        args: [this.tempSelection]
      };
      let _undo = {
        func: (sel: ElementRenderRow) => {
          this.comm.emit("new-temp-selection", sel);
          this.update();
        },
        args: [previousSelection]
      };

      this.apply.call(this, ["add-new-selection", _do, _undo]);
    });

    this.comm.on("reset-temp-selection", (sel: ElementRenderRow) => {
      let _do = {
        func: this.getDefault.bind(this),
        args: [] as any
      };
      let _undo = {
        func: (sel: ElementRenderRow) => {
          this.comm.emit("new-temp-selection", sel);
          this.update();
        },
        args: [sel]
      };
      this.apply.call(this, ["reset-temp-selection", _do, _undo]);
    });

    this.comm.on("add-selection-trigger", (sel: ElementRenderRow) => {
      if (this.bookmarks.map(_ => _.hash).indexOf(sel.hash) > -1) return;
      let _do = {
        func: this.addSelectionToBookmarks.bind(this),
        args: [sel]
      };
      let _undo = {
        func: this.removeSelectionFromBookmarks.bind(this),
        args: [sel]
      };
      this.apply.call(this, ["add-selection-to-bookmark", _do, _undo]);
    });

    this.comm.on("remove-selection-trigger", (sel: ElementRenderRow) => {
      let _do = {
        func: this.removeSelectionFromBookmarks.bind(this),
        args: [sel]
      };
      let _undo = {
        func: this.addSelectionToBookmarks.bind(this),
        args: [sel]
      };
      this.apply.call(this, ["remove-selection-to-bookmark", _do, _undo]);
    });

    this.comm.on("download-data", (data: number[]) => {
      this.App.emit("download-data", data);
    });

    this.comm.on("apply", ([name, _do, _undo]) => {
      this.apply.call(this, [name, _do, _undo]);
    });

    this.App.on("new-bookmark-trigger", (d: RenderRow) => {});

    this.register();
  }

  validAttributes() {
    return this.dataset.attributes.filter(_ => _.name != "Sets");
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
      "set-axis1",
      (d: string) => {
        this.comm.emit("set-axis1", d);
      },
      this
    );

    this.registerFunctions(
      "set-axis1",
      (d: string) => {
        this.comm.emit("set-axis1", d);
      },
      this,
      false
    );

    this.registerFunctions(
      "set-axis2",
      (d: string) => {
        this.comm.emit("set-axis2", d);
      },
      this
    );

    this.registerFunctions(
      "set-axis2",
      (d: string) => {
        this.comm.emit("set-axis2", d);
      },
      this,
      false
    );

    this.registerFunctions(
      "add-new-selection",
      (d: ElementRenderRow) => {
        this.comm.emit("new-temp-selection", d);
        this.update();
      },
      this
    );

    this.registerFunctions(
      "add-new-selection",
      (d: ElementRenderRow) => {
        this.comm.emit("new-temp-selection", d);
        this.update();
      },
      this,
      false
    );

    this.registerFunctions(
      "add-selection-to-bookmark",
      this.addSelectionToBookmarks,
      this
    );
    this.registerFunctions(
      "add-selection-to-bookmark",
      this.removeSelectionFromBookmarks,
      this,
      false
    );
    this.registerFunctions(
      "remove-selection-to-bookmark",
      this.removeSelectionFromBookmarks,
      this
    );
    this.registerFunctions(
      "remove-selection-to-bookmark",
      this.addSelectionToBookmarks,
      this,
      false
    );

    this.registerFunctions("reset-temp-selection", this.getDefault, this);
    this.registerFunctions(
      "reset-temp-selection",
      (sel: ElementRenderRow) => {
        this.comm.emit("new-temp-selection", sel);
        this.update();
      },
      this,
      false
    );
  }

  addSelectionToBookmarks(sel: ElementRenderRow) {
    this.bookmarks.push(sel);
    this.update();
  }

  removeSelectionFromBookmarks(sel: ElementRenderRow) {
    let idx = this.bookmarks.indexOf(sel);
    console.log(idx);
    let el = this.bookmarks.splice(idx, 1);
    this.update();
  }

  getDefault() {
    let validAttributes = this.dataset.attributes.filter(
      _ => _.name !== "Sets"
    );
    let erw = createObjectFromItems(this.dataset.allItems, validAttributes);
    this.tempSelection = erw;
    this.comm.emit("new-temp-selection", this.tempSelection);
    this.comm.emit("update", this.bookmarks, validAttributes);
  }

  update() {
    let validAttributes = this.dataset.attributes.filter(
      _ => _.name !== "Sets"
    );
    this.comm.emit("update", this.bookmarks, validAttributes);
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
    name: row.data.elementName,
    data: row.data,
    arr: arr,
    color: selectColor(),
    idx: items,
    hash: HashCode(row),
    shown: false
  };
}

function createObjectFromItems(
  items: number[],
  attributes: Attribute[]
): ElementRenderRow {
  let arr = items.map(i => {
    let obj: any = {};
    attributes.forEach((attr: Attribute) => {
      obj[attr.name] = attr.values[i];
    });

    return obj;
  });
  return {
    id: "All Rows",
    name: "All Rows",
    data: {
      setSize: items.length
    } as any,
    arr: arr,
    color: selectColor(),
    idx: items,
    hash: HashCode(items),
    shown: false
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
  "#3cb44b",
  "#e6194b",
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

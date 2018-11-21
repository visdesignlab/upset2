import * as d3 from "d3";
import { ViewBase } from "provenance_mvvm_framework";
import modalHtml from "./dataset.selection.modal.view.html";
import { d3Selection } from "../type_declarations/types";
import { CreateFileUploadView } from "../lib/dsv_importer/src/app/app";
import listHtml from "./dataset.list.view.html";
import datasetCardHtml from "./dataset.info.view.html";
import { serverUrl } from "../app/app";
import { DataUtils } from "../DataStructure/DataUtils";

export class DatasetSelectionView extends ViewBase {
  modal: d3Selection;
  modalContent: d3Selection;
  constructor(root: HTMLElement) {
    super(root);
    let modalDiv = d3
      .select(root)
      .append("div")
      .html(modalHtml);
    this.modal = modalDiv.select("#dataset-modal");
    this.modalContent = modalDiv.select(".modal-content");
    this.setup();
  }

  setup() {
    this.modalContent.html(listHtml);
    this.comm.on("open-dataset-selection", this.update, this);
    this.modal.select(".modal-close").on("click", () => {
      this.modal.classed("is-active", false);
    });
  }

  create() {}

  update() {
    this.modal.classed("is-active", true);
    let list = this.modalContent.select("#list");
    d3.json(`${serverUrl}/download/list`).then((res: any[]) => {
      let that = this;

      let pres = list.selectAll(".box").data(res);
      pres.exit().remove();
      pres = pres
        .enter()
        .append("div")
        .classed("box", true)
        .merge(pres);
      pres.each(function(d) {
        let el = d3.select(this);
        el.html("");
        el.html(datasetCardHtml);
        el.select("#dataset-name").text(d.info.name);
        el.select("#dataset-username").text(d.info.username);
        el.select("#dataset-description").text(d.info.description);
        el.select("#upload-date").text(
          new Date(parseInt(d.date)).toDateString()
        );

        el.on("click", () => {
          that.comm.emit(
            "change-dataset-trigger",
            DataUtils.getDataSetInfo(d.info, true)
          );
        });
      });
    });
    // CreateFileUploadView(this.modal.select('.modal-content'));
  }
}

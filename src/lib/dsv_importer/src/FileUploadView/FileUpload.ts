import { serverUrl } from "./../app/app";
import { DatasetInfo, getBlankDSInfo } from "./../DataTypes/DatasetInfo";
import { d3Selection } from "../type_declarations/types";
import html from "./FileUpload.view.html";
import "./styles.scss";
import * as d3 from "d3";
import { isValidEmail } from "../Utils/utils";
import { pubsub } from "../app/app";
import { dsvFormat } from "d3";

export function FileUpload(root: d3Selection) {
  root.html(html);
  let datasetInfo: DatasetInfo = getBlankDSInfo();
  let file: any;
  let fileInputElement = root.select(".file-input");
  let form = root.select(".input-form");
  let isFirstCall: boolean = true;

  let submitBtn = root.select("#submit-btn");
  submitBtn.property("disabled", true);

  pubsub.on("file-uploaded", (file: any, info: DatasetInfo) => {
    processFileUploadForm(form, file, info, isFirstCall);
    isFirstCall = false;
  });

  pubsub.on("broadcast-dataset-info", info => {
    console.log("Info", info);
    datasetInfo = info;
  });

  fileInputElement.on("input", () => {
    file = getUploadedFile();
    if (file) {
      root.select(".file-name").text(file.name);
      datasetInfo.separator = root.select(".delimiter").property("value");
      console.log(datasetInfo.separator);
      pubsub.emit("file-uploaded", file, datasetInfo);
    }
  });

  let delimiterDropdown = root.select(".delimiter");

  delimiterDropdown.on("input", function() {
    datasetInfo.separator = d3.select(this).property("value");
    pubsub.emit("file-uploaded", file, datasetInfo);
    pubsub.emit("broadcast-dataset-info", datasetInfo);
  });
}

function processFileUploadForm(
  inputForm: d3Selection,
  file: any,
  datasetInfo: DatasetInfo,
  firstCall: boolean = false
) {
  let submitBtn = inputForm.select("#submit-btn");

  if (firstCall) {
    inputForm.selectAll("input").on("input", () => {
      processFileUploadForm(inputForm, file, datasetInfo);
    });
    inputForm.selectAll("textarea").on("input", () => {
      processFileUploadForm(inputForm, file, datasetInfo);
    });
    submitBtn.on("click", () => {
      let fd: any = new FormData();
      fd.append("file", d3.select(".file-input").property("files")[0]);
      fd.append("metadata", JSON.stringify(datasetInfo).replace(/\\\\/g, "\\"));
      let xhr = new XMLHttpRequest();
      xhr.open("POST", `${serverUrl}upload/single`);
      xhr.send(fd);
    });
  }
  let warningDiv = inputForm.select(".notification");
  let warnings: string[] = [];
  let name = inputForm.select("input[name=fullname]").property("value");
  let email = inputForm.select("input[name=email]").property("value");
  let datasetName = inputForm.select("input[name=dataset]").property("value");
  let authors = inputForm.select("input[name=authors]").property("value");
  let description = inputForm
    .select("textarea[name=description")
    .property("value");

  if (!file) {
    warnings.push("Please select file to upload");
  }
  if (file.size > 5242880) {
    warnings.push("File too large");
  }
  if (!name || !name.trim()) {
    warnings.push("Please enter Full Name");
  }
  if (!email || !email.trim()) {
    warnings.push("Please enter a valid email id.");
  } else if (!isValidEmail(email)) {
    warnings.push("Please enter a valid email id");
  }
  if (!datasetName || !datasetName.trim()) {
    warnings.push("Please enter name for the dataset");
  }

  if (warnings.length > 0) {
    warningDiv.classed("is-hidden", false);
    warningDiv.html("");
    warnings.forEach(w => {
      warningDiv.append("div").text(w);
    });
    submitBtn.property("disabled", true);
    return;
  }
  warningDiv.classed("is-hidden", true);
  submitBtn.property("disabled", false);

  datasetInfo.username = name;
  datasetInfo.email = email;
  datasetInfo.name = datasetName;
  datasetInfo.author = authors;
  datasetInfo.description = description;
  pubsub.emit("broadcast-dataset-info", datasetInfo);
}

function getUploadedFile() {
  if (
    (window as any).File &&
    (window as any).FileReader &&
    (window as any).FileList &&
    (window as any).Blob
  ) {
  } else {
    alert("The File APIs are not fully supported in this browser.");
    throw new Error();
  }
  let file = (event.target as any).files[0];
  return file;
}

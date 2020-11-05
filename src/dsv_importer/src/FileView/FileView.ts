import { Container } from "golden-layout";
import * as d3 from "d3";
import html from "./file.view.html";
import { FileUpload } from "../FileUploadView/FileUpload";
import { TableView } from "../TableView/TableView";
import { test } from "../app/app";

export function FileView(container: Container, state: any) {
  let root = d3.select(container.getElement()[0]);
  root.html(html);
  let fileUpload = root.select(".file-upload-view");
  FileUpload(fileUpload);
  let tableview = root.select(".table-view");
  TableView(tableview);
}

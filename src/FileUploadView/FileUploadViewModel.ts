import {
  Application,
  ViewModelBase
} from "provenance_mvvm_framework";
import { FileUploadView } from "./FileUploadView";

export class FileUploadViewModel extends ViewModelBase {
  constructor(view: FileUploadView, app: Application) {
    super(view, app);
  }

  update() {
  }
}

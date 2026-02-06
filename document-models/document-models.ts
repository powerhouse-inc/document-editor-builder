import type { DocumentModelModule } from "document-model";
import { DocumentEditorBuilder } from "./document-editor-builder/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  DocumentEditorBuilder,
];

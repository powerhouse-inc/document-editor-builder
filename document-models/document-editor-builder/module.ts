import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { DocumentEditorBuilderPHState } from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";

/** Document model module for the Todo List document type */
export const DocumentEditorBuilder: DocumentModelModule<DocumentEditorBuilderPHState> =
  {
    version: 1,
    reducer,
    actions,
    utils,
    documentModel: createState(defaultBaseState(), documentModel),
  };

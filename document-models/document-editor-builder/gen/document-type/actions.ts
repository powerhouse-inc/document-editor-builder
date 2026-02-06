import type { Action } from "document-model";
import type {
  SetDocumentTypeInput,
  SetNewDocumentNameInput,
} from "../types.js";

export type SetDocumentTypeAction = Action & {
  type: "SET_DOCUMENT_TYPE";
  input: SetDocumentTypeInput;
};
export type SetNewDocumentNameAction = Action & {
  type: "SET_NEW_DOCUMENT_NAME";
  input: SetNewDocumentNameInput;
};

export type DocumentEditorBuilderDocumentTypeAction =
  | SetDocumentTypeAction
  | SetNewDocumentNameAction;

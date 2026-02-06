import { type SignalDispatch } from "document-model";
import type {
  SetDocumentTypeAction,
  SetNewDocumentNameAction,
} from "./actions.js";
import type { DocumentEditorBuilderState } from "../types.js";

export interface DocumentEditorBuilderDocumentTypeOperations {
  setDocumentTypeOperation: (
    state: DocumentEditorBuilderState,
    action: SetDocumentTypeAction,
    dispatch?: SignalDispatch,
  ) => void;
  setNewDocumentNameOperation: (
    state: DocumentEditorBuilderState,
    action: SetNewDocumentNameAction,
    dispatch?: SignalDispatch,
  ) => void;
}

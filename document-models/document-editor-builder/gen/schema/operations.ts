import { type SignalDispatch } from "document-model";
import type { SetSchemaAction, ResetSchemaAction } from "./actions.js";
import type { DocumentEditorBuilderState } from "../types.js";

export interface DocumentEditorBuilderSchemaOperations {
  setSchemaOperation: (
    state: DocumentEditorBuilderState,
    action: SetSchemaAction,
    dispatch?: SignalDispatch,
  ) => void;
  resetSchemaOperation: (
    state: DocumentEditorBuilderState,
    action: ResetSchemaAction,
    dispatch?: SignalDispatch,
  ) => void;
}

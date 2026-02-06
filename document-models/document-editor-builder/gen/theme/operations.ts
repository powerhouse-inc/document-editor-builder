import { type SignalDispatch } from "document-model";
import type { EditThemeAction, EditRootGroupPropsAction } from "./actions.js";
import type { DocumentEditorBuilderState } from "../types.js";

export interface DocumentEditorBuilderThemeOperations {
  editThemeOperation: (
    state: DocumentEditorBuilderState,
    action: EditThemeAction,
    dispatch?: SignalDispatch,
  ) => void;
  editRootGroupPropsOperation: (
    state: DocumentEditorBuilderState,
    action: EditRootGroupPropsAction,
    dispatch?: SignalDispatch,
  ) => void;
}

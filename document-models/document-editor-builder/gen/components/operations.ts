import { type SignalDispatch } from "document-model";
import type {
  AddActionComponentAction,
  ReorderComponentsAction,
  RemoveComponentAction,
  EditActionComponentAction,
  EditFieldActionComponentAction,
  AddComponentAction,
  EditContentComponentAction,
  EditCustomComponentAction,
  CreateGroupAction,
  AddToGroupAction,
  RemoveFromGroupAction,
  EditGroupComponentAction,
  EditSpacerComponentAction,
} from "./actions.js";
import type { DocumentEditorBuilderState } from "../types.js";

export interface DocumentEditorBuilderComponentsOperations {
  addActionComponentOperation: (
    state: DocumentEditorBuilderState,
    action: AddActionComponentAction,
    dispatch?: SignalDispatch,
  ) => void;
  reorderComponentsOperation: (
    state: DocumentEditorBuilderState,
    action: ReorderComponentsAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeComponentOperation: (
    state: DocumentEditorBuilderState,
    action: RemoveComponentAction,
    dispatch?: SignalDispatch,
  ) => void;
  editActionComponentOperation: (
    state: DocumentEditorBuilderState,
    action: EditActionComponentAction,
    dispatch?: SignalDispatch,
  ) => void;
  editFieldActionComponentOperation: (
    state: DocumentEditorBuilderState,
    action: EditFieldActionComponentAction,
    dispatch?: SignalDispatch,
  ) => void;
  addComponentOperation: (
    state: DocumentEditorBuilderState,
    action: AddComponentAction,
    dispatch?: SignalDispatch,
  ) => void;
  editContentComponentOperation: (
    state: DocumentEditorBuilderState,
    action: EditContentComponentAction,
    dispatch?: SignalDispatch,
  ) => void;
  editCustomComponentOperation: (
    state: DocumentEditorBuilderState,
    action: EditCustomComponentAction,
    dispatch?: SignalDispatch,
  ) => void;
  createGroupOperation: (
    state: DocumentEditorBuilderState,
    action: CreateGroupAction,
    dispatch?: SignalDispatch,
  ) => void;
  addToGroupOperation: (
    state: DocumentEditorBuilderState,
    action: AddToGroupAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeFromGroupOperation: (
    state: DocumentEditorBuilderState,
    action: RemoveFromGroupAction,
    dispatch?: SignalDispatch,
  ) => void;
  editGroupComponentOperation: (
    state: DocumentEditorBuilderState,
    action: EditGroupComponentAction,
    dispatch?: SignalDispatch,
  ) => void;
  editSpacerComponentOperation: (
    state: DocumentEditorBuilderState,
    action: EditSpacerComponentAction,
    dispatch?: SignalDispatch,
  ) => void;
}

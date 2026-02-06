import type { Action } from "document-model";
import type {
  AddActionComponentInput,
  ReorderComponentsInput,
  RemoveComponentInput,
  EditActionComponentInput,
  EditFieldActionComponentInput,
  AddComponentInput,
  EditContentComponentInput,
  EditCustomComponentInput,
  CreateGroupInput,
  AddToGroupInput,
  RemoveFromGroupInput,
  EditGroupComponentInput,
  EditSpacerComponentInput,
} from "../types.js";

export type AddActionComponentAction = Action & {
  type: "ADD_ACTION_COMPONENT";
  input: AddActionComponentInput;
};
export type ReorderComponentsAction = Action & {
  type: "REORDER_COMPONENTS";
  input: ReorderComponentsInput;
};
export type RemoveComponentAction = Action & {
  type: "REMOVE_COMPONENT";
  input: RemoveComponentInput;
};
export type EditActionComponentAction = Action & {
  type: "EDIT_ACTION_COMPONENT";
  input: EditActionComponentInput;
};
export type EditFieldActionComponentAction = Action & {
  type: "EDIT_FIELD_ACTION_COMPONENT";
  input: EditFieldActionComponentInput;
};
export type AddComponentAction = Action & {
  type: "ADD_COMPONENT";
  input: AddComponentInput;
};
export type EditContentComponentAction = Action & {
  type: "EDIT_CONTENT_COMPONENT";
  input: EditContentComponentInput;
};
export type EditCustomComponentAction = Action & {
  type: "EDIT_CUSTOM_COMPONENT";
  input: EditCustomComponentInput;
};
export type CreateGroupAction = Action & {
  type: "CREATE_GROUP";
  input: CreateGroupInput;
};
export type AddToGroupAction = Action & {
  type: "ADD_TO_GROUP";
  input: AddToGroupInput;
};
export type RemoveFromGroupAction = Action & {
  type: "REMOVE_FROM_GROUP";
  input: RemoveFromGroupInput;
};
export type EditGroupComponentAction = Action & {
  type: "EDIT_GROUP_COMPONENT";
  input: EditGroupComponentInput;
};
export type EditSpacerComponentAction = Action & {
  type: "EDIT_SPACER_COMPONENT";
  input: EditSpacerComponentInput;
};

export type DocumentEditorBuilderComponentsAction =
  | AddActionComponentAction
  | ReorderComponentsAction
  | RemoveComponentAction
  | EditActionComponentAction
  | EditFieldActionComponentAction
  | AddComponentAction
  | EditContentComponentAction
  | EditCustomComponentAction
  | CreateGroupAction
  | AddToGroupAction
  | RemoveFromGroupAction
  | EditGroupComponentAction
  | EditSpacerComponentAction;

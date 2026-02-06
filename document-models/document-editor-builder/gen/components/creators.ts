import { createAction } from "document-model/core";
import {
  AddActionComponentInputSchema,
  ReorderComponentsInputSchema,
  RemoveComponentInputSchema,
  EditActionComponentInputSchema,
  EditFieldActionComponentInputSchema,
  AddComponentInputSchema,
  EditContentComponentInputSchema,
  EditCustomComponentInputSchema,
  CreateGroupInputSchema,
  AddToGroupInputSchema,
  RemoveFromGroupInputSchema,
  EditGroupComponentInputSchema,
  EditSpacerComponentInputSchema,
} from "../schema/zod.js";
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

export const addActionComponent = (input: AddActionComponentInput) =>
  createAction<AddActionComponentAction>(
    "ADD_ACTION_COMPONENT",
    { ...input },
    undefined,
    AddActionComponentInputSchema,
    "global",
  );

export const reorderComponents = (input: ReorderComponentsInput) =>
  createAction<ReorderComponentsAction>(
    "REORDER_COMPONENTS",
    { ...input },
    undefined,
    ReorderComponentsInputSchema,
    "global",
  );

export const removeComponent = (input: RemoveComponentInput) =>
  createAction<RemoveComponentAction>(
    "REMOVE_COMPONENT",
    { ...input },
    undefined,
    RemoveComponentInputSchema,
    "global",
  );

export const editActionComponent = (input: EditActionComponentInput) =>
  createAction<EditActionComponentAction>(
    "EDIT_ACTION_COMPONENT",
    { ...input },
    undefined,
    EditActionComponentInputSchema,
    "global",
  );

export const editFieldActionComponent = (
  input: EditFieldActionComponentInput,
) =>
  createAction<EditFieldActionComponentAction>(
    "EDIT_FIELD_ACTION_COMPONENT",
    { ...input },
    undefined,
    EditFieldActionComponentInputSchema,
    "global",
  );

export const addComponent = (input: AddComponentInput) =>
  createAction<AddComponentAction>(
    "ADD_COMPONENT",
    { ...input },
    undefined,
    AddComponentInputSchema,
    "global",
  );

export const editContentComponent = (input: EditContentComponentInput) =>
  createAction<EditContentComponentAction>(
    "EDIT_CONTENT_COMPONENT",
    { ...input },
    undefined,
    EditContentComponentInputSchema,
    "global",
  );

export const editCustomComponent = (input: EditCustomComponentInput) =>
  createAction<EditCustomComponentAction>(
    "EDIT_CUSTOM_COMPONENT",
    { ...input },
    undefined,
    EditCustomComponentInputSchema,
    "global",
  );

export const createGroup = (input: CreateGroupInput) =>
  createAction<CreateGroupAction>(
    "CREATE_GROUP",
    { ...input },
    undefined,
    CreateGroupInputSchema,
    "global",
  );

export const addToGroup = (input: AddToGroupInput) =>
  createAction<AddToGroupAction>(
    "ADD_TO_GROUP",
    { ...input },
    undefined,
    AddToGroupInputSchema,
    "global",
  );

export const removeFromGroup = (input: RemoveFromGroupInput) =>
  createAction<RemoveFromGroupAction>(
    "REMOVE_FROM_GROUP",
    { ...input },
    undefined,
    RemoveFromGroupInputSchema,
    "global",
  );

export const editGroupComponent = (input: EditGroupComponentInput) =>
  createAction<EditGroupComponentAction>(
    "EDIT_GROUP_COMPONENT",
    { ...input },
    undefined,
    EditGroupComponentInputSchema,
    "global",
  );

export const editSpacerComponent = (input: EditSpacerComponentInput) =>
  createAction<EditSpacerComponentAction>(
    "EDIT_SPACER_COMPONENT",
    { ...input },
    undefined,
    EditSpacerComponentInputSchema,
    "global",
  );

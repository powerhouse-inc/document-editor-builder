// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { DocumentEditorBuilderPHState } from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";

import { documentEditorBuilderDocumentTypeOperations } from "../src/reducers/document-type.js";
import { documentEditorBuilderComponentsOperations } from "../src/reducers/components.js";
import { documentEditorBuilderSchemaOperations } from "../src/reducers/schema.js";
import { documentEditorBuilderThemeOperations } from "../src/reducers/theme.js";

import {
  SetDocumentTypeInputSchema,
  SetNewDocumentNameInputSchema,
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
  SetSchemaInputSchema,
  ResetSchemaInputSchema,
  EditThemeInputSchema,
  EditRootGroupPropsInputSchema,
} from "./schema/zod.js";

const stateReducer: StateReducer<DocumentEditorBuilderPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }
  switch (action.type) {
    case "SET_DOCUMENT_TYPE": {
      SetDocumentTypeInputSchema().parse(action.input);

      documentEditorBuilderDocumentTypeOperations.setDocumentTypeOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_NEW_DOCUMENT_NAME": {
      SetNewDocumentNameInputSchema().parse(action.input);

      documentEditorBuilderDocumentTypeOperations.setNewDocumentNameOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_ACTION_COMPONENT": {
      AddActionComponentInputSchema().parse(action.input);

      documentEditorBuilderComponentsOperations.addActionComponentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REORDER_COMPONENTS": {
      ReorderComponentsInputSchema().parse(action.input);

      documentEditorBuilderComponentsOperations.reorderComponentsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_COMPONENT": {
      RemoveComponentInputSchema().parse(action.input);

      documentEditorBuilderComponentsOperations.removeComponentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "EDIT_ACTION_COMPONENT": {
      EditActionComponentInputSchema().parse(action.input);

      documentEditorBuilderComponentsOperations.editActionComponentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "EDIT_FIELD_ACTION_COMPONENT": {
      EditFieldActionComponentInputSchema().parse(action.input);

      documentEditorBuilderComponentsOperations.editFieldActionComponentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_COMPONENT": {
      AddComponentInputSchema().parse(action.input);

      documentEditorBuilderComponentsOperations.addComponentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "EDIT_CONTENT_COMPONENT": {
      EditContentComponentInputSchema().parse(action.input);

      documentEditorBuilderComponentsOperations.editContentComponentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "EDIT_CUSTOM_COMPONENT": {
      EditCustomComponentInputSchema().parse(action.input);

      documentEditorBuilderComponentsOperations.editCustomComponentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "CREATE_GROUP": {
      CreateGroupInputSchema().parse(action.input);

      documentEditorBuilderComponentsOperations.createGroupOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "ADD_TO_GROUP": {
      AddToGroupInputSchema().parse(action.input);

      documentEditorBuilderComponentsOperations.addToGroupOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "REMOVE_FROM_GROUP": {
      RemoveFromGroupInputSchema().parse(action.input);

      documentEditorBuilderComponentsOperations.removeFromGroupOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "EDIT_GROUP_COMPONENT": {
      EditGroupComponentInputSchema().parse(action.input);

      documentEditorBuilderComponentsOperations.editGroupComponentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "EDIT_SPACER_COMPONENT": {
      EditSpacerComponentInputSchema().parse(action.input);

      documentEditorBuilderComponentsOperations.editSpacerComponentOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "SET_SCHEMA": {
      SetSchemaInputSchema().parse(action.input);

      documentEditorBuilderSchemaOperations.setSchemaOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "RESET_SCHEMA": {
      ResetSchemaInputSchema().parse(action.input);

      documentEditorBuilderSchemaOperations.resetSchemaOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "EDIT_THEME": {
      EditThemeInputSchema().parse(action.input);

      documentEditorBuilderThemeOperations.editThemeOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    case "EDIT_ROOT_GROUP_PROPS": {
      EditRootGroupPropsInputSchema().parse(action.input);

      documentEditorBuilderThemeOperations.editRootGroupPropsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );

      break;
    }

    default:
      return state;
  }
};

export const reducer =
  createReducer<DocumentEditorBuilderPHState>(stateReducer);

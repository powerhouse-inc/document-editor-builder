import type { Action } from "document-model";
import type { SetSchemaInput, ResetSchemaInput } from "../types.js";

export type SetSchemaAction = Action & {
  type: "SET_SCHEMA";
  input: SetSchemaInput;
};
export type ResetSchemaAction = Action & {
  type: "RESET_SCHEMA";
  input: ResetSchemaInput;
};

export type DocumentEditorBuilderSchemaAction =
  | SetSchemaAction
  | ResetSchemaAction;

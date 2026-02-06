import type { Action } from "document-model";
import type { EditThemeInput, EditRootGroupPropsInput } from "../types.js";

export type EditThemeAction = Action & {
  type: "EDIT_THEME";
  input: EditThemeInput;
};
export type EditRootGroupPropsAction = Action & {
  type: "EDIT_ROOT_GROUP_PROPS";
  input: EditRootGroupPropsInput;
};

export type DocumentEditorBuilderThemeAction =
  | EditThemeAction
  | EditRootGroupPropsAction;

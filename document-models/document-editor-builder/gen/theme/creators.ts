import { createAction } from "document-model/core";
import {
  EditThemeInputSchema,
  EditRootGroupPropsInputSchema,
} from "../schema/zod.js";
import type { EditThemeInput, EditRootGroupPropsInput } from "../types.js";
import type { EditThemeAction, EditRootGroupPropsAction } from "./actions.js";

export const editTheme = (input: EditThemeInput) =>
  createAction<EditThemeAction>(
    "EDIT_THEME",
    { ...input },
    undefined,
    EditThemeInputSchema,
    "global",
  );

export const editRootGroupProps = (input: EditRootGroupPropsInput) =>
  createAction<EditRootGroupPropsAction>(
    "EDIT_ROOT_GROUP_PROPS",
    { ...input },
    undefined,
    EditRootGroupPropsInputSchema,
    "global",
  );

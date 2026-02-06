import { createAction } from "document-model/core";
import {
  SetDocumentTypeInputSchema,
  SetNewDocumentNameInputSchema,
} from "../schema/zod.js";
import type {
  SetDocumentTypeInput,
  SetNewDocumentNameInput,
} from "../types.js";
import type {
  SetDocumentTypeAction,
  SetNewDocumentNameAction,
} from "./actions.js";

export const setDocumentType = (input: SetDocumentTypeInput) =>
  createAction<SetDocumentTypeAction>(
    "SET_DOCUMENT_TYPE",
    { ...input },
    undefined,
    SetDocumentTypeInputSchema,
    "global",
  );

export const setNewDocumentName = (input: SetNewDocumentNameInput) =>
  createAction<SetNewDocumentNameAction>(
    "SET_NEW_DOCUMENT_NAME",
    { ...input },
    undefined,
    SetNewDocumentNameInputSchema,
    "global",
  );

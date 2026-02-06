import { createAction } from "document-model/core";
import { SetSchemaInputSchema, ResetSchemaInputSchema } from "../schema/zod.js";
import type { SetSchemaInput, ResetSchemaInput } from "../types.js";
import type { SetSchemaAction, ResetSchemaAction } from "./actions.js";

export const setSchema = (input: SetSchemaInput) =>
  createAction<SetSchemaAction>(
    "SET_SCHEMA",
    { ...input },
    undefined,
    SetSchemaInputSchema,
    "global",
  );

export const resetSchema = (input: ResetSchemaInput = {}) =>
  createAction<ResetSchemaAction>(
    "RESET_SCHEMA",
    { ...input },
    undefined,
    ResetSchemaInputSchema,
    "global",
  );

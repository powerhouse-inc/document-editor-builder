import type { DocumentEditorBuilderDocumentTypeAction } from "./document-type/actions.js";
import type { DocumentEditorBuilderComponentsAction } from "./components/actions.js";
import type { DocumentEditorBuilderSchemaAction } from "./schema/actions.js";
import type { DocumentEditorBuilderThemeAction } from "./theme/actions.js";

export * from "./document-type/actions.js";
export * from "./components/actions.js";
export * from "./schema/actions.js";
export * from "./theme/actions.js";

export type DocumentEditorBuilderAction =
  | DocumentEditorBuilderDocumentTypeAction
  | DocumentEditorBuilderComponentsAction
  | DocumentEditorBuilderSchemaAction
  | DocumentEditorBuilderThemeAction;

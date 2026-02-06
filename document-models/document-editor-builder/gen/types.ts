import type { PHDocument, PHBaseState } from "document-model";
import type { DocumentEditorBuilderAction } from "./actions.js";
import type { DocumentEditorBuilderState as DocumentEditorBuilderGlobalState } from "./schema/types.js";

type DocumentEditorBuilderLocalState = Record<PropertyKey, never>;

type DocumentEditorBuilderPHState = PHBaseState & {
  global: DocumentEditorBuilderGlobalState;
  local: DocumentEditorBuilderLocalState;
};
type DocumentEditorBuilderDocument = PHDocument<DocumentEditorBuilderPHState>;

export * from "./schema/types.js";

export type {
  DocumentEditorBuilderGlobalState,
  DocumentEditorBuilderLocalState,
  DocumentEditorBuilderPHState,
  DocumentEditorBuilderAction,
  DocumentEditorBuilderDocument,
};

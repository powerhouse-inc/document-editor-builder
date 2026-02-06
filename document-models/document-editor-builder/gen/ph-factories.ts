/**
 * Factory methods for creating DocumentEditorBuilderDocument instances
 */
import type { PHAuthState, PHDocumentState, PHBaseState } from "document-model";
import { createBaseState, defaultBaseState } from "document-model/core";
import type {
  DocumentEditorBuilderDocument,
  DocumentEditorBuilderLocalState,
  DocumentEditorBuilderGlobalState,
  DocumentEditorBuilderPHState,
} from "./types.js";
import { createDocument } from "./utils.js";

export function defaultGlobalState(): DocumentEditorBuilderGlobalState {
  return {
    documentName: null,
    documentType: null,
    schema: [],
    theme: {
      primaryColor: "#000000",
      backgroundColor: "#FFFFFF00",
      textColor: "#111827",
      secondaryTextColor: "#6B7280",
    },
    groupProps: {
      layout: "column",
      gap: 16,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      minWidth: null,
      maxWidth: null,
      minHeight: null,
      maxHeight: null,
      horizontalOrientation: null,
      verticalOrientation: null,
    },
  };
}

export function defaultLocalState(): DocumentEditorBuilderLocalState {
  return {};
}

export function defaultPHState(): DocumentEditorBuilderPHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<DocumentEditorBuilderGlobalState>,
): DocumentEditorBuilderGlobalState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as DocumentEditorBuilderGlobalState;
}

export function createLocalState(
  state?: Partial<DocumentEditorBuilderLocalState>,
): DocumentEditorBuilderLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as DocumentEditorBuilderLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<DocumentEditorBuilderGlobalState>,
  localState?: Partial<DocumentEditorBuilderLocalState>,
): DocumentEditorBuilderPHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a DocumentEditorBuilderDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createDocumentEditorBuilderDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<DocumentEditorBuilderGlobalState>;
    local?: Partial<DocumentEditorBuilderLocalState>;
  }>,
): DocumentEditorBuilderDocument {
  const document = createDocument(
    state
      ? createState(
          createBaseState(state.auth, state.document),
          state.global,
          state.local,
        )
      : undefined,
  );

  return document;
}

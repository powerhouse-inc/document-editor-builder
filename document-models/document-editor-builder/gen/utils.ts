import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type {
  DocumentEditorBuilderGlobalState,
  DocumentEditorBuilderLocalState,
} from "./types.js";
import type { DocumentEditorBuilderPHState } from "./types.js";
import { reducer } from "./reducer.js";
import { documentEditorBuilderDocumentType } from "./document-type.js";
import {
  isDocumentEditorBuilderDocument,
  assertIsDocumentEditorBuilderDocument,
  isDocumentEditorBuilderState,
  assertIsDocumentEditorBuilderState,
} from "./document-schema.js";

export const initialGlobalState: DocumentEditorBuilderGlobalState = {
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
export const initialLocalState: DocumentEditorBuilderLocalState = {};

export const utils: DocumentModelUtils<DocumentEditorBuilderPHState> = {
  fileExtension: ".phdm",
  createState(state) {
    return {
      ...defaultBaseState(),
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createDocument(state) {
    const document = baseCreateDocument(utils.createState, state);

    document.header.documentType = documentEditorBuilderDocumentType;

    // for backwards compatibility, but this is NOT a valid signed document id
    document.header.id = generateId();

    return document;
  },
  saveToFileHandle(document, input) {
    return baseSaveToFileHandle(document, input);
  },
  loadFromInput(input) {
    return baseLoadFromInput(input, reducer);
  },
  isStateOfType(state) {
    return isDocumentEditorBuilderState(state);
  },
  assertIsStateOfType(state) {
    return assertIsDocumentEditorBuilderState(state);
  },
  isDocumentOfType(document) {
    return isDocumentEditorBuilderDocument(document);
  },
  assertIsDocumentOfType(document) {
    return assertIsDocumentEditorBuilderDocument(document);
  },
};

export const createDocument = utils.createDocument;
export const createState = utils.createState;
export const saveToFileHandle = utils.saveToFileHandle;
export const loadFromInput = utils.loadFromInput;
export const isStateOfType = utils.isStateOfType;
export const assertIsStateOfType = utils.assertIsStateOfType;
export const isDocumentOfType = utils.isDocumentOfType;
export const assertIsDocumentOfType = utils.assertIsDocumentOfType;

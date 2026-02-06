import {
  BaseDocumentHeaderSchema,
  BaseDocumentStateSchema,
} from "document-model";
import { z } from "zod";
import { documentEditorBuilderDocumentType } from "./document-type.js";
import { DocumentEditorBuilderStateSchema } from "./schema/zod.js";
import type {
  DocumentEditorBuilderDocument,
  DocumentEditorBuilderPHState,
} from "./types.js";

/** Schema for validating the header object of a DocumentEditorBuilder document */
export const DocumentEditorBuilderDocumentHeaderSchema =
  BaseDocumentHeaderSchema.extend({
    documentType: z.literal(documentEditorBuilderDocumentType),
  });

/** Schema for validating the state object of a DocumentEditorBuilder document */
export const DocumentEditorBuilderPHStateSchema =
  BaseDocumentStateSchema.extend({
    global: DocumentEditorBuilderStateSchema(),
  });

export const DocumentEditorBuilderDocumentSchema = z.object({
  header: DocumentEditorBuilderDocumentHeaderSchema,
  state: DocumentEditorBuilderPHStateSchema,
  initialState: DocumentEditorBuilderPHStateSchema,
});

/** Simple helper function to check if a state object is a DocumentEditorBuilder document state object */
export function isDocumentEditorBuilderState(
  state: unknown,
): state is DocumentEditorBuilderPHState {
  return DocumentEditorBuilderPHStateSchema.safeParse(state).success;
}

/** Simple helper function to assert that a document state object is a DocumentEditorBuilder document state object */
export function assertIsDocumentEditorBuilderState(
  state: unknown,
): asserts state is DocumentEditorBuilderPHState {
  DocumentEditorBuilderPHStateSchema.parse(state);
}

/** Simple helper function to check if a document is a DocumentEditorBuilder document */
export function isDocumentEditorBuilderDocument(
  document: unknown,
): document is DocumentEditorBuilderDocument {
  return DocumentEditorBuilderDocumentSchema.safeParse(document).success;
}

/** Simple helper function to assert that a document is a DocumentEditorBuilder document */
export function assertIsDocumentEditorBuilderDocument(
  document: unknown,
): asserts document is DocumentEditorBuilderDocument {
  DocumentEditorBuilderDocumentSchema.parse(document);
}

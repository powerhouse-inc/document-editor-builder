import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentById,
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  DocumentEditorBuilderAction,
  DocumentEditorBuilderDocument,
} from "@powerhousedao/document-editor-builder/document-models/document-editor-builder";
import {
  assertIsDocumentEditorBuilderDocument,
  isDocumentEditorBuilderDocument,
} from "./gen/document-schema.js";

/** Hook to get a DocumentEditorBuilder document by its id */
export function useDocumentEditorBuilderDocumentById(
  documentId: string | null | undefined,
):
  | [
      DocumentEditorBuilderDocument,
      DocumentDispatch<DocumentEditorBuilderAction>,
    ]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isDocumentEditorBuilderDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected DocumentEditorBuilder document */
export function useSelectedDocumentEditorBuilderDocument(): [
  DocumentEditorBuilderDocument,
  DocumentDispatch<DocumentEditorBuilderAction>,
] {
  const [document, dispatch] = useSelectedDocument();

  assertIsDocumentEditorBuilderDocument(document);
  return [document, dispatch] as const;
}

/** Hook to get all DocumentEditorBuilder documents in the selected drive */
export function useDocumentEditorBuilderDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isDocumentEditorBuilderDocument);
}

/** Hook to get all DocumentEditorBuilder documents in the selected folder */
export function useDocumentEditorBuilderDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isDocumentEditorBuilderDocument);
}
